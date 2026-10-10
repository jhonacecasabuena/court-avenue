<?php

use App\Http\Controllers\BookingController;
use App\Http\Controllers\CourtAvenueController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\SupportController;
use App\Models\SupportConversation;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// ============================================================
// Public
// ============================================================

Route::get('/', [CourtAvenueController::class,'index'])->name('home');


// ============================================================
// Booking
// ============================================================

// Booking page
Route::get('/booking', [
    BookingController::class,
    'index',
])->name('booking.index');

// Receive booking selection
// Guest and authenticated users can access this.
Route::post('/booking/checkout', [
    BookingController::class,
    'checkout',
])->name('booking.checkout.store');

// Checkout page
// This will be the destination after login/register.
Route::get('/booking/checkout', [
    BookingController::class,
    'checkoutPage',
])->name('booking.checkout');


// ============================================================
// Admin
// ============================================================

Route::middleware(['auth', 'role:admin'])->group(function () {

    Route::get('/admin/dashboard', [
    AdminController::class,
    'index',
])->name('admin.dashboard');


});


// ============================================================
// Staff
// ============================================================

Route::middleware(['auth', 'role:staff'])->group(function () {

    Route::get('/staff/dashboard', function () {
        return Inertia::render(
            'staff/dashboard'
        );
    })->name('staff.dashboard');
});


// ============================================================
// Authenticated User Routes
// ============================================================

Route::middleware('auth')->group(function () {

    // ========================================================
    // Bookings
    // ========================================================
     Route::get('/booking/my-bookings', [
        BookingController::class,
        'myBookings',
    ])->name('booking.my-bookings');

    Route::delete(
        '/booking/my-bookings/{booking}/cancel',
        [BookingController::class, 'cancel']
        )->name('booking.cancel');

         Route::delete(
         '/booking/my-bookings/{booking}/reject',
        [BookingController::class, 'rejectAdmin']
    )->name('bookings.adminCancel');


      Route::post('/booking/confirm', [
        BookingController::class,
        'confirmPaidBooking',
    ])->name('booking.confirm');

        // Upload payment proof from My Bookings
    Route::post('/booking/my-bookings/payment-proof', [
        BookingController::class,
        'uploadPaymentProof',
    ])->name('booking.my-bookings.payment-proof');



    Route::get('/booking/confirmation/{booking}', [
    BookingController::class,
    'confirmation',
])->name('booking.confirmation');

    // Booking availability
    //
    // Later this will be handled by BookingController.
    // It will return available/booked courts for the
    // selected dates and time slots.
    //
    // Route::get('/booking/availability', [
    //     BookingController::class,
    //     'availability',
    // ])->name('booking.availability');


    // Create booking
    //
    // Route::post('/booking', [
    //     BookingController::class,
    //     'store',
    // ])
    //     ->middleware('verified')
    //     ->name('booking.store');


    // ========================================================
    // Admin / Staff Support
    // ========================================================

    Route::middleware('role:admin|staff')->group(function () {

        // ----------------------------------------------------
        // Support Inbox - Inertia Page
        // ----------------------------------------------------

        Route::inertia(
            '/support/inbox',
            'court_avenue/admin/support/inbox'
        )->name('support.inbox');


        // ----------------------------------------------------
        // Support Inbox - JSON API
        // ----------------------------------------------------

        Route::get('/support/inbox/data', [
            SupportController::class,
            'inbox',
        ])->name('support.inbox.data');


        // ----------------------------------------------------
        // Conversation - Inertia Page
        // ----------------------------------------------------

        Route::get('/support/conversations/{conversation}', function (
            SupportConversation $conversation
        ) {
            return Inertia::render(
                'court_avenue/admin/support/conversation',
                [
                    'conversationId' => $conversation->id,
                ]
            );
        })->name('support.conversations.show');


        // ----------------------------------------------------
        // Conversation - JSON API
        // ----------------------------------------------------

        Route::get('/support/conversations/{conversation}/data', [
            SupportController::class,
            'show',
        ])->name('support.conversations.data');


        // ----------------------------------------------------
        // Reply
        // ----------------------------------------------------

        Route::post('/support/conversations/{conversation}/reply', [
            SupportController::class,
            'reply',
        ])->name('support.conversations.reply');


        // ----------------------------------------------------
        // Close Conversation
        // ----------------------------------------------------

        Route::post('/support/conversations/{conversation}/close', [
            SupportController::class,
            'close',
        ])->name('support.conversations.close');
    });
});


// ============================================================
// Public Support
// ============================================================
//
// These routes intentionally DO NOT use auth middleware.
//
// Authenticated users → user_id
// Guests             → guest_id
//

Route::get('/support/conversation', [
    SupportController::class,
    'conversation',
])->name('support.conversation');

Route::post('/support/messages', [
    SupportController::class,
    'send',
])->name('support.messages.store');


// ============================================================
// Settings
// ============================================================

require __DIR__.'/settings.php';