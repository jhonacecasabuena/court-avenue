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
    MessageCircle,
} from "lucide-react";
import { motion } from "motion/react";

import type { Auth } from "@/types";
import MonthlyRevenueChart from "@/components/court_avenue/MontlyRevenueStat";

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
    revenueHistory: {
        month: string;
        amount: number;
    }[];
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
        revenueHistory: rawRevenueHistory,
        activeMembers: rawActiveMembers,
    } = usePage<ChatPageProps>().props;

    const activeMembers = Number(rawActiveMembers ?? 0);
    const revenueHistory = rawRevenueHistory ?? [];

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

                            <p className="mt-1 text-sm text-gray-700">
                                Here's what's happening at Court Avenue today.
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                            <button
                                onClick={() =>
                                    router.get("/booking/my-bookings")
                                }
                                className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#b91c1c] px-4 text-sm font-semibold text-white shadow-lg shadow-red-900/10 transition hover:bg-red-800"
                            >
                                <Settings className="h-4 w-4" />
                                Manage Booking & Payment Verification
                            </button>

                            <button
                                onClick={() => router.get("/booking")}
                                className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#b91c1c] px-4 text-sm font-semibold text-white shadow-lg shadow-red-900/10 transition hover:bg-red-800"
                            >
                                <Plus className="h-4 w-4" />
                                New Booking / Walk-Ins
                            </button>

                            <button
                                onClick={() => router.get("/support/inbox")}
                                className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#b91c1c] px-4 text-sm font-semibold text-white shadow-lg shadow-red-900/10 transition hover:bg-red-800"
                            >
                                <MessageCircle className="h-4 w-4" />
                                Inbox
                            </button>
                            <button
                                onClick={() => router.get("/admin/users")}
                                className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#b91c1c] px-4 text-sm font-semibold text-white shadow-lg shadow-red-900/10 transition hover:bg-red-800"
                            >
                                <MessageCircle className="h-4 w-4" />
                                Users
                            </button>
                        </div>
                    </motion.div>

                    {/* Stats */}
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4">
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
                                    initial={{ opacity: 0, y: 14 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{
                                        duration: 0.35,
                                        delay: index * 0.06,
                                    }}
                                    className="group min-w-0 rounded-xl border border-gray-200/80 bg-white p-3 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-red-200 hover:shadow-md sm:rounded-2xl sm:p-4 lg:p-5"
                                >
                                    {/* Compact heading */}
                                    <div className="flex min-w-0 items-center justify-between gap-2">
                                        <div className="flex min-w-0 items-center gap-2 sm:gap-2.5">
                                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-50 text-[#b91c1c] ring-1 ring-inset ring-red-100/80 sm:h-9 sm:w-9">
                                                <Icon className="h-4 w-4 sm:h-[18px] sm:w-[18px]" />
                                            </div>

                                            <p className="truncate text-xs font-semibold text-gray-600 sm:text-sm">
                                                {stat.title}
                                            </p>
                                        </div>

                                        {isActiveMembers && (
                                            <span className="hidden shrink-0 rounded-full bg-green-50 px-2 py-1 text-[10px] font-semibold text-green-700 sm:inline-flex">
                                                Active
                                            </span>
                                        )}
                                    </div>

                                    {/* Main statistic */}
                                    <div className="mt-3 flex min-w-0 items-center justify-between gap-2 sm:mt-4">
                                        <p
                                            className={`min-w-0 truncate font-bold tracking-wider text-gray-950 ${
                                                isTotalRevenue
                                                    ? "text-xl sm:text-2xl"
                                                    : "text-2xl sm:text-3xl"
                                            }`}
                                        >
                                            {displayValue}
                                        </p>

                                        {!isTotalBookings &&
                                            !isTodayBookings &&
                                            !isTotalRevenue && (
                                                <span
                                                    className={`shrink-0 rounded-md px-1.5 py-1 text-[10px] font-bold sm:text-[11px] ${changeColor}`}
                                                >
                                                    {changeLabel}
                                                </span>
                                            )}
                                    </div>

                                    {/* Revenue month selector */}
                                    {isTotalRevenue ? (
                                        <div className="mt-3 flex items-center justify-between gap-2 border-t border-gray-100 pt-2">
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
                                                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-gray-500 transition hover:bg-red-50 hover:text-[#b91c1c] disabled:cursor-not-allowed disabled:opacity-30"
                                            >
                                                <ChevronLeft className="h-4 w-4" />
                                            </button>

                                            <span className="min-w-0 truncate text-center text-[11px] font-medium text-gray-600 sm:text-xs">
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
                                                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-gray-600 transition hover:bg-red-50 hover:text-[#b91c1c] disabled:cursor-not-allowed disabled:opacity-30"
                                            >
                                                <ChevronRight className="h-4 w-4" />
                                            </button>
                                        </div>
                                    ) : isTotalBookings ? (
                                        /* Booking breakdown */
                                        <div className="mt-3 space-y-2 border-t border-gray-100 pt-2.5">
                                            <div className="flex items-center justify-between gap-2">
                                                <span className="tracking-wider min-w-0 truncate text-[11px] text-amber-600 sm:text-xs">
                                                    Pending
                                                </span>

                                                <span className="shrink-0 text-xs font-bold text-amber-600 sm:text-sm">
                                                    {bookingStats.pending.toLocaleString()}
                                                </span>
                                            </div>

                                            <div className="flex items-center justify-between gap-2">
                                                <span className="text-[11px] text-green-600 tracking-wider sm:text-xs">
                                                    Confirmed
                                                </span>

                                                <span className="shrink-0 text-xs font-bold text-green-600 sm:text-sm">
                                                    {bookingStats.confirmed.toLocaleString()}
                                                </span>
                                            </div>
                                        </div>
                                    ) : (
                                        /* Supporting description */
                                        <p className="mt-1.5 truncate text-[11px] text-gray-600 sm:text-xs">
                                            {isTodayBookings
                                                ? `Compared with yesterday (${bookingStats.yesterday.toLocaleString()})`
                                                : stat.description}
                                        </p>
                                    )}
                                </motion.div>
                            );
                        })}
                    </div>

                    <MonthlyRevenueChart
                        data={revenueHistory}
                        selectedMonth={revenueStats.month}
                        selectedAmount={revenueStats.amount}
                    />
                </div>
            </div>
        </>
    );
}
