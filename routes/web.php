<?php

// use App\Http\Controllers\BookingController;
use App\Http\Controllers\SupportController;
use App\Models\SupportConversation;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::inertia('/', 'court_avenue/index')->name('home');


// ============================================================
// Admin
// ============================================================

Route::middleware(['auth', 'role:admin'])->group(function () {

    Route::get('/admin/dashboard', function () {
        return Inertia::render('court_avenue/admin/dashboard');
    })->name('admin.dashboard');
});


// ============================================================
// Staff
// ============================================================

Route::middleware(['auth', 'role:staff'])->group(function () {

    Route::get('/staff/dashboard', function () {
        return Inertia::render('staff/dashboard');
    })->name('staff.dashboard');
});


// ============================================================
// Authenticated User Routes
// ============================================================

Route::middleware('auth')->group(function () {

    // ========================================================
    // Bookings
    // ========================================================

    // Route::get('/bookings/create', [
    //     BookingController::class,
    //     'create',
    // ])->name('bookings.create');

    // Route::post('/bookings', [
    //     BookingController::class,
    //     'store',
    // ])
    //     ->middleware('verified')
    //     ->name('bookings.store');


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
        //
        // Explicitly pass conversationId to the Inertia page.
        //

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