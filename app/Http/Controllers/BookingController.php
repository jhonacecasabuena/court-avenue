<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\BookingItem;
use App\Models\Court;
use App\Models\TimeSlot;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class BookingController extends Controller
{
    /**
     * Display booking page.
     */
    public function index(): Response
    {
        $courts = Court::query()
            ->where('status', 'available')
            ->orderBy('id')
            ->get();

        $timeSlots = TimeSlot::query()
            ->where('is_active', true)
            ->orderBy('start_time')
            ->get();

        /*
        |--------------------------------------------------------------------------
        | Get currently reserved slots
        |--------------------------------------------------------------------------
        |
        | Confirmed bookings are always unavailable.
        |
        | Pending bookings are unavailable only while their
        | 8-minute payment window has not expired.
        |
        */

        $bookedSlots = BookingItem::query()
                ->whereDate(
                    'booking_date',
                    '>=',
                    now()->toDateString()
                )
                ->whereHas('booking', function ($query) {
                    $query->where(function ($query) {
                        // Confirmed bookings are permanently reserved.
                        $query->where('status', 'confirmed')

                            // Pending bookings are reserved only for 8 minutes.
                            ->orWhere(function ($query) {
                                $query
                                    ->where('status', 'pending')
                                    ->where('expires_at', '>', now());
                            });
                    });
                })
                ->with('booking:id,status')
                ->get([
                    'booking_id',
                    'booking_date',
                    'court_id',
                    'time_slot_id',
                ])
                ->map(function ($item) {
                    return [
                        'date' => $item->booking_date->format('Y-m-d'),
                        'court_id' => $item->court_id,
                        'time_slot_id' => $item->time_slot_id,

                        // IMPORTANT
                        'status' => $item->booking->status,
                    ];
                })
                ->values();

        return Inertia::render(
            'court_avenue/booking/index',
            [
                'courts' => $courts,

                'timeSlots' => $timeSlots,

                'bookedSlots' => $bookedSlots,
            ]
        );
    }

    /**
     * Receive booking selection.
     *
     * Creates a PENDING booking and temporarily reserves
     * the selected court/time slots for 8 minutes.
     */
    public function checkout(Request $request)
    {
        $validated = $request->validate([
            'selections' => [
                'required',
                'array',
                'min:1',
            ],

            'selections.*.date' => [
                'required',
                'date',
            ],

            'selections.*.court_id' => [
                'required',
                'integer',
                'exists:courts,id',
            ],

            'selections.*.time_slot_id' => [
                'required',
                'integer',
                'exists:time_slots,id',
            ],

            /*
            |--------------------------------------------------------------------------
            | These are received from React only for the checkout flow.
            | The actual amount will be recalculated from the database.
            |--------------------------------------------------------------------------
            */

            'subtotal' => [
                'required',
                'numeric',
                'min:0',
            ],

            'service_fee' => [
                'required',
                'numeric',
                'min:0',
            ],

            'total' => [
                'required',
                'numeric',
                'min:0',
            ],
        ]);

        /*
        |--------------------------------------------------------------------------
        | Guest → Login
        |--------------------------------------------------------------------------
        |
        | Keep the selection in session first.
        |
        */

        $request->session()->put(
            'booking.checkout',
            $validated
        );

        if (! auth()->check()) {
            $request->session()->put(
                'url.intended',
                route('booking.checkout')
            );

            return redirect()->route('login');
        }

        /*
        |--------------------------------------------------------------------------
        | Logged in user
        |--------------------------------------------------------------------------
        |
        | We don't create the pending booking here yet if the
        | user was just redirected from login.
        |
        | The actual pending reservation is created below.
        |--------------------------------------------------------------------------
        */

        try {
            $booking = DB::transaction(function () use (
                $validated,
                $request
            ) {
                $user = $request->user();

                $selections = collect(
                    $validated['selections']
                )
                    ->unique(function ($selection) {
                        return implode('|', [
                            $selection['date'],
                            $selection['court_id'],
                            $selection['time_slot_id'],
                        ]);
                    })
                    ->values();

                /*
                |--------------------------------------------------------------------------
                | Load courts
                |--------------------------------------------------------------------------
                */

                $courtIds = $selections
                    ->pluck('court_id')
                    ->unique();

                $courts = Court::query()
                    ->whereIn('id', $courtIds)
                    ->get()
                    ->keyBy('id');

                if (
                    $courts->count() !==
                    $courtIds->count()
                ) {
                    throw new \RuntimeException(
                        'One or more selected courts are no longer available.'
                    );
                }

                /*
                |--------------------------------------------------------------------------
                | Check availability
                |--------------------------------------------------------------------------
                |
                | Confirmed = unavailable
                |
                | Pending + expires_at > now() = unavailable
                |
                | Pending + expires_at <= now() = available
                |
                */

                foreach ($selections as $selection) {
                    $alreadyReserved = BookingItem::query()
                        ->where(
                            'court_id',
                            $selection['court_id']
                        )
                        ->where(
                            'time_slot_id',
                            $selection['time_slot_id']
                        )
                        ->whereDate(
                            'booking_date',
                            $selection['date']
                        )
                        ->whereHas(
                            'booking',
                            function ($query) {
                                $query->where(
                                    'status',
                                    'confirmed'
                                )
                                ->orWhere(
                                    function ($query) {
                                        $query
                                            ->where(
                                                'status',
                                                'pending'
                                            )
                                            ->where(
                                                'expires_at',
                                                '>',
                                                now()
                                            );
                                    }
                                );
                            }
                        )
                        ->exists();

                    if ($alreadyReserved) {
                        throw new \RuntimeException(
                            'One or more selected court slots are no longer available. Please select another time.'
                        );
                    }
                }

                /*
                |--------------------------------------------------------------------------
                | Calculate actual price from database
                |--------------------------------------------------------------------------
                */

                $subtotal = $selections->sum(
                    function ($selection) use ($courts) {
                        return (float) $courts[
                            $selection['court_id']
                        ]->price;
                    }
                );

                $serviceFee = 20;

                $total = $subtotal + $serviceFee;

                /*
                |--------------------------------------------------------------------------
                | Generate booking reference
                |--------------------------------------------------------------------------
                */

                $bookingReference =
                    'CA-' .
                    now()->format('Ymd') .
                    '-' .
                    strtoupper(
                        Str::random(6)
                    );

                /*
                |--------------------------------------------------------------------------
                | Create PENDING booking
                |--------------------------------------------------------------------------
                |
                | IMPORTANT:
                |
                | The selected slots are now temporarily reserved.
                |
                | Payment must be completed within 8 minutes.
                |
                */

                $booking = Booking::create([
                    'user_id' => $user->id,

                    'booking_reference' =>
                        $bookingReference,

                    'subtotal' =>
                        $subtotal,

                    'service_fee' =>
                        $serviceFee,

                    'total' =>
                        $total,

                    'status' =>
                        'pending',

                    'payment_status' =>
                        'pending',

                    'payment_method' =>
                        'online',

                    'payment_reference' =>
                        null,

                    'paid_at' =>
                        null,

                    /*
                    |--------------------------------------------------------------------------
                    | 8-minute payment window
                    |--------------------------------------------------------------------------
                    */

                    'expires_at' =>
                        now()->addMinutes(8),
                ]);

                /*
                |--------------------------------------------------------------------------
                | Create booking items
                |--------------------------------------------------------------------------
                */

                foreach ($selections as $selection) {
                    $booking->items()->create([
                        'court_id' =>
                            $selection['court_id'],

                        'time_slot_id' =>
                            $selection['time_slot_id'],

                        'booking_date' =>
                            $selection['date'],

                        'price' =>
                            $courts[
                                $selection['court_id']
                            ]->price,
                    ]);
                }

                return $booking;
            });
        } catch (\RuntimeException $e) {
            return redirect()
                ->route('booking.index')
                ->with(
                    'error',
                    $e->getMessage()
                );
        }

        /*
        |--------------------------------------------------------------------------
        | Store pending booking ID
        |--------------------------------------------------------------------------
        */

        $request->session()->put(
            'booking.pending_id',
            $booking->id
        );

        /*
        |--------------------------------------------------------------------------
        | Redirect to payment checkout
        |--------------------------------------------------------------------------
        */

        return redirect()->route(
            'booking.checkout'
        );
    }

    /**
     * Display checkout page.
     */
    public function checkoutPage(Request $request)
    {
        /*
        |--------------------------------------------------------------------------
        | Get pending booking
        |--------------------------------------------------------------------------
        */

        $pendingBookingId = $request->session()->get(
            'booking.pending_id'
        );

        /*
        |--------------------------------------------------------------------------
        | Backward compatibility with old session selection
        |--------------------------------------------------------------------------
        */

        if (! $pendingBookingId) {
            return redirect()
                ->route('booking.index')
                ->with(
                    'error',
                    'Your booking session has expired.'
                );
        }

        $bookingModel = Booking::query()
            ->where('id', $pendingBookingId)
            ->where(
                'user_id',
                auth()->id()
            )
            ->with([
                'items.court',
                'items.timeSlot',
            ])
            ->first();

        if (! $bookingModel) {
            $request->session()->forget(
                'booking.pending_id'
            );

            return redirect()
                ->route('booking.index')
                ->with(
                    'error',
                    'Your booking session has expired.'
                );
        }

        /*
        |--------------------------------------------------------------------------
        | Check 8-minute expiration
        |--------------------------------------------------------------------------
        */

        if (
            $bookingModel->status === 'pending' &&
            $bookingModel->expires_at &&
            $bookingModel->expires_at->isPast()
        ) {
            $bookingModel->update([
                'status' =>
                    'cancelled',

                'payment_status' =>
                    'expired',
            ]);

            $request->session()->forget(
                'booking.pending_id'
            );

            return redirect()
                ->route('booking.index')
                ->with(
                    'error',
                    'Your payment window expired. Please select your court and time again.'
                );
        }

        /*
        |--------------------------------------------------------------------------
        | Get booking items
        |--------------------------------------------------------------------------
        */

        $selections = $bookingModel->items
            ->map(function ($item) {
                return [
                    'date' =>
                        $item->booking_date
                            ->format('Y-m-d'),

                    'court_id' =>
                        $item->court_id,

                    'court_name' =>
                        $item->court?->name,

                    'court_price' =>
                        $item->court?->price,

                    'time_slot_id' =>
                        $item->time_slot_id,

                    'start_time' =>
                        $item->timeSlot?->start_time,

                    'end_time' =>
                        $item->timeSlot?->end_time,
                ];
            })
            ->values()
            ->all();

        /*
        |--------------------------------------------------------------------------
        | Return checkout page
        |--------------------------------------------------------------------------
        */

        return Inertia::render(
            'court_avenue/booking/checkout',
            [
                'booking' => [
                    'id' =>
                        $bookingModel->id,

                    'booking_reference' =>
                        $bookingModel->booking_reference,

                    'status' =>
                        $bookingModel->status,

                    'payment_status' =>
                        $bookingModel->payment_status,

                    'expires_at' =>
                        $bookingModel->expires_at,

                    'subtotal' =>
                        $bookingModel->subtotal,

                    'service_fee' =>
                        $bookingModel->service_fee,

                    'total' =>
                        $bookingModel->total,

                    'selections' =>
                        $selections,
                ],
            ]
        );
    }

    /**
     * Confirm paid booking.
     *
     * TEMPORARY:
     * This currently simulates successful payment.
     *
     * Later, PayMongo/Stripe webhook should perform
     * the actual confirmation.
     */
    public function confirmPaidBooking(
        Request $request
    ) {
        $pendingBookingId = $request->session()->get(
            'booking.pending_id'
        );

        if (! $pendingBookingId) {
            return redirect()
                ->route('booking.index')
                ->with(
                    'error',
                    'Your booking session has expired.'
                );
        }

        $user = $request->user();

        if (! $user) {
            return redirect()->route('login');
        }

        /*
        |--------------------------------------------------------------------------
        | Find pending booking
        |--------------------------------------------------------------------------
        */

        $booking = Booking::query()
            ->where('id', $pendingBookingId)
            ->where(
                'user_id',
                $user->id
            )
            ->with([
                'items',
                'items.court',
                'items.timeSlot',
            ])
            ->first();

        if (! $booking) {
            $request->session()->forget(
                'booking.pending_id'
            );

            return redirect()
                ->route('booking.index')
                ->with(
                    'error',
                    'Your booking could not be found.'
                );
        }

        /*
        |--------------------------------------------------------------------------
        | Check payment expiration
        |--------------------------------------------------------------------------
        */

        if (
            $booking->status === 'pending' &&
            $booking->expires_at &&
            $booking->expires_at->isPast()
        ) {
            $booking->update([
                'status' =>
                    'cancelled',

                'payment_status' =>
                    'expired',
            ]);

            $request->session()->forget(
                'booking.pending_id'
            );

            return redirect()
                ->route('booking.index')
                ->with(
                    'error',
                    'Your 8-minute payment window has expired. Please select your court and time again.'
                );
        }

        /*
        |--------------------------------------------------------------------------
        | Make sure booking is still pending
        |--------------------------------------------------------------------------
        */

        if ($booking->status !== 'pending') {
            return redirect()->route(
                'booking.confirmation',
                $booking->booking_reference
            );
        }

        /*
        |--------------------------------------------------------------------------
        | TEMPORARY PAYMENT CONFIRMATION
        |--------------------------------------------------------------------------
        |
        | Later this should be handled by PayMongo/Stripe webhook.
        |
        */

        $booking->update([
            'status' =>
                'confirmed',

            'payment_status' =>
                'paid',

            'payment_reference' =>
                null,

            'paid_at' =>
                now(),

            /*
            |--------------------------------------------------------------------------
            | No longer needs an expiration time.
            |--------------------------------------------------------------------------
            */

            'expires_at' =>
                null,
        ]);

        /*
        |--------------------------------------------------------------------------
        | Clear pending booking session
        |--------------------------------------------------------------------------
        */

        $request->session()->forget(
            'booking.pending_id'
        );

        /*
        |--------------------------------------------------------------------------
        | Confirmation
        |--------------------------------------------------------------------------
        */

        return redirect()->route(
            'booking.confirmation',
            $booking->booking_reference
        );
    }

    /**
     * Booking confirmation page.
     */
    public function confirmation(
        string $bookingReference
    ): Response {
        $booking = Booking::query()
            ->where(
                'booking_reference',
                $bookingReference
            )
            ->where(
                'user_id',
                auth()->id()
            )
            ->with([
                'items.court',
                'items.timeSlot',
            ])
            ->firstOrFail();

        return Inertia::render(
            'court_avenue/booking/confirmation',
            [
                'booking' => $booking,
            ]
        );
    }


    public function myBookings(): Response
    {
        /*
        |--------------------------------------------------------------------------
        | Expire pending bookings whose 8-minute payment window has passed
        |--------------------------------------------------------------------------
        */

        Booking::query()
            ->where('user_id', auth()->id())
            ->where('status', 'pending')
            ->where('payment_status', 'pending')
            ->whereNotNull('expires_at')
            ->where('expires_at', '<=', now())
            ->update([
                'status' => 'cancelled',
                'payment_status' => 'expired',
            ]);

        /*
        |--------------------------------------------------------------------------
        | Get user's bookings
        |--------------------------------------------------------------------------
        */

        $bookings = Booking::query()
            ->where('user_id', auth()->id())
            ->with([
                'items.court',
                'items.timeSlot',
            ])
            ->latest()
            ->get();

        return Inertia::render(
            'court_avenue/booking/my_bookings',
            [
                'bookings' => $bookings,
            ]
        );
    }
}