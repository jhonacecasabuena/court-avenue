import { Head, usePage, router } from "@inertiajs/react";
import {
    CalendarDays,
    Clock3,
    DollarSign,
    MoreHorizontal,
    Plus,
    Settings,
    Users,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import { motion } from "motion/react";

import type { Auth } from "@/types";

type ChatPageProps = {
    auth: Auth;
    bookingStats: {
        total: number;
        pending: number;
        confirmed: number;
        today: number;
        yesterday: number;
    };
    revenueStats: {
        amount: number;
        month: string;
        previousMonth: string;
        nextMonth: string;
        canGoNext: boolean;
    };
    activeMembers: number;
};

const stats = [
    {
        title: "Total Bookings",
        value: "0",
        change: "+12.5%",
        description: "from last month",
        icon: CalendarDays,
    },
    {
        title: "Today's Bookings",
        value: "0",
        change: "+8.2%",
        description: "from yesterday",
        icon: Clock3,
    },
    {
        title: "Total Revenue",
        value: "₱0.00",
        change: "+14.8%",
        description: "from last month",
        icon: DollarSign,
    },
    {
        title: "Active Members",
        value: "1,284",
        change: "+6.4%",
        description: "new members this month",
        icon: Users,
    },
];

export default function Dashboard() {
    const {
        auth,
        bookingStats: rawBookingStats,
        revenueStats: rawRevenueStats,
        activeMembers: rawActiveMembers,
    } = usePage<ChatPageProps>().props;

    const activeMembers = Number(rawActiveMembers ?? 0);

    const bookingStats = {
        total: Number(rawBookingStats?.total ?? 0),
        pending: Number(rawBookingStats?.pending ?? 0),
        confirmed: Number(rawBookingStats?.confirmed ?? 0),
        today: Number(rawBookingStats?.today ?? 0),
        yesterday: Number(rawBookingStats?.yesterday ?? 0),
    };

    const revenueStats = {
        amount: Number(rawRevenueStats?.amount ?? 0),
        month: rawRevenueStats?.month ?? "",
        previousMonth: rawRevenueStats?.previousMonth ?? "",
        nextMonth: rawRevenueStats?.nextMonth ?? "",
        canGoNext: rawRevenueStats?.canGoNext ?? false,
    };

    const hour = new Date().getHours();

    const greeting =
        hour < 12
            ? "Good morning"
            : hour < 18
              ? "Good afternoon"
              : "Good evening";

    // Compare today's bookings against yesterday's.
    const todayChange =
        bookingStats.yesterday > 0
            ? ((bookingStats.today - bookingStats.yesterday) /
                  bookingStats.yesterday) *
              100
            : null;

    const todayChangeLabel =
        todayChange !== null
            ? `${todayChange > 0 ? "+" : ""}${todayChange.toFixed(1)}%`
            : bookingStats.today > 0
              ? "New"
              : "0.0%";

    const todayChangeColor =
        todayChange !== null && todayChange < 0
            ? "bg-red-50 text-red-700"
            : "bg-green-50 text-green-700";

    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat("en-PH", {
            style: "currency",
            currency: "PHP",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(amount);

    const formatRevenueMonth = (month: string) => {
        if (!month) {
            return "Select month";
        }

        const [year, monthNumber] = month.split("-").map(Number);

        return new Date(year, monthNumber - 1, 1).toLocaleDateString("en-PH", {
            month: "long",
            year: "numeric",
        });
    };

    const changeRevenueMonth = (month: string) => {
        if (!month) {
            return;
        }

        router.get(
            window.location.pathname,
            { revenue_month: month },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            },
        );
    };

    return (
        <>
            <Head title="Admin Dashboard" />

            <div className="min-h-screen bg-[#f8f8f8]">
                <div className="mx-auto max-w-7xl space-y-8 p-4 sm:p-6 lg:p-8">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: -15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between"
                    >
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-gray-950 sm:text-3xl">
                                {greeting},{" "}
                                {auth.user?.role?.split(" ")[0] ?? "Admin"}
                            </h1>

                            <p className="mt-1 text-sm text-gray-500">
                                Here's what's happening at Court Avenue today.
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                            <button
                                type="button"
                                className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#b91c1c] px-4 text-sm font-semibold text-white shadow-lg shadow-red-900/10 transition hover:bg-red-800"
                            >
                                <Settings className="h-4 w-4" />
                                Manage Payment Verification
                            </button>

                            <button
                                onClick={() => router.get("/booking")}
                                className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#b91c1c] px-4 text-sm font-semibold text-white shadow-lg shadow-red-900/10 transition hover:bg-red-800"
                            >
                                <Plus className="h-4 w-4" />
                                New Booking / Walk-Ins
                            </button>
                        </div>
                    </motion.div>

                    {/* Stats */}
                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        {stats.map((stat, index) => {
                            const Icon = stat.icon;

                            const isTotalBookings =
                                stat.title === "Total Bookings";

                            const isTodayBookings =
                                stat.title === "Today's Bookings";

                            const isTotalRevenue =
                                stat.title === "Total Revenue";

                            const isActiveMembers =
                                stat.title === "Active Members";

                            const displayValue = isTotalBookings
                                ? bookingStats.total.toLocaleString()
                                : isTodayBookings
                                  ? bookingStats.today.toLocaleString()
                                  : isTotalRevenue
                                    ? formatCurrency(revenueStats.amount)
                                    : isActiveMembers
                                      ? activeMembers.toLocaleString()
                                      : stat.value;

                            const changeLabel = isTodayBookings
                                ? todayChangeLabel
                                : stat.change;

                            const changeColor = isTodayBookings
                                ? todayChangeColor
                                : "bg-green-50 text-green-700";

                            return (
                                <motion.div
                                    key={stat.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{
                                        duration: 0.4,
                                        delay: index * 0.08,
                                    }}
                                    className="group rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                                >
                                    {/* Icon and actions */}
                                    <div className="flex items-start justify-between">
                                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-[#b91c1c]">
                                            <Icon className="h-5 w-5" />
                                        </div>

                                        <button
                                            type="button"
                                            aria-label={`More options for ${stat.title}`}
                                            className="text-gray-400 opacity-0 transition group-hover:opacity-100 hover:text-gray-700"
                                        >
                                            <MoreHorizontal className="h-5 w-5" />
                                        </button>
                                    </div>

                                    {/* Title */}
                                    <p className="mt-5 text-sm font-medium text-gray-500">
                                        {stat.title}
                                    </p>

                                    {/* Value and percentage */}
                                    <div className="mt-1 flex items-end justify-between gap-3">
                                        <p className="text-2xl font-bold tracking-tight text-gray-950">
                                            {displayValue}
                                        </p>

                                        {!isTotalBookings &&
                                            !isTodayBookings &&
                                            !isTotalRevenue && (
                                                <span className="mb-1 shrink-0 rounded-full bg-green-50 px-2 py-1 text-[11px] font-bold text-green-700">
                                                    {stat.change}
                                                </span>
                                            )}
                                    </div>

                                    {/* Total Revenue month navigation */}
                                    {isTotalRevenue ? (
                                        <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    changeRevenueMonth(
                                                        revenueStats.previousMonth,
                                                    )
                                                }
                                                disabled={
                                                    !revenueStats.previousMonth
                                                }
                                                aria-label="View previous month's revenue"
                                                className="rounded-lg p-2 text-gray-500 transition hover:bg-red-50 hover:text-[#b91c1c] disabled:cursor-not-allowed disabled:opacity-30"
                                            >
                                                <ChevronLeft className="h-4 w-4" />
                                            </button>

                                            <span className="text-xs font-medium text-gray-600">
                                                {formatRevenueMonth(
                                                    revenueStats.month,
                                                )}
                                            </span>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    changeRevenueMonth(
                                                        revenueStats.nextMonth,
                                                    )
                                                }
                                                disabled={
                                                    !revenueStats.canGoNext
                                                }
                                                aria-label="View next month's revenue"
                                                className="rounded-lg p-2 text-gray-500 transition hover:bg-red-50 hover:text-[#b91c1c] disabled:cursor-not-allowed disabled:opacity-30"
                                            >
                                                <ChevronRight className="h-4 w-4" />
                                            </button>
                                        </div>
                                    ) : isTotalBookings ? (
                                        /* Pending and confirmed breakdown */
                                        <div className="mt-3 space-y-2 border-t border-gray-100 pt-3">
                                            <div className="flex items-center justify-between gap-2">
                                                <span className="text-xs text-amber-600">
                                                    Awaiting confirmation /
                                                    Pending
                                                </span>

                                                <span className="text-sm font-bold text-amber-600">
                                                    {bookingStats.pending.toLocaleString()}
                                                </span>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <span className="text-xs text-green-600">
                                                    Confirmed
                                                </span>

                                                <span className="text-sm font-bold text-green-600">
                                                    {bookingStats.confirmed.toLocaleString()}
                                                </span>
                                            </div>
                                        </div>
                                    ) : (
                                        /* Other card descriptions */
                                        <p className="mt-1 text-xs text-gray-400">
                                            {isTodayBookings
                                                ? `Compared with yesterday (${bookingStats.yesterday.toLocaleString()})`
                                                : stat.description}
                                        </p>
                                    )}
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* Main Grid */}
                </div>
            </div>
        </>
    );
}
