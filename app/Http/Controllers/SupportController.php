<?php

namespace App\Http\Controllers;

use App\Models\SupportConversation;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;


class SupportController extends Controller
{
    /**
     * Get the current customer's open support conversation.
     *
     * Authenticated users use user_id.
     * Guests use guest_id.
     */
    public function conversation(Request $request): JsonResponse
    {
        $user = $request->user();

        if ($user) {
            $conversation = SupportConversation::with([
                'messages' => function ($query) {
                    $query->orderBy('created_at');
                },
            ])
                ->where('user_id', $user->id)
                ->where('status', 'open')
                ->latest('id')
                ->first();
        } else {
            $validated = $request->validate([
                'guest_id' => ['required', 'uuid'],
            ]);

            $conversation = SupportConversation::with([
                'messages' => function ($query) {
                    $query->orderBy('created_at');
                },
            ])
                ->whereNull('user_id')
                ->where('guest_id', $validated['guest_id'])
                ->where('status', 'open')
                ->latest('id')
                ->first();
        }

        if (! $conversation) {
            return response()->json([
                'conversation' => null,
                'messages' => [],
            ]);
        }

        return response()->json([
            'conversation' => $conversation,
            'messages' => $conversation->messages,
        ]);
    }

    /**
     * Send a message from a customer.
     *
     * Authenticated users use user_id.
     * Guests use guest_id.
     */
    public function send(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'message' => ['required', 'string', 'max:2000'],
            'guest_id' => ['nullable', 'uuid'],
        ]);

        $user = $request->user();

        /*
        |--------------------------------------------------------------------------
        | Authenticated customer
        |--------------------------------------------------------------------------
        */

        if ($user) {
            $conversation = SupportConversation::firstOrCreate(
                [
                    'user_id' => $user->id,
                    'status' => 'open',
                ],
                [
                    'guest_id' => null,
                    'last_message_at' => now(),
                ]
            );

            $message = $conversation->messages()->create([
                'user_id' => $user->id,
                'sender_type' => 'customer',
                'message' => $validated['message'],
            ]);
        }

        /*
        |--------------------------------------------------------------------------
        | Guest customer
        |--------------------------------------------------------------------------
        */

        else {
            if (empty($validated['guest_id'])) {
                return response()->json([
                    'message' => 'A guest ID is required.',
                ], 422);
            }

            $conversation = SupportConversation::firstOrCreate(
                [
                    'user_id' => null,
                    'guest_id' => $validated['guest_id'],
                    'status' => 'open',
                ],
                [
                    'last_message_at' => now(),
                ]
            );

            $message = $conversation->messages()->create([
                'user_id' => null,
                'sender_type' => 'customer',
                'message' => $validated['message'],
            ]);
        }

        $conversation->update([
            'last_message_at' => now(),
        ]);

        return response()->json([
            'message' => $message,
            'conversation' => $conversation,
        ]);
    }

    /**
     * Get conversations for Admin/Staff.
     */
    public function inbox(Request $request): JsonResponse
    {
        abort_unless(
            $request->user()->hasAnyRole(['admin', 'staff']),
            403
        );

        $conversations = SupportConversation::with([
            'user:id,name,email',
            'messages' => function ($query) {
                $query
                    ->latest()
                    ->limit(1);
            },
        ])
            ->withCount([
                'messages as unread_messages_count' => function ($query) {
                    $query
                        ->where('sender_type', 'customer')
                        ->whereNull('read_at');
                },
            ])
            ->orderByDesc('last_message_at')
            ->get();

        return response()->json([
            'conversations' => $conversations,
        ]);
    }

    /**
     * Get one conversation for Admin/Staff.
     */
    public function show(
        Request $request,
        SupportConversation $conversation
    ): JsonResponse {
        abort_unless(
            $request->user()->hasAnyRole(['admin', 'staff']),
            403
        );

        $conversation->load([
            'user:id,name,email',
            'messages' => function ($query) {
                $query->orderBy('created_at');
            },
        ]);

        $conversation->messages()
            ->where('sender_type', 'customer')
            ->whereNull('read_at')
            ->update([
                'read_at' => now(),
            ]);

        return response()->json([
            'conversation' => $conversation,
        ]);
    }

    /**
     * Reply as Admin/Staff.
     */
    public function reply(
        Request $request,
        SupportConversation $conversation
    ): JsonResponse {
        abort_unless(
            $request->user()->hasAnyRole(['admin', 'staff']),
            403
        );

        $validated = $request->validate([
            'message' => ['required', 'string', 'max:2000'],
        ]);

        $message = $conversation->messages()->create([
            'user_id' => $request->user()->id,
            'sender_type' => 'staff',
            'message' => $validated['message'],
        ]);

        $conversation->update([
            'last_message_at' => now(),
        ]);

        return response()->json([
            'message' => $message,
        ]);
    }

    /**
     * Close a conversation.
     */
    public function close(
        Request $request,
        SupportConversation $conversation
    ): JsonResponse {
        abort_unless(
            $request->user()->hasAnyRole(['admin', 'staff']),
            403
        );

        $conversation->update([
            'status' => 'closed',
        ]);

        return response()->json([
            'message' => 'Conversation closed.',
        ]);
    }
}