import { Head, Link } from "@inertiajs/react";
import axios from "axios";
import {
    Archive,
    ChevronRight,
    Clock3,
    Inbox,
    MessageCircle,
    RefreshCw,
    Search,
    UserRound,
    Users,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";

type SupportUser = {
    id: number;
    name: string;
    email: string;
};

type SupportMessage = {
    id: number;
    user_id: number | null;
    sender_type: "customer" | "staff";
    message: string;
    read_at: string | null;
    created_at: string;
};

type SupportConversation = {
    id: number;
    user_id: number | null;
    guest_id: string | null;
    status: "open" | "closed";
    last_message_at: string | null;
    unread_messages_count: number;
    user: SupportUser | null;
    messages: SupportMessage[];
};

export default function SupportInbox() {
    const [conversations, setConversations] = useState<SupportConversation[]>(
        [],
    );

    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState<"all" | "open" | "closed">("all");

    const fetchConversations = useCallback(async (showRefresh = false) => {
        try {
            if (showRefresh) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }

            const response = await axios.get("/support/inbox/data");

            setConversations(response.data.conversations ?? []);
        } catch (error) {
            console.error("Failed to load support conversations:", error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        fetchConversations();
    }, [fetchConversations]);

    const filteredConversations = useMemo(() => {
        const query = search.trim().toLowerCase();

        return conversations.filter((conversation) => {
            const matchesFilter =
                filter === "all" || conversation.status === filter;

            if (!matchesFilter) {
                return false;
            }

            if (!query) {
                return true;
            }

            const name = conversation.user?.name?.toLowerCase() ?? "";

            const email = conversation.user?.email?.toLowerCase() ?? "";

            const guestId = conversation.guest_id?.toLowerCase() ?? "";

            const latestMessage =
                conversation.messages?.[0]?.message?.toLowerCase() ?? "";

            return (
                name.includes(query) ||
                email.includes(query) ||
                guestId.includes(query) ||
                latestMessage.includes(query)
            );
        });
    }, [conversations, search, filter]);

    const openCount = conversations.filter(
        (conversation) => conversation.status === "open",
    ).length;

    const closedCount = conversations.filter(
        (conversation) => conversation.status === "closed",
    ).length;

    const unreadCount = conversations.reduce(
        (total, conversation) =>
            total + Number(conversation.unread_messages_count ?? 0),
        0,
    );

    const guestCount = conversations.filter(
        (conversation) => conversation.user_id === null,
    ).length;

    return (
        <>
            <Head title="Support Inbox" />

            <div className="min-h-screen bg-gray-50/70">
                {/* Header */}
                <header className="border-b border-gray-200 bg-white">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex items-center gap-4">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#b91c1c] text-white shadow-sm shadow-red-200">
                                    <Inbox className="h-6 w-6" />
                                </div>

                                <div>
                                    <div className="flex items-center gap-2">
                                        <h1 className="text-2xl font-bold tracking-tight text-gray-950">
                                            Support Inbox
                                        </h1>

                                        <span className="hidden rounded-full bg-green-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-green-700 sm:inline-flex">
                                            Live
                                        </span>
                                    </div>

                                    <p className="mt-0.5 text-sm text-gray-500">
                                        Manage customer support conversations.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => fetchConversations(true)}
                                    disabled={refreshing}
                                    className="inline-flex h-10 items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    <RefreshCw
                                        className={`h-4 w-4 ${
                                            refreshing ? "animate-spin" : ""
                                        }`}
                                    />

                                    <span className="hidden sm:inline">
                                        Refresh
                                    </span>
                                </button>

                                <Link
                                    href="/admin/dashboard"
                                    className="hidden h-10 items-center rounded-xl bg-gray-950 px-4 text-sm font-semibold text-white transition hover:bg-gray-800 sm:inline-flex"
                                >
                                    Dashboard
                                </Link>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
                        <StatCard
                            icon={MessageCircle}
                            label="Open"
                            value={openCount}
                        />

                        <StatCard
                            icon={Clock3}
                            label="Unread"
                            value={unreadCount}
                            highlight
                        />

                        <StatCard
                            icon={Users}
                            label="Guests"
                            value={guestCount}
                        />

                        <StatCard
                            icon={Archive}
                            label="Closed"
                            value={closedCount}
                        />
                    </div>

                    {/* Inbox Card */}
                    <section className="mt-6 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                        {/* Toolbar */}
                        <div className="border-b border-gray-100 p-4">
                            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                                {/* Search */}
                                <div className="relative w-full lg:max-w-md">
                                    <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

                                    <input
                                        type="text"
                                        value={search}
                                        onChange={(event) =>
                                            setSearch(event.target.value)
                                        }
                                        placeholder="Search customers or messages..."
                                        className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#b91c1c] focus:bg-white focus:ring-4 focus:ring-red-100"
                                    />
                                </div>

                                {/* Filters */}
                                <div className="flex rounded-xl bg-gray-100 p-1">
                                    <FilterButton
                                        active={filter === "all"}
                                        onClick={() => setFilter("all")}
                                    >
                                        All
                                    </FilterButton>

                                    <FilterButton
                                        active={filter === "open"}
                                        onClick={() => setFilter("open")}
                                    >
                                        Open
                                        {openCount > 0 && (
                                            <span className="ml-1.5 rounded-full bg-white px-1.5 text-[10px]">
                                                {openCount}
                                            </span>
                                        )}
                                    </FilterButton>

                                    <FilterButton
                                        active={filter === "closed"}
                                        onClick={() => setFilter("closed")}
                                    >
                                        Closed
                                    </FilterButton>
                                </div>
                            </div>
                        </div>

                        {/* Loading */}
                        {loading ? (
                            <LoadingState />
                        ) : filteredConversations.length === 0 ? (
                            <EmptyState hasSearch={search.trim().length > 0} />
                        ) : (
                            <div className="divide-y divide-gray-100">
                                {filteredConversations.map(
                                    (conversation, index) => (
                                        <ConversationItem
                                            key={conversation.id}
                                            conversation={conversation}
                                            index={index}
                                        />
                                    ),
                                )}
                            </div>
                        )}
                    </section>
                </main>
            </div>
        </>
    );
}

/*
|--------------------------------------------------------------------------
| Stat Card
|--------------------------------------------------------------------------
*/

function StatCard({
    icon: Icon,
    label,
    value,
    highlight = false,
}: {
    icon: typeof MessageCircle;
    label: string;
    value: number;
    highlight?: boolean;
}) {
    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
            <div className="flex items-center gap-3">
                <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                        highlight
                            ? "bg-red-50 text-[#b91c1c]"
                            : "bg-gray-100 text-gray-600"
                    }`}
                >
                    <Icon className="h-5 w-5" />
                </div>

                <div className="min-w-0">
                    <p className="truncate text-xs font-medium text-gray-500 sm:text-sm">
                        {label}
                    </p>

                    <p className="mt-0.5 text-xl font-bold text-gray-950 sm:text-2xl">
                        {value.toLocaleString()}
                    </p>
                </div>
            </div>
        </div>
    );
}

/*
|--------------------------------------------------------------------------
| Filter Button
|--------------------------------------------------------------------------
*/

function FilterButton({
    children,
    active,
    onClick,
}: {
    children: React.ReactNode;
    active: boolean;
    onClick: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`flex h-9 items-center rounded-lg px-3 text-xs font-semibold transition ${
                active
                    ? "bg-white text-gray-950 shadow-sm"
                    : "text-gray-500 hover:text-gray-800"
            }`}
        >
            {children}
        </button>
    );
}

/*
|--------------------------------------------------------------------------
| Conversation Item
|--------------------------------------------------------------------------
*/

function ConversationItem({
    conversation,
    index,
}: {
    conversation: SupportConversation;
    index: number;
}) {
    const isGuest = conversation.user_id === null;
    const hasUnread = Number(conversation.unread_messages_count ?? 0) > 0;

    const name = conversation.user?.name ?? "Guest User";

    const email = conversation.user?.email;

    const latestMessage =
        conversation.messages?.[0]?.message ?? "No messages yet.";

    const initials = name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part.charAt(0))
        .join("")
        .toUpperCase();

    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                duration: 0.2,
                delay: Math.min(index * 0.025, 0.2),
            }}
        >
            <Link
                href={`/support/conversations/${conversation.id}`}
                className="group flex gap-3 p-4 transition hover:bg-gray-50 sm:gap-4 sm:p-5"
            >
                {/* Avatar */}
                <div className="relative shrink-0">
                    <div
                        className={`flex h-12 w-12 items-center justify-center rounded-full ${
                            isGuest
                                ? "bg-gray-100 text-gray-500"
                                : "bg-red-50 text-[#b91c1c]"
                        }`}
                    >
                        {isGuest ? (
                            <UserRound className="h-5 w-5" />
                        ) : (
                            <span className="text-sm font-bold">
                                {initials}
                            </span>
                        )}
                    </div>

                    {hasUnread && (
                        <span className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border-2 border-white bg-[#b91c1c]" />
                    )}
                </div>

                {/* Main content */}
                <div className="min-w-0 flex-1">
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex min-w-0 items-center gap-2">
                            <h3
                                className={`truncate text-sm ${
                                    hasUnread
                                        ? "font-bold text-gray-950"
                                        : "font-semibold text-gray-800"
                                }`}
                            >
                                {name}
                            </h3>

                            {isGuest && (
                                <span className="shrink-0 rounded-full bg-gray-100 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-gray-500">
                                    Guest
                                </span>
                            )}
                        </div>

                        <span className="shrink-0 text-[11px] text-gray-400">
                            {formatDate(conversation.last_message_at)}
                        </span>
                    </div>

                    <p className="mt-0.5 truncate text-xs text-gray-400">
                        {email ??
                            `Guest ID: ${
                                conversation.guest_id?.slice(0, 8) ?? "Unknown"
                            }`}
                    </p>

                    <p
                        className={`mt-2 line-clamp-1 text-sm ${
                            hasUnread
                                ? "font-medium text-gray-800"
                                : "text-gray-500"
                        }`}
                    >
                        {latestMessage}
                    </p>
                </div>

                {/* Right */}
                <div className="flex shrink-0 items-center gap-2">
                    {hasUnread && (
                        <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-[#b91c1c] px-1.5 text-[10px] font-bold text-white">
                            {conversation.unread_messages_count}
                        </span>
                    )}

                    <ChevronRight className="h-5 w-5 text-gray-300 transition group-hover:translate-x-0.5 group-hover:text-[#b91c1c]" />
                </div>
            </Link>
        </motion.div>
    );
}

/*
|--------------------------------------------------------------------------
| Loading
|--------------------------------------------------------------------------
*/

function LoadingState() {
    return (
        <div className="divide-y divide-gray-100">
            {[1, 2, 3, 4].map((item) => (
                <div key={item} className="flex gap-4 p-5">
                    <div className="h-12 w-12 shrink-0 animate-pulse rounded-full bg-gray-100" />

                    <div className="flex-1 space-y-2">
                        <div className="h-4 w-32 animate-pulse rounded bg-gray-100" />
                        <div className="h-3 w-48 animate-pulse rounded bg-gray-100" />
                        <div className="h-4 w-3/4 animate-pulse rounded bg-gray-100" />
                    </div>
                </div>
            ))}
        </div>
    );
}

/*
|--------------------------------------------------------------------------
| Empty State
|--------------------------------------------------------------------------
*/

function EmptyState({ hasSearch }: { hasSearch: boolean }) {
    return (
        <div className="flex min-h-[360px] flex-col items-center justify-center px-6 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 text-gray-400">
                <Inbox className="h-6 w-6" />
            </div>

            <h3 className="mt-4 text-base font-semibold text-gray-900">
                {hasSearch ? "No conversations found" : "Your inbox is empty"}
            </h3>

            <p className="mt-1 max-w-sm text-sm text-gray-500">
                {hasSearch
                    ? "Try searching with a different customer name, email, or message."
                    : "Customer support conversations will appear here when customers send a message."}
            </p>
        </div>
    );
}

/*
|--------------------------------------------------------------------------
| Date Formatting
|--------------------------------------------------------------------------
*/

function formatDate(date: string | null) {
    if (!date) {
        return "No messages";
    }

    const value = new Date(date);

    const now = new Date();

    const isToday = value.toDateString() === now.toDateString();

    if (isToday) {
        return value.toLocaleTimeString([], {
            hour: "numeric",
            minute: "2-digit",
        });
    }

    return value.toLocaleDateString([], {
        month: "short",
        day: "numeric",
        year: value.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
}
