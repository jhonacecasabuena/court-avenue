<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Booking;
use App\Models\BookingItem;
use App\Models\Court;
use App\Models\TimeSlot;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;


class AdminController extends Controller
{
    public function index(Request $request): Response
    {
        /*
        |--------------------------------------------------------------------------
        | Current date and time (Philippines)
        |--------------------------------------------------------------------------
        */

        $now = now('Asia/Manila');
        $today = $now->toDateString();
        $yesterday = $now->copy()->subDay()->toDateString();

        /*
        |--------------------------------------------------------------------------
        | Delete expired unpaid bookings
        |--------------------------------------------------------------------------
        */

        Booking::query()
            ->where('status', 'pending')
            ->where('payment_status', 'pending')
            ->whereNotNull('expires_at')
            ->where('expires_at', '>=', $now)
            ->delete();

        /*
        |--------------------------------------------------------------------------
        | Available courts
        |--------------------------------------------------------------------------
        */

        $courts = Court::query()
            ->where('status', 'available')
            ->orderBy('id')
            ->get();

        /*
        |--------------------------------------------------------------------------
        | Active time slots
        |--------------------------------------------------------------------------
        */

        $timeSlots = TimeSlot::query()
            ->where('is_active', true)
            ->orderBy('start_time')
            ->get();

        /*
        |--------------------------------------------------------------------------
        | Booked slots for today and future dates
        |--------------------------------------------------------------------------
        */

        $bookedSlots = BookingItem::query()
            ->whereDate('booking_date', '>=', $today)
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

        /*
        |--------------------------------------------------------------------------
        | Total bookings
        |--------------------------------------------------------------------------
        | Counts pending and confirmed bookings only.
        */

        $totalBookings = Booking::query()
            ->whereIn('status', [
                'pending',
                'confirmed',
            ])
            ->count();

        /*
        |--------------------------------------------------------------------------
        | Pending bookings
        |--------------------------------------------------------------------------
        | Includes:
        | 1. Bookings awaiting payment confirmation after proof submission.
        | 2. Bookings with no payment proof uploaded yet.
        | 3. Active unpaid bookings that have not expired.
        */

        $pendingBookings = Booking::query()
            ->where('status', 'pending')
            ->where(function ($query) use ($now) {
                $query
                    // Proof submitted; awaiting admin confirmation.
                    ->where('payment_status', 'awaiting_confirmation')

                    // Payment is pending and the booking has not expired.
                    ->orWhere(function ($query) use ($now) {
                        $query->where('payment_status', 'pending')
                            ->where(function ($query) use ($now) {
                                $query->whereNull('expires_at')
                                    ->orWhere('expires_at', '>', $now);
                            });
                    });
            })
            ->count();

        /*
        |--------------------------------------------------------------------------
        | Confirmed bookings
        |--------------------------------------------------------------------------
        */

        $confirmedBookings = Booking::query()
            ->where('status', 'confirmed')
            ->count();

        /*
        |--------------------------------------------------------------------------
        | Today's bookings
        |--------------------------------------------------------------------------
        | Counts unique bookings with at least one booking item scheduled
        | for today. Multiple court/time selections count as one booking.
        */

        $todayBookings = BookingItem::query()
            ->whereDate('booking_date', $today)
            ->whereHas('booking', function ($query) {
                $query->whereIn('status', [
                    'pending',
                    'confirmed',
                ]);
            })
            ->distinct()
            ->count('booking_id');

        /*
        |--------------------------------------------------------------------------
        | Yesterday's bookings
        |--------------------------------------------------------------------------
        */

        $yesterdayBookings = BookingItem::query()
            ->whereDate('booking_date', $yesterday)
            ->whereHas('booking', function ($query) {
                $query->whereIn('status', [
                    'pending',
                    'confirmed',
                ]);
            })
            ->distinct()
            ->count('booking_id');

        
        /*
        |--------------------------------------------------------------------------
        | Selected revenue month
        |--------------------------------------------------------------------------
        */

            $revenueMonth = $request->query(
                'revenue_month',
                $now->format('Y-m')
            );

            // Validate YYYY-MM format and prevent selecting future months.
            if (
                ! preg_match('/^\d{4}-(0[1-9]|1[0-2])$/', $revenueMonth)
                || $revenueMonth > $now->format('Y-m')
            ) {
                $revenueMonth = $now->format('Y-m');
            }

            $revenueStart = \Carbon\Carbon::createFromFormat(
                '!Y-m',
                $revenueMonth,
                'Asia/Manila'
            );

            $revenueEnd = $revenueStart->copy()->addMonth();

            $previousRevenueMonth = $revenueStart->copy()
                ->subMonth()
                ->format('Y-m');

            $nextRevenueMonth = $revenueStart->copy()
                ->addMonth()
                ->format('Y-m');



        /*
        |--------------------------------------------------------------------------
        | Monthly revenue
        |--------------------------------------------------------------------------
        | Only confirmed bookings with paid payment status are included.
        | Revenue is grouped by the month payment was received.
        */

        $monthlyRevenue = (float) Booking::query()
            ->where('status', 'confirmed')
            ->where('payment_status', 'paid')
            ->whereNotNull('paid_at')
            ->where('paid_at', '>=', $revenueStart)
            ->where('paid_at', '<', $revenueEnd)
            ->sum('total');




        /*
        |--------------------------------------------------------------------------
        | Dashboard statistics
        |--------------------------------------------------------------------------
        */

        $bookingStats = [
            'total' => $totalBookings,
            'pending' => $pendingBookings,
            'confirmed' => $confirmedBookings,
            'today' => $todayBookings,
            'yesterday' => $yesterdayBookings,
        ];


        $activeMembers = Booking::query()
            ->join(
                'booking_items',
                'booking_items.booking_id',
                '=',
                'bookings.id'
            )
            ->whereBetween('booking_items.booking_date', [
                $revenueStart->toDateString(),
                $revenueEnd->copy()->subDay()->toDateString(),
            ])
            ->where('bookings.status', '!=', 'pending')
            ->where('bookings.payment_status', 'paid')
            ->distinct()
            ->count('bookings.user_id');

        /*
        |--------------------------------------------------------------------------
        | Return dashboard data
        |--------------------------------------------------------------------------
        */

        return Inertia::render(
            'court_avenue/admin/dashboard',
            [
                'courts' => $courts,
                'timeSlots' => $timeSlots,
                'bookedSlots' => $bookedSlots,
                'bookingStats' => $bookingStats,
                 'activeMembers' => $activeMembers,
                'revenueStats' => [
                    'amount' => $monthlyRevenue,
                    'month' => $revenueMonth,
                    'previousMonth' => $previousRevenueMonth,
                    'nextMonth' => $nextRevenueMonth,
                    'canGoNext' => $revenueMonth < $now->format('Y-m'),
                ],
            ]
        );
    }
}