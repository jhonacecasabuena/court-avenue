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
    public function index(): Response
    {
        // Delete all expired unpaid bookings.
        // No user_id condition — this applies to every user.
        Booking::query()
            ->where('status', 'pending')
            ->where('payment_status', 'pending')
            ->whereNotNull('expires_at')
            ->where('expires_at', '<=', now())
            ->delete();

        $courts = Court::query()
            ->where('status', 'available')
            ->orderBy('id')
            ->get();

        $timeSlots = TimeSlot::query()
            ->where('is_active', true)
            ->orderBy('start_time')
            ->get();

        $bookedSlots = BookingItem::query()
            ->whereDate(
                'booking_date',
                '>=',
                now()->toDateString()
            )
            ->whereHas('booking', function ($query) {
                $query->whereIn('status', [
                    'pending',
                    'confirmed',
                ]);
            })
            ->with('booking:id,status,payment_status')
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

    public function uploadPaymentProof(Request $request)
    {
        $request->validate([
            'booking_id' => ['required', 'integer'],
            'payment_proof' => [
                'required',
                'image',
                'mimes:jpg,jpeg,png,webp',
                'max:5120',
            ],
        ]);

        $booking = Booking::query()
            ->where('id', $request->booking_id)
            ->where('user_id', auth()->id())
            ->firstOrFail();

        // Only allow payment proof for pending unpaid bookings
        if (
            $booking->status !== 'pending' ||
            $booking->payment_status !== 'pending' ||
            $booking->payment_proof
        ) {
            return back()->with(
                'error',
                'This booking is not available for payment proof upload.'
            );
        }

        // Check payment expiration
        if (
            $booking->expires_at &&
            $booking->expires_at->isPast()
        ) {
            $booking->delete();

            // $request->session()->forget('booking.pending_id');

            Inertia::flash('toast', [
                'type' => 'error',
                'message' => 'Your booking session has expired.',
            ]);

            return redirect()
                ->route('booking.my-bookings');
        }

        $path = $request->file('payment_proof')
            ->store('payment-proofs', 'public');

        $booking->update([
            'payment_proof' => $path,
            'payment_status' => 'awaiting_confirmation',
            'expires_at' => null,
        ]);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Payment proof uploaded successfully. Your payment is now awaiting confirmation.',
        ]);

        return redirect()
            ->route('booking.my-bookings');
    }


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
                        ->where('court_id', $selection['court_id'])
                        ->where('time_slot_id', $selection['time_slot_id'])
                        ->whereDate(
                            'booking_date',
                            $selection['date']
                        )
                        ->whereHas('booking', function ($query) {
                            $query->whereIn('status', [
                                'pending',
                                'confirmed',
                            ]);
                        })
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

                $serviceFee = 0;

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
                        'manual',

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
            
            Inertia::flash('toast', [
                'type' => 'error',
                'message' => 'Your booking session has expired.',
            ]);

            return redirect()
                ->route('booking.index');
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
      
            Inertia::flash('toast', [
                'type' => 'error',
                'message' => 'Your booking session has expired.',
            ]);

            return redirect()
                ->route('booking.index');
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
            // $bookingModel->update([
            //     'status' =>
            //         'cancelled',

            //     'payment_status' =>
            //         'expired',
            // ]);
            $bookingModel->delete();

            $request->session()->forget(
                'booking.pending_id'
            );

              Inertia::flash('toast', [
                'type' => 'error',
                'message' => 'Your payment window expired. Please select your court and time again.',
            ]);

            return redirect()
                ->route('booking.index');

 
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

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Booking details loaded successfully. You can now upload your payment proof.',
        ]);

        return Inertia::render(
            'court_avenue/booking/checkout',
            [
                'booking' => [
                    'id' =>
                        $bookingModel->id,

                    'booking_reference' =>
                        $bookingModel->booking_reference,

                    'created_at' =>
                        $bookingModel->created_at?->toISOString(),

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



    public function confirmPaidBooking(Request $request)
    {
        $pendingBookingId = $request->session()->get(
            'booking.pending_id'
        );

        if (! $pendingBookingId) {

            Inertia::flash('toast', [
                'type' => 'error',
                'message' => 'Your booking session has expired.',
            ]);

            return redirect()
                ->route('booking.index');
        }

        $user = $request->user();

        if (! $user) {
            return redirect()->route('login');
        }

        /*
        |--------------------------------------------------------------------------
        | Validate payment proof
        |--------------------------------------------------------------------------
        */

        $validated = $request->validate([
            'payment_proof' => [
                'required',
                'image',
                'mimes:jpg,jpeg,png,webp',
                'max:5120',
            ],
        ]);

        /*
        |--------------------------------------------------------------------------
        | Find pending booking
        |--------------------------------------------------------------------------
        */

        $booking = Booking::query()
            ->where('id', $pendingBookingId)
            ->where('user_id', $user->id)
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


            Inertia::flash('toast', [
                'type' => 'error',
                'message' => 'Your booking could not be found.',
            ]);

            return redirect()
                ->route('booking.index');
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
            // $booking->update([
            //     'status' => 'cancelled',
            //     'payment_status' => 'expired',
            // ]);

            // $request->session()->forget(
            //     'booking.pending_id'
            // );

            $booking->delete();

            $request->session()->forget(
                'booking.pending_id'
            );

            
            Inertia::flash('toast', [
                'type' => 'error',
                'message' => 'Your 8-minute payment window has expired. Please select your court and time again.',
            ]);

            return redirect()
                ->route('booking.index');

        }

        /*
        |--------------------------------------------------------------------------
        | Make sure booking is still pending
        |--------------------------------------------------------------------------
        */

        if ($booking->status !== 'pending') {
            return redirect()
                ->route(
                    'booking.confirmation',
                    $booking->booking_reference
                );
        }

        /*
        |--------------------------------------------------------------------------
        | Store payment proof
        |--------------------------------------------------------------------------
        */

        $proofPath = $request
            ->file('payment_proof')
            ->store(
                'payment-proofs',
                'public'
            );

        /*
        |--------------------------------------------------------------------------
        | Update booking
        |--------------------------------------------------------------------------
        |
        | IMPORTANT:
        |
        | Customer submission does NOT mark the booking as paid.
        |
        */

        $booking->update([
            'payment_proof' =>
                $proofPath,

            'status' =>
                'pending',

            'payment_status' =>
                'awaiting_confirmation',

            'payment_method' =>
                'manual',

            'payment_reference' =>
                null,

            'paid_at' =>
                null,

            /*
            |--------------------------------------------------------------------------
            | Keep expiration cleared after proof submission?
            |--------------------------------------------------------------------------
            |
            | Since the customer has already submitted payment proof,
            | the booking should now wait for admin verification.
            |
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
        | Redirect to My Bookings
        |--------------------------------------------------------------------------
        */

        
        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Booking submitted! Awaiting payment verification and confirmation',
        ]);

        return redirect()
            ->route('booking.my-bookings');
    }


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
            ->delete();
            // ->update([
            //     'status' => 'cancelled',
            //     'payment_status' => 'expired',
            // ]);

        /*
        |--------------------------------------------------------------------------
        | Get user's bookings
        |--------------------------------------------------------------------------
        */

        $user = auth()->user();

        $bookingsQuery = Booking::query()
            ->with([
                'user:id,name,email',
                'items.court',
                'items.timeSlot',
            ])
            ->latest();

        // Regular users can only view their own bookings.
        // Admins can view all bookings.
        if (! $user->hasRole('admin')) {
            $bookingsQuery->where('user_id', $user->id);
        }

        $bookings = $bookingsQuery->get();

        // $bookings = Booking::query()
        //     ->where('user_id', auth()->id())
        //     ->with([
        //         'items.court',
        //         'items.timeSlot',
        //     ])
        //     ->latest()
        //     ->get();

        return Inertia::render(
            'court_avenue/booking/my_bookings',
            [
                'bookings' => $bookings,
            ]
        );
    }


    public function cancel(Request $request, Booking $booking)
    {
        abort_unless(
            $booking->user_id === $request->user()->id,
            403
        );

        if ($booking->status !== 'pending') {
            return back()->with(
                'error',
                'Only pending bookings can be cancelled.'
            );
        }

        $booking->delete();

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Booking cancelled successfully.',
        ]);

        return redirect()->route('booking.my-bookings');
    }



    // Admin: Reject a booking because of invalid payment proof
    public function rejectAdmin(Request $request, Booking $booking)
    {
        // Only admins can reject bookings.
        abort_unless(
            $request->user()->hasRole('admin'),
            403
        );

        if (
            $booking->status !== 'pending' ||
            $booking->payment_status !== 'awaiting_confirmation' ||
            !$booking->payment_proof
        ) {

             Inertia::flash('toast', [
                'type' => 'error',
                'message' => 'This booking cannot be rejected. Verify its current status and payment proof.',
            ]);

            return redirect()->route('booking.my-bookings');
        }

        $booking->delete();

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Booking cancelled successfully.',
        ]);

        return redirect()->route('booking.my-bookings');
    }


}