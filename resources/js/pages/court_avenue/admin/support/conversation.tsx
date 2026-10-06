import { Head, Link } from "@inertiajs/react";
import axios from "axios";
import {
    ArrowLeft,
    Archive,
    Check,
    CheckCheck,
    LoaderCircle,
    RefreshCw,
    Send,
    UserRound,
} from "lucide-react";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { motion } from "motion/react";
import { toast } from "sonner";

type SupportUser = {
    id: number;
    name: string;
    email: string;
};

type SupportMessage = {
    id: number;
    conversation_id: number;
    user_id: number | null;
    sender_type: "customer" | "staff";
    message: string;
    read_at: string | null;
    created_at: string;
    updated_at: string;
};

type SupportConversation = {
    id: number;
    user_id: number | null;
    guest_id: string | null;
    status: "open" | "closed";
    last_message_at: string | null;
    created_at: string;
    updated_at: string;
    user: SupportUser | null;
    messages: SupportMessage[];
};

type Props = {
    conversationId: number;
};

export default function Conversation({ conversationId }: Props) {
    const [conversation, setConversation] =
        useState<SupportConversation | null>(null);

    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [closing, setClosing] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const [refreshing, setRefreshing] = useState(false);

    const fetchConversation = async () => {
        try {
            setLoading(true);

            const response = await axios.get(
                `/support/conversations/${conversationId}/data`,
            );

            setConversation(response.data.conversation);
        } catch (error) {
            console.error("Failed to load conversation:", error);

            toast.error("Unable to load conversation.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "end",
        });
    }, [conversation?.messages]);

    const refreshConversation = async () => {
        try {
            setRefreshing(true);

            const response = await axios.get(
                `/support/conversations/${conversationId}/data`,
            );

            setConversation(response.data.conversation);
        } catch (error) {
            console.error("Failed to refresh conversation:", error);

            toast.error("Unable to refresh conversation.");
        } finally {
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchConversation();
    }, [conversationId]);

    const customerName = useMemo(() => {
        if (!conversation) {
            return "Customer";
        }

        return conversation.user?.name ?? "Guest User";
    }, [conversation]);

    const isGuest = conversation?.user_id === null;

    const initials = customerName
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part.charAt(0))
        .join("")
        .toUpperCase();

    const sendMessage = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const trimmedMessage = message.trim();

        if (!trimmedMessage || sending) {
            return;
        }

        try {
            setSending(true);

            const response = await axios.post(
                `/support/conversations/${conversationId}/reply`,
                {
                    message: trimmedMessage,
                },
            );

            const newMessage = response.data.message as SupportMessage;

            setConversation((current) => {
                if (!current) {
                    return current;
                }

                return {
                    ...current,
                    messages: [...current.messages, newMessage],
                    last_message_at: newMessage.created_at,
                };
            });

            setMessage("");
        } catch (error) {
            console.error("Failed to send message:", error);

            toast.error("Failed to send message.");
        } finally {
            setSending(false);
        }
    };

    const closeConversation = async () => {
        if (!conversation || conversation.status === "closed" || closing) {
            return;
        }

        try {
            setClosing(true);

            await axios.post(`/support/conversations/${conversationId}/close`);

            setConversation((current) => {
                if (!current) {
                    return current;
                }

                return {
                    ...current,
                    status: "closed",
                };
            });

            toast.success("Conversation closed.", {
                description: "This support conversation has been closed.",
            });
        } catch (error) {
            console.error("Failed to close conversation:", error);

            toast.error("Failed to close conversation.");
        } finally {
            setClosing(false);
        }
    };

    if (loading) {
        return (
            <>
                <Head title="Support Conversation" />

                <div className="flex min-h-screen items-center justify-center bg-gray-50">
                    <div className="flex items-center gap-3 text-sm text-gray-500">
                        <LoaderCircle className="h-5 w-5 animate-spin text-[#b91c1c]" />
                        Loading conversation...
                    </div>
                </div>
            </>
        );
    }

    if (!conversation) {
        return (
            <>
                <Head title="Conversation Not Found" />

                <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-6 text-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100">
                        <Archive className="h-6 w-6 text-gray-400" />
                    </div>

                    <h1 className="mt-4 text-lg font-bold text-gray-900">
                        Conversation not found
                    </h1>

                    <p className="mt-1 text-sm text-gray-500">
                        This conversation may have been deleted or is no longer
                        available.
                    </p>

                    <Link
                        href="/support/inbox"
                        className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#b91c1c] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#991b1b]"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Inbox
                    </Link>
                </div>
            </>
        );
    }

    return (
        <>
            <Head title={`${customerName} · Support`} />

            <div className="flex min-h-screen flex-col bg-gray-50/70">
                {/* Header */}
                <header className="border-b border-gray-200 bg-white">
                    <div className="mx-auto w-full max-w-5xl px-4 py-4 sm:px-6">
                        <div className="flex items-center justify-between gap-4">
                            <div className="flex min-w-0 items-center gap-3">
                                <Link
                                    href="/support/inbox"
                                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-gray-200 text-gray-500 transition hover:bg-gray-50 hover:text-gray-900"
                                >
                                    <ArrowLeft className="h-4 w-4" />
                                </Link>

                                <div
                                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                                        isGuest
                                            ? "bg-gray-100 text-gray-500"
                                            : "bg-red-50 text-[#b91c1c]"
                                    }`}
                                >
                                    {isGuest ? (
                                        <UserRound className="h-5 w-5" />
                                    ) : (
                                        <span className="text-xs font-bold">
                                            {initials}
                                        </span>
                                    )}
                                </div>

                                <div className="min-w-0">
                                    <div className="flex items-center gap-2">
                                        <h1 className="truncate text-sm font-bold text-gray-950 sm:text-base">
                                            {customerName}
                                        </h1>

                                        {isGuest && (
                                            <span className="shrink-0 rounded-full bg-gray-100 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-gray-500">
                                                Guest
                                            </span>
                                        )}
                                    </div>

                                    <p className="truncate text-xs text-gray-400">
                                        {conversation.user?.email ??
                                            `Guest ID: ${
                                                conversation.guest_id ??
                                                "Unknown"
                                            }`}
                                    </p>
                                </div>
                            </div>

                            <div className="flex shrink-0 items-center gap-2">
                                <StatusBadge status={conversation.status} />

                                {/* Refresh */}
                                <button
                                    type="button"
                                    onClick={refreshConversation}
                                    disabled={refreshing || closing}
                                    title="Refresh conversation"
                                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 transition hover:border-gray-300 hover:bg-gray-50 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    <RefreshCw
                                        className={`h-4 w-4 ${
                                            refreshing ? "animate-spin" : ""
                                        }`}
                                    />
                                </button>

                                {/* Close */}
                                {conversation.status === "open" && (
                                    <button
                                        type="button"
                                        onClick={closeConversation}
                                        disabled={closing || refreshing}
                                        className="hidden h-9 items-center gap-2 rounded-xl border border-gray-200 px-3 text-xs font-semibold text-gray-600 transition hover:border-red-200 hover:bg-red-50 hover:text-[#b91c1c] disabled:cursor-not-allowed disabled:opacity-60 sm:inline-flex"
                                    >
                                        {closing ? (
                                            <LoaderCircle className="h-4 w-4 animate-spin" />
                                        ) : (
                                            <Archive className="h-4 w-4" />
                                        )}
                                        Close
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Chat */}
                <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 sm:px-6">
                    <div className="flex flex-1 flex-col">
                        {/* Conversation info */}
                        <div className="py-5 text-center">
                            <span className="rounded-full bg-white px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-gray-400 shadow-sm ring-1 ring-gray-200">
                                Conversation #{conversation.id}
                            </span>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 space-y-4 pb-6">
                            {conversation.messages.length === 0 ? (
                                <div className="flex min-h-[300px] items-center justify-center text-sm text-gray-400">
                                    No messages yet.
                                </div>
                            ) : (
                                conversation.messages.map((item, index) => {
                                    const isStaff =
                                        item.sender_type === "staff";

                                    return (
                                        <MessageBubble
                                            key={item.id}
                                            message={item}
                                            isStaff={isStaff}
                                            index={index}
                                        />
                                    );
                                })
                            )}

                            {/* Auto-scroll anchor */}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Reply */}
                        {conversation.status === "open" ? (
                            <div className="sticky bottom-0 -mx-4 border-t border-gray-200 bg-gray-50/95 px-4 py-4 backdrop-blur sm:-mx-6 sm:px-6">
                                <form
                                    onSubmit={sendMessage}
                                    className="mx-auto max-w-5xl"
                                >
                                    <div className="flex items-end gap-2 rounded-2xl border border-gray-200 bg-white p-2 shadow-sm focus-within:border-[#b91c1c] focus-within:ring-4 focus-within:ring-red-50">
                                        <textarea
                                            value={message}
                                            onChange={(event) =>
                                                setMessage(event.target.value)
                                            }
                                            onKeyDown={(event) => {
                                                if (
                                                    event.key === "Enter" &&
                                                    !event.shiftKey
                                                ) {
                                                    event.preventDefault();

                                                    if (message.trim()) {
                                                        event.currentTarget.form?.requestSubmit();
                                                    }
                                                }
                                            }}
                                            placeholder="Type your reply..."
                                            rows={1}
                                            maxLength={2000}
                                            className="max-h-32 min-h-10 flex-1 resize-none border-0 bg-transparent px-2 py-2 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:ring-0"
                                        />

                                        <button
                                            type="submit"
                                            disabled={
                                                sending || !message.trim()
                                            }
                                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#b91c1c] text-white transition hover:bg-[#991b1b] disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            {sending ? (
                                                <LoaderCircle className="h-4 w-4 animate-spin" />
                                            ) : (
                                                <Send className="h-4 w-4" />
                                            )}
                                        </button>
                                    </div>

                                    <div className="mt-2 flex items-center justify-between px-1">
                                        <p className="text-[10px] text-gray-400">
                                            Press Enter to send · Shift + Enter
                                            for a new line
                                        </p>

                                        <span className="text-[10px] text-gray-400">
                                            {message.length}/2000
                                        </span>
                                    </div>
                                </form>
                            </div>
                        ) : (
                            <div className="sticky bottom-0 -mx-4 border-t border-gray-200 bg-gray-50 px-4 py-5 sm:-mx-6 sm:px-6">
                                <div className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-500">
                                    <CheckCheck className="h-4 w-4 text-green-600" />
                                    This conversation is closed.
                                </div>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </>
    );
}

/*
|--------------------------------------------------------------------------
| Message Bubble
|--------------------------------------------------------------------------
*/

function MessageBubble({
    message,
    isStaff,
    index,
}: {
    message: SupportMessage;
    isStaff: boolean;
    index: number;
}) {
    return (
        <motion.div
            initial={{
                opacity: 0,
                y: 8,
            }}
            animate={{
                opacity: 1,
                y: 0,
            }}
            transition={{
                duration: 0.2,
                delay: Math.min(index * 0.025, 0.2),
            }}
            className={`flex ${isStaff ? "justify-end" : "justify-start"}`}
        >
            <div
                className={`flex max-w-[85%] flex-col sm:max-w-[70%] ${
                    isStaff ? "items-end" : "items-start"
                }`}
            >
                <div className="mb-1 flex items-center gap-2">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                        {isStaff ? "Support" : "Customer"}
                    </span>
                </div>

                <div
                    className={`rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
                        isStaff
                            ? "rounded-br-md bg-[#b91c1c] text-white"
                            : "rounded-bl-md border border-gray-200 bg-white text-gray-800"
                    }`}
                >
                    <p className="whitespace-pre-wrap break-words">
                        {message.message}
                    </p>
                </div>

                <div className="mt-1 flex items-center gap-1.5">
                    <span className="text-[10px] text-gray-400">
                        {formatMessageTime(message.created_at)}
                    </span>

                    {isStaff && <Check className="h-3 w-3 text-gray-400" />}
                </div>
            </div>
        </motion.div>
    );
}

/*
|--------------------------------------------------------------------------
| Status Badge
|--------------------------------------------------------------------------
*/

function StatusBadge({ status }: { status: "open" | "closed" }) {
    const isOpen = status === "open";

    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
                isOpen
                    ? "bg-green-50 text-green-700"
                    : "bg-gray-100 text-gray-500"
            }`}
        >
            <span
                className={`h-1.5 w-1.5 rounded-full ${
                    isOpen ? "bg-green-500" : "bg-gray-400"
                }`}
            />

            {isOpen ? "Open" : "Closed"}
        </span>
    );
}

/*
|--------------------------------------------------------------------------
| Time Formatting
|--------------------------------------------------------------------------
*/

function formatMessageTime(date: string) {
    return new Date(date).toLocaleString([], {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
    });
}
