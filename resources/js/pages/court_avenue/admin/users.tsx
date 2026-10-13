import { Head, Link, router } from "@inertiajs/react";
import { useState } from "react";
import {
    ArrowLeft,
    CalendarDays,
    Clock3,
    Search,
    Users,
    Trophy,
    Wallet,
    Activity,
    X,
} from "lucide-react";

type UserRecord = {
    id: number;
    name: string;
    email: string;
    role?: string | null;
    created_at: string;
    total_bookings: number;
    total_sessions: number;
    total_playing_hours: number | string;
    total_spent: number | string | null;
    total_booked_items: number;
    last_played: string | null;
};

type Pagination<T> = {
    data: T[];
    current_page: number;
    last_page: number;
    total: number;
    prev_page_url: string | null;
    next_page_url: string | null;
};

type Props = {
    users: Pagination<UserRecord>;
    filters: {
        search: string;
    };
};

const currency = (amount: number | string | null) =>
    new Intl.NumberFormat("en-PH", {
        style: "currency",
        currency: "PHP",
        maximumFractionDigits: 2,
    }).format(Number(amount ?? 0));

const dateFormat = (date: string | null) => {
    if (!date) return "Never";

    return new Date(`${date.slice(0, 10)}T00:00:00`).toLocaleDateString(
        "en-PH",
        {
            month: "short",
            day: "numeric",
            year: "numeric",
        },
    );
};

export default function UsersPage({ users, filters }: Props) {
    const [search, setSearch] = useState(filters.search ?? "");

    const submitSearch = () => {
        router.get(
            "/admin/users",
            { search: search.trim() },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            },
        );
    };

    return (
        <>
            <Head title="Manage Users | Court Avenue" />

            <main className="min-h-screen text-black bg-neutral-50 px-4 py-6 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-7xl space-y-6">
                    {/* Header */}
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-start gap-3">
                            <Link
                                href="/admin/dashboard"
                                className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-neutral-200 bg-white text-neutral-600 transition hover:border-red-200 hover:text-[#b91c1c]"
                                aria-label="Back to dashboard"
                            >
                                <ArrowLeft size={18} />
                            </Link>

                            <div>
                                <h1 className="text-xl font-extrabold tracking-tight text-neutral-900 sm:text-2xl">
                                    Manage Users
                                </h1>
                                <p className="mt-1 text-sm text-neutral-500">
                                    View members, court activity, and spending.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 self-start rounded-xl border border-red-100 bg-red-50 px-3 py-2 text-sm font-semibold text-[#b91c1c]">
                            <Users size={17} />
                            {users.total} users
                        </div>
                    </div>

                    {/* Search */}
                    {/* Search */}
                    <form
                        onSubmit={(event) => {
                            event.preventDefault();
                            submitSearch();
                        }}
                        className="flex flex-col gap-2 rounded-2xl border border-neutral-200 bg-white p-3 shadow-sm sm:flex-row"
                    >
                        <div className="flex min-w-0 flex-1 items-center gap-2 rounded-xl border border-neutral-200 px-3">
                            <Search
                                size={17}
                                className="shrink-0 text-neutral-400"
                            />
                            <input
                                value={search}
                                onChange={(event) =>
                                    setSearch(event.target.value)
                                }
                                placeholder="Search by name or email..."
                                className="min-w-0 flex-1 border-0 bg-transparent py-2.5 text-sm outline-none focus:ring-0"
                            />
                        </div>

                        <div className="flex gap-2">
                            <button
                                type="submit"
                                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#b91c1c] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-red-800 sm:flex-none"
                            >
                                <Search size={15} />
                                Search
                            </button>

                            <button
                                type="button"
                                onClick={() => {
                                    setSearch("");
                                    router.get(
                                        "/admin/users",
                                        {},
                                        {
                                            preserveState: true,
                                            preserveScroll: true,
                                            replace: true,
                                        },
                                    );
                                }}
                                disabled={!search.trim() && !filters.search}
                                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm font-bold text-neutral-600 transition hover:border-red-200 hover:bg-red-50 hover:text-[#b91c1c] disabled:cursor-not-allowed disabled:opacity-40 sm:flex-none"
                            >
                                <X size={15} />
                                Clear
                            </button>
                        </div>
                    </form>

                    {/* Users table */}
                    <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
                        <div className="border-b border-neutral-100 px-4 py-4 sm:px-6">
                            <h2 className="font-bold text-neutral-900">
                                User Activity
                            </h2>
                            <p className="mt-1 text-xs text-neutral-500">
                                Playing statistics include past, paid, confirmed
                                court sessions.
                            </p>
                        </div>

                        {users.data.length === 0 ? (
                            <div className="flex flex-col items-center px-6 py-16 text-center">
                                <Users size={32} className="text-neutral-300" />
                                <p className="mt-3 font-bold text-neutral-800">
                                    No users found
                                </p>
                                <p className="mt-1 text-sm text-neutral-500">
                                    Try another name or email.
                                </p>
                            </div>
                        ) : (
                            <>
                                {/* Mobile cards */}
                                <div className="divide-y divide-neutral-100 md:hidden">
                                    {users.data.map((user) => (
                                        <div
                                            key={user.id}
                                            className="space-y-4 p-4"
                                        >
                                            <div className="flex min-w-0 items-start gap-3">
                                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-50 text-sm font-extrabold text-[#b91c1c]">
                                                    {user.name
                                                        .split(" ")
                                                        .slice(0, 2)
                                                        .map(
                                                            (part) =>
                                                                part[0] ?? "",
                                                        )
                                                        .join("")
                                                        .toUpperCase()}
                                                </div>

                                                <div className="min-w-0 flex-1">
                                                    <p className="break-words text-sm font-bold text-neutral-900">
                                                        {user.name}
                                                    </p>
                                                    <p className="break-all text-xs text-neutral-500">
                                                        {user.email}
                                                    </p>
                                                    <span className="mt-2 inline-flex rounded-full bg-neutral-100 px-2.5 py-1 text-[10px] font-bold capitalize text-neutral-600">
                                                        {user.role ?? "user"}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-3">
                                                <Metric
                                                    icon={
                                                        <CalendarDays
                                                            size={15}
                                                        />
                                                    }
                                                    label="Bookings"
                                                    value={user.total_bookings}
                                                />
                                                <Metric
                                                    icon={<Trophy size={15} />}
                                                    label="Slots Booked"
                                                    value={
                                                        user.total_booked_items ??
                                                        0
                                                    }
                                                />

                                                <Metric
                                                    icon={<Wallet size={15} />}
                                                    label="Total Spent"
                                                    value={currency(
                                                        user.total_spent,
                                                    )}
                                                />
                                            </div>

                                            <div className="flex items-center justify-between gap-3 border-t border-neutral-100 pt-3 text-xs">
                                                <span className="text-neutral-500">
                                                    Last played
                                                </span>
                                                <span className="text-right font-semibold text-neutral-800">
                                                    {dateFormat(
                                                        user.last_played,
                                                    )}
                                                </span>
                                            </div>

                                            <p className="text-[11px] text-neutral-400">
                                                Joined{" "}
                                                {dateFormat(user.created_at)}
                                            </p>
                                        </div>
                                    ))}
                                </div>

                                {/* Desktop table */}
                                <div className="hidden overflow-x-auto md:block">
                                    <table className="w-full min-w-[1050px] text-left text-sm">
                                        <thead className="bg-neutral-50 text-[10px] uppercase tracking-wider text-neutral-500">
                                            <tr>
                                                <th className="px-5 py-4">
                                                    User
                                                </th>

                                                <th className="px-4 py-4 text-center">
                                                    Bookings
                                                </th>
                                                <th className="px-4 py-4 text-center">
                                                    Slots Booked
                                                </th>

                                                <th className="px-4 py-4 text-right">
                                                    Total Spent
                                                </th>
                                                <th className="px-4 py-4">
                                                    Last Played
                                                </th>
                                                <th className="px-4 py-4">
                                                    Joined
                                                </th>
                                            </tr>
                                        </thead>

                                        <tbody className="divide-y divide-neutral-100">
                                            {users.data.map((user) => (
                                                <tr
                                                    key={user.id}
                                                    className="transition hover:bg-neutral-50/70"
                                                >
                                                    <td className="px-5 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-50 text-xs font-extrabold text-[#b91c1c]">
                                                                {user.name
                                                                    .split(" ")
                                                                    .slice(0, 2)
                                                                    .map(
                                                                        (
                                                                            part,
                                                                        ) =>
                                                                            part[0] ??
                                                                            "",
                                                                    )
                                                                    .join("")
                                                                    .toUpperCase()}
                                                            </div>
                                                            <div className="min-w-0">
                                                                <p className="font-bold text-neutral-900">
                                                                    {user.name}
                                                                </p>
                                                                <p className="mt-0.5 text-xs text-neutral-500">
                                                                    {user.email}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-4 text-center font-semibold">
                                                        {user.total_bookings}
                                                    </td>
                                                    <td className="px-4 py-3 text-center">
                                                        <span className="font-semibold text-gray-900">
                                                            {Number(
                                                                user.total_booked_items ??
                                                                    0,
                                                            ).toLocaleString()}
                                                        </span>
                                                        <span className="ml-1 text-xs text-gray-500">
                                                            items
                                                        </span>
                                                    </td>

                                                    <td className="px-4 py-4 text-right font-bold tabular-nums text-neutral-900">
                                                        {currency(
                                                            user.total_spent,
                                                        )}
                                                    </td>
                                                    <td className="px-4 py-4 whitespace-nowrap text-neutral-600">
                                                        {dateFormat(
                                                            user.last_played,
                                                        )}
                                                    </td>
                                                    <td className="px-4 py-4 whitespace-nowrap text-neutral-600">
                                                        {dateFormat(
                                                            user.created_at,
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </>
                        )}

                        {/* Pagination */}
                        <div className="flex flex-col gap-3 border-t border-neutral-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                            <p className="text-xs text-neutral-500">
                                Page {users.current_page} of {users.last_page}
                                {" · "}
                                {users.total} total users
                            </p>

                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    disabled={!users.prev_page_url}
                                    onClick={() =>
                                        users.prev_page_url &&
                                        router.visit(users.prev_page_url, {
                                            preserveScroll: true,
                                        })
                                    }
                                    className="rounded-lg border border-neutral-200 px-3 py-2 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    Previous
                                </button>

                                <button
                                    type="button"
                                    disabled={!users.next_page_url}
                                    onClick={() =>
                                        users.next_page_url &&
                                        router.visit(users.next_page_url, {
                                            preserveScroll: true,
                                        })
                                    }
                                    className="rounded-lg border border-neutral-200 px-3 py-2 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}

function Metric({
    icon,
    label,
    value,
}: {
    icon: React.ReactNode;
    label: string;
    value: string | number;
}) {
    return (
        <div className="min-w-0 rounded-xl border border-neutral-100 bg-neutral-50 p-3">
            <div className="flex items-center gap-1.5 text-neutral-500">
                {icon}
                <span className="text-[10px] font-semibold">{label}</span>
            </div>
            <p className="mt-2 break-words text-sm font-extrabold text-neutral-900">
                {value}
            </p>
        </div>
    );
}
