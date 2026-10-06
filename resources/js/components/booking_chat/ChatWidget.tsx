import { usePage } from "@inertiajs/react";
import type { Auth } from "@/types";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
    MessageCircle,
    X,
    Send,
    Headphones,
    Minimize2,
    RefreshCw,
} from "lucide-react";

type Message = {
    id: number;
    message: string;
    sender: "user" | "support";
    time: string;
};

type ChatWidgetProps = {
    onOpenChange?: (open: boolean) => void;
};

type ChatPageProps = {
    auth: Auth;
    support_online: boolean;
};

const GUEST_ID_KEY = "court_avenue_guest_id";

export default function ChatWidget({ onOpenChange }: ChatWidgetProps) {
    const { auth, support_online } = usePage<ChatPageProps>().props;

    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState<Message[]>([]);
    const [isSending, setIsSending] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    const userName = auth.user?.name
        ? auth.user.name.split(" ").slice(0, 2).join(" ")
        : "";

    const welcomeMessage = support_online
        ? `Hi${userName ? ` ${userName}` : ""}! 👋 Welcome to Court Avenue. How can we help you today?`
        : `Hi${userName ? ` ${userName}` : ""}! 👋 Welcome to Court Avenue. Our support team is currently offline, but you can still leave us a message and we'll get back to you.`;

    const supportStatus = support_online
        ? {
              label: "Online",
              description: "A support staff member is currently available.",
              dotClass: "bg-green-400",
          }
        : {
              label: "No support staff online",
              description: "No admin or staff member is currently available.",
              dotClass: "bg-gray-300",
          };

    /**
     * Get or create the anonymous guest ID.
     *
     * This ID is stored in the browser so the same guest
     * can continue their conversation after refreshing.
     */
    const getGuestId = (): string => {
        let guestId = localStorage.getItem(GUEST_ID_KEY);

        if (!guestId) {
            guestId = crypto.randomUUID();
            localStorage.setItem(GUEST_ID_KEY, guestId);
        }

        return guestId;
    };

    const openChat = () => {
        setIsOpen(true);
        onOpenChange?.(true);
    };

    const closeChat = () => {
        setIsOpen(false);
        onOpenChange?.(false);
    };

    const toggleChat = () => {
        if (isOpen) {
            closeChat();
        } else {
            openChat();
        }
    };

    /**
     * Load the current support conversation.
     *
     * Authenticated users:
     *   Backend identifies them through auth/session.
     *
     * Guests:
     *   Backend identifies them through guest_id.
     */
    const loadConversation = async () => {
        try {
            const guestId = auth.user ? null : getGuestId();

            const url = guestId
                ? `/support/conversation?guest_id=${encodeURIComponent(guestId)}`
                : "/support/conversation";

            const response = await fetch(url, {
                method: "GET",
                headers: {
                    Accept: "application/json",
                },
                credentials: "same-origin",
            });

            if (!response.ok) {
                return;
            }

            const data = await response.json();

            const loadedMessages: Message[] = data.messages.map(
                (item: {
                    id: number;
                    message: string;
                    sender_type: "customer" | "staff";
                    created_at: string;
                }) => ({
                    id: item.id,
                    message: item.message,
                    sender:
                        item.sender_type === "customer" ? "user" : "support",
                    time: new Date(item.created_at).toLocaleTimeString([], {
                        hour: "numeric",
                        minute: "2-digit",
                    }),
                }),
            );

            setMessages(loadedMessages);
        } catch (error) {
            console.error("Failed to load support conversation:", error);
        }
    };

    const refreshConversation = async () => {
        if (isRefreshing) {
            return;
        }

        try {
            setIsRefreshing(true);

            await loadConversation();
        } finally {
            setIsRefreshing(false);
        }
    };

    /**
     * Send customer message.
     *
     * Authenticated users send normally.
     * Guests include their guest_id.
     */
    const sendMessage = async () => {
        const trimmedMessage = message.trim();

        if (!trimmedMessage || isSending) {
            return;
        }

        setIsSending(true);

        try {
            const csrfToken = document
                .querySelector('meta[name="csrf-token"]')
                ?.getAttribute("content");

            const guestId = auth.user ? null : getGuestId();

            const response = await fetch("/support/messages", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    "X-CSRF-TOKEN": csrfToken ?? "",
                },
                credentials: "same-origin",
                body: JSON.stringify({
                    message: trimmedMessage,
                    ...(guestId ? { guest_id: guestId } : {}),
                }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);

                console.error("Support message failed:", errorData);

                throw new Error("Failed to send message.");
            }

            const data = await response.json();

            const newMessage: Message = {
                id: data.message.id,
                message: data.message.message,
                sender: "user",
                time: new Date(data.message.created_at).toLocaleTimeString([], {
                    hour: "numeric",
                    minute: "2-digit",
                }),
            };

            setMessages((prev) => [...prev, newMessage]);
            setMessage("");
        } catch (error) {
            console.error("Failed to send support message:", error);
        } finally {
            setIsSending(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    /**
     * Load conversation when:
     *
     * - The widget mounts
     * - User logs in
     * - User logs out
     *
     * Guests will use their localStorage guest_id.
     */
    useEffect(() => {
        setMessages([]);
        loadConversation();
    }, [auth.user?.id]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "end",
        });
    }, [messages]);

    return (
        <>
            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{
                            opacity: 0,
                            y: 20,
                            scale: 0.95,
                        }}
                        animate={{
                            opacity: 1,
                            y: 0,
                            scale: 1,
                        }}
                        exit={{
                            opacity: 0,
                            y: 20,
                            scale: 0.95,
                        }}
                        transition={{
                            duration: 0.2,
                        }}
                        className="
                            fixed
                            bottom-24
                            right-4
                            z-50
                            flex
                            h-[min(620px,calc(100vh-120px))]
                            w-[calc(100vw-32px)]
                            max-w-[390px]
                            flex-col
                            overflow-hidden
                            rounded-2xl
                            border
                            border-gray-200
                            bg-white
                            shadow-2xl
                            dark:border-zinc-800
                            dark:bg-zinc-950
                            sm:right-6
                            sm:w-[390px]
                        "
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between bg-[#b0002a] px-5 py-4 text-white">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15">
                                    <Headphones className="h-5 w-5" />
                                </div>

                                <div>
                                    <h3 className="font-semibold">
                                        Court Avenue Support
                                    </h3>

                                    <div
                                        className="mt-0.5 flex items-center gap-1.5 text-xs text-red-100"
                                        title={supportStatus.description}
                                    >
                                        <span
                                            className={`h-2 w-2 rounded-full ${supportStatus.dotClass}`}
                                        />

                                        {supportStatus.label}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-1">
                                {/* Refresh */}
                                <button
                                    type="button"
                                    onClick={refreshConversation}
                                    disabled={isRefreshing}
                                    className="
            rounded-lg
            p-2
            text-white/90
            transition
            hover:bg-white/10
            disabled:cursor-not-allowed
            disabled:opacity-60
        "
                                    aria-label="Refresh conversation"
                                    title="Refresh conversation"
                                >
                                    <RefreshCw
                                        className={`h-4 w-4 ${
                                            isRefreshing ? "animate-spin" : ""
                                        }`}
                                    />
                                </button>

                                {/* Minimize */}
                                <button
                                    type="button"
                                    onClick={closeChat}
                                    className="
                                    rounded-lg
                                    p-2
                                    transition
                                    hover:bg-white/10
                                "
                                    aria-label="Minimize chat"
                                    title="Minimize chat"
                                >
                                    <Minimize2 className="h-4 w-4" />
                                </button>

                                {/* Close */}
                                <button
                                    type="button"
                                    onClick={closeChat}
                                    className="
                                    rounded-lg
                                    p-2
                                    transition
                                    hover:bg-white/10
                                "
                                    aria-label="Close chat"
                                    title="Close chat"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 space-y-4 overflow-y-auto bg-gray-50 p-4 dark:bg-zinc-900">
                            {/* Date */}
                            <div className="flex justify-center">
                                <span className="rounded-full bg-gray-200 px-3 py-1 text-[11px] text-gray-500 dark:bg-zinc-800 dark:text-zinc-400">
                                    Today
                                </span>
                            </div>

                            {/* Welcome Message */}
                            <div className="flex justify-start">
                                <div className="max-w-[80%]">
                                    <div
                                        className="
                                            rounded-2xl
                                            rounded-bl-md
                                            bg-white
                                            px-4
                                            py-2.5
                                            text-sm
                                            leading-relaxed
                                            text-gray-700
                                            shadow-sm
                                            dark:bg-zinc-800
                                            dark:text-zinc-200
                                        "
                                    >
                                        {welcomeMessage}
                                    </div>

                                    <div className="mt-1 text-left text-[10px] text-gray-400">
                                        Now
                                    </div>
                                </div>
                            </div>

                            {/* Conversation Messages */}
                            {messages.map((item) => (
                                <div
                                    key={item.id}
                                    className={`flex ${
                                        item.sender === "user"
                                            ? "justify-end"
                                            : "justify-start"
                                    }`}
                                >
                                    <div className="max-w-[80%]">
                                        <div
                                            className={`
                                                rounded-2xl
                                                px-4
                                                py-2.5
                                                text-sm
                                                leading-relaxed
                                                ${
                                                    item.sender === "user"
                                                        ? "rounded-br-md bg-[#b0002a] text-white"
                                                        : "rounded-bl-md bg-white text-gray-700 shadow-sm dark:bg-zinc-800 dark:text-zinc-200"
                                                }
                                            `}
                                        >
                                            {item.message}
                                        </div>

                                        <div
                                            className={`
                                                mt-1
                                                text-[10px]
                                                text-gray-400
                                                ${
                                                    item.sender === "user"
                                                        ? "text-right"
                                                        : "text-left"
                                                }
                                            `}
                                        >
                                            {item.time}
                                        </div>
                                    </div>
                                </div>
                            ))}

                            <div ref={messagesEndRef} />
                        </div>

                        {/* Quick Questions */}
                        <div className="border-t bg-white px-4 pt-3 dark:border-zinc-800 dark:bg-zinc-950">
                            <div className="mb-3 flex gap-2 overflow-x-auto pb-1">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setMessage(
                                            "Are there courts available today?",
                                        )
                                    }
                                    className="
                                        shrink-0
                                        rounded-full
                                        border
                                        border-red-200
                                        px-3
                                        py-1.5
                                        text-xs
                                        text-[#b0002a]
                                        transition
                                        hover:bg-red-50
                                        dark:border-red-900
                                        dark:hover:bg-red-950
                                    "
                                >
                                    Court availability
                                </button>

                                <button
                                    type="button"
                                    onClick={() =>
                                        setMessage(
                                            "How much does it cost to book a court?",
                                        )
                                    }
                                    className="
                                        shrink-0
                                        rounded-full
                                        border
                                        border-red-200
                                        px-3
                                        py-1.5
                                        text-xs
                                        text-[#b0002a]
                                        transition
                                        hover:bg-red-50
                                        dark:border-red-900
                                        dark:hover:bg-red-950
                                    "
                                >
                                    Pricing
                                </button>

                                <button
                                    type="button"
                                    onClick={() =>
                                        setMessage("How can I book a court?")
                                    }
                                    className="
                                        shrink-0
                                        rounded-full
                                        border
                                        border-red-200
                                        px-3
                                        py-1.5
                                        text-xs
                                        text-[#b0002a]
                                        transition
                                        hover:bg-red-50
                                        dark:border-red-900
                                        dark:hover:bg-red-950
                                    "
                                >
                                    Booking
                                </button>
                            </div>

                            {/* Input */}
                            <div className="flex items-center gap-2 pb-4">
                                <input
                                    type="text"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Type your message..."
                                    className="
                                        min-w-0
                                        flex-1
                                        rounded-xl
                                        border
                                        border-gray-200
                                        bg-gray-50
                                        px-4
                                        py-3
                                        text-sm
                                        outline-none
                                        transition
                                        focus:border-[#b0002a]
                                        focus:ring-2
                                        focus:ring-[#b0002a]/20
                                        dark:border-zinc-700
                                        dark:bg-zinc-900
                                        dark:text-white
                                        dark:placeholder:text-zinc-500
                                    "
                                />

                                <button
                                    type="button"
                                    onClick={sendMessage}
                                    disabled={!message.trim() || isSending}
                                    className="
                                        flex
                                        h-11
                                        w-11
                                        shrink-0
                                        items-center
                                        justify-center
                                        rounded-xl
                                        bg-[#b0002a]
                                        text-white
                                        transition
                                        hover:bg-[#8e0023]
                                        disabled:cursor-not-allowed
                                        disabled:opacity-40
                                    "
                                    aria-label="Send message"
                                >
                                    <Send className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Floating Ask Us Button */}
            <motion.button
                type="button"
                onClick={toggleChat}
                whileHover={{
                    scale: 1.05,
                }}
                whileTap={{
                    scale: 0.95,
                }}
                className="
                    fixed
                    bottom-5
                    right-5
                    z-50
                    flex
                    items-center
                    gap-2
                    rounded-full
                    bg-[#b0002a]
                    px-5
                    py-3
                    font-semibold
                    text-white
                    shadow-lg
                    shadow-[#b0002a]/25
                    transition
                    hover:bg-[#8e0023]
                    sm:right-6
                "
            >
                {isOpen ? (
                    <X className="h-5 w-5" />
                ) : (
                    <MessageCircle className="h-5 w-5" />
                )}

                <span className="text-sm">{isOpen ? "Close" : "Ask Us"}</span>
            </motion.button>
        </>
    );
}
