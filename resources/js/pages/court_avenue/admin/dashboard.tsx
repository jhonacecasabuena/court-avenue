import { Head, usePage } from "@inertiajs/react";
import { useEffect, useRef, useState } from "react";
import {
    ArrowUpRight,
    CalendarDays,
    CheckCircle2,
    Clock3,
    DollarSign,
    MapPin,
    MoreHorizontal,
    Plus,
    Trophy,
    Users,
    XCircle,
} from "lucide-react";
import { motion } from "motion/react";

import type { Auth } from "@/types";

type ChatPageProps = {
    auth: Auth;
};

const stats = [
    {
        title: "Total Bookings",
        value: "248",
        change: "+12.5%",
        description: "from last month",
        icon: CalendarDays,
    },
    {
        title: "Today's Bookings",
        value: "32",
        change: "+8.2%",
        description: "from yesterday",
        icon: Clock3,
    },
    {
        title: "Total Revenue",
        value: "₱84,560",
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

const courtStatus = [
    {
        name: "Court 1",
        type: "Indoor Court",
        status: "Available",
        time: "Available now",
    },
    {
        name: "Court 2",
        type: "Indoor Court",
        status: "Occupied",
        time: "Until 4:30 PM",
    },
    {
        name: "Court 3",
        type: "Outdoor Court",
        status: "Available",
        time: "Available now",
    },
    {
        name: "Court 4",
        type: "Outdoor Court",
        status: "Occupied",
        time: "Until 5:00 PM",
    },
];

const upcomingBookings = [
    {
        name: "Michael Santos",
        court: "Court 1",
        date: "Today",
        time: "4:00 PM – 5:00 PM",
        status: "Confirmed",
    },
    {
        name: "Angela Cruz",
        court: "Court 3",
        date: "Today",
        time: "5:00 PM – 6:00 PM",
        status: "Confirmed",
    },
    {
        name: "John Reyes",
        court: "Court 2",
        date: "Today",
        time: "6:00 PM – 7:00 PM",
        status: "Pending",
    },
    {
        name: "Sarah Garcia",
        court: "Court 4",
        date: "Tomorrow",
        time: "8:00 AM – 9:00 AM",
        status: "Confirmed",
    },
];

const activities = [
    {
        title: "New booking received",
        description: "Michael Santos booked Court 1",
        time: "5 minutes ago",
        icon: CalendarDays,
    },
    {
        title: "New member registered",
        description: "Angela Cruz joined Court Avenue",
        time: "18 minutes ago",
        icon: Users,
    },
    {
        title: "Tournament registration",
        description: "John Reyes registered for Open Play",
        time: "42 minutes ago",
        icon: Trophy,
    },
    {
        title: "Booking cancelled",
        description: "Court 4 booking was cancelled",
        time: "1 hour ago",
        icon: XCircle,
    },
];

export default function Dashboard() {
    const { auth } = usePage<ChatPageProps>().props;

    const hour = new Date().getHours();

    const greeting =
        hour < 12
            ? "Good morning"
            : hour < 18
              ? "Good afternoon"
              : "Good evening";

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
                                {greeting}, {auth.user?.name?.split(" ")[0]}
                            </h1>

                            <p className="mt-1 text-sm text-gray-500">
                                Here's what's happening at Court Avenue today.
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                className="inline-flex h-10 items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 text-sm font-semibold text-gray-700 shadow-sm transition hover:border-gray-300 hover:bg-gray-50"
                            >
                                <CalendarDays className="h-4 w-4" />
                                Today
                            </button>

                            <button
                                type="button"
                                className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#b91c1c] px-4 text-sm font-semibold text-white shadow-lg shadow-red-900/10 transition hover:bg-red-800"
                            >
                                <Plus className="h-4 w-4" />
                                New Booking
                            </button>
                        </div>
                    </motion.div>

                    {/* Stats */}
                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        {stats.map((stat, index) => {
                            const Icon = stat.icon;

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
                                    <div className="flex items-start justify-between">
                                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-[#b91c1c]">
                                            <Icon className="h-5 w-5" />
                                        </div>

                                        <button
                                            type="button"
                                            className="text-gray-400 opacity-0 transition group-hover:opacity-100 hover:text-gray-700"
                                        >
                                            <MoreHorizontal className="h-5 w-5" />
                                        </button>
                                    </div>

                                    <p className="mt-5 text-sm font-medium text-gray-500">
                                        {stat.title}
                                    </p>

                                    <div className="mt-1 flex items-end justify-between gap-3">
                                        <p className="text-2xl font-bold tracking-tight text-gray-950">
                                            {stat.value}
                                        </p>

                                        <span className="mb-1 rounded-full bg-green-50 px-2 py-1 text-[11px] font-bold text-green-700">
                                            {stat.change}
                                        </span>
                                    </div>

                                    <p className="mt-1 text-xs text-gray-400">
                                        {stat.description}
                                    </p>
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* Main Grid */}
                    <div className="grid gap-6 xl:grid-cols-3">
                        {/* Upcoming Bookings */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.45, delay: 0.25 }}
                            className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm xl:col-span-2"
                        >
                            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
                                <div>
                                    <h2 className="font-bold text-gray-950">
                                        Upcoming Bookings
                                    </h2>
                                    <p className="mt-0.5 text-xs text-gray-500">
                                        Recent and upcoming court reservations
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    className="flex items-center gap-1 text-xs font-bold text-[#b91c1c] hover:text-red-800"
                                >
                                    View all
                                    <ArrowUpRight className="h-3.5 w-3.5" />
                                </button>
                            </div>

                            <div className="divide-y divide-gray-100">
                                {upcomingBookings.map((booking) => (
                                    <div
                                        key={`${booking.name}-${booking.time}`}
                                        className="flex flex-col gap-3 px-5 py-4 transition hover:bg-gray-50 sm:flex-row sm:items-center sm:justify-between"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100 text-sm font-bold text-gray-700">
                                                {booking.name
                                                    .split(" ")
                                                    .map((name) => name[0])
                                                    .join("")
                                                    .slice(0, 2)}
                                            </div>

                                            <div>
                                                <p className="text-sm font-semibold text-gray-900">
                                                    {booking.name}
                                                </p>

                                                <p className="mt-0.5 text-xs text-gray-500">
                                                    {booking.court} ·{" "}
                                                    {booking.date}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between gap-6 sm:justify-end">
                                            <div className="text-left sm:text-right">
                                                <p className="text-sm font-semibold text-gray-800">
                                                    {booking.time}
                                                </p>

                                                <span
                                                    className={`mt-1 inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold ${
                                                        booking.status ===
                                                        "Confirmed"
                                                            ? "bg-green-50 text-green-700"
                                                            : "bg-amber-50 text-amber-700"
                                                    }`}
                                                >
                                                    {booking.status}
                                                </span>
                                            </div>

                                            <button
                                                type="button"
                                                className="text-gray-400 hover:text-gray-700"
                                            >
                                                <MoreHorizontal className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Court Status */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.45, delay: 0.3 }}
                            className="rounded-2xl border border-gray-200 bg-white shadow-sm"
                        >
                            <div className="border-b border-gray-100 px-5 py-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="font-bold text-gray-950">
                                            Court Status
                                        </h2>

                                        <p className="mt-0.5 text-xs text-gray-500">
                                            Live availability
                                        </p>
                                    </div>

                                    <MapPin className="h-5 w-5 text-[#b91c1c]" />
                                </div>
                            </div>

                            <div className="space-y-1 p-3">
                                {courtStatus.map((court) => (
                                    <div
                                        key={court.name}
                                        className="rounded-xl p-3 transition hover:bg-gray-50"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <span
                                                    className={`h-2.5 w-2.5 rounded-full ${
                                                        court.status ===
                                                        "Available"
                                                            ? "bg-green-500"
                                                            : "bg-red-500"
                                                    }`}
                                                />

                                                <div>
                                                    <p className="text-sm font-semibold text-gray-900">
                                                        {court.name}
                                                    </p>

                                                    <p className="text-[11px] text-gray-500">
                                                        {court.type}
                                                    </p>
                                                </div>
                                            </div>

                                            <span
                                                className={`text-[11px] font-bold ${
                                                    court.status === "Available"
                                                        ? "text-green-600"
                                                        : "text-red-600"
                                                }`}
                                            >
                                                {court.status}
                                            </span>
                                        </div>

                                        <p className="mt-2 pl-5 text-[11px] text-gray-400">
                                            {court.time}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>

                    {/* Bottom Grid */}
                    <div className="grid gap-6 lg:grid-cols-2">
                        {/* Quick Actions */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.45, delay: 0.35 }}
                            className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
                        >
                            <div className="mb-5">
                                <h2 className="font-bold text-gray-950">
                                    Quick Actions
                                </h2>

                                <p className="mt-0.5 text-xs text-gray-500">
                                    Manage your Court Avenue operations
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <QuickAction
                                    icon={CalendarDays}
                                    title="Manage Bookings"
                                    description="View reservations"
                                />

                                <QuickAction
                                    icon={MapPin}
                                    title="Manage Courts"
                                    description="Court availability"
                                />

                                <QuickAction
                                    icon={Users}
                                    title="Manage Users"
                                    description="Members & accounts"
                                />

                                <QuickAction
                                    icon={Trophy}
                                    title="Tournaments"
                                    description="Events & matches"
                                />
                            </div>
                        </motion.div>

                        {/* Recent Activity */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.45, delay: 0.4 }}
                            className="rounded-2xl border border-gray-200 bg-white shadow-sm"
                        >
                            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
                                <div>
                                    <h2 className="font-bold text-gray-950">
                                        Recent Activity
                                    </h2>

                                    <p className="mt-0.5 text-xs text-gray-500">
                                        Latest activity across the platform
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    className="text-xs font-bold text-[#b91c1c] hover:text-red-800"
                                >
                                    View all
                                </button>
                            </div>

                            <div className="divide-y divide-gray-100">
                                {activities.map((activity) => {
                                    const Icon = activity.icon;

                                    return (
                                        <div
                                            key={activity.title}
                                            className="flex gap-3 px-5 py-3.5"
                                        >
                                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-50 text-[#b91c1c]">
                                                <Icon className="h-4 w-4" />
                                            </div>

                                            <div className="min-w-0">
                                                <p className="text-sm font-semibold text-gray-800">
                                                    {activity.title}
                                                </p>

                                                <p className="truncate text-xs text-gray-500">
                                                    {activity.description}
                                                </p>

                                                <p className="mt-1 text-[10px] text-gray-400">
                                                    {activity.time}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </motion.div>
                    </div>

                    {/* Footer Info */}
                    <div className="flex flex-col gap-2 border-t border-gray-200 pt-5 text-xs text-gray-400 sm:flex-row sm:items-center sm:justify-between">
                        <p>
                            Court Avenue Admin Panel ·{" "}
                            {new Date().getFullYear()}
                        </p>

                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                            <span>System operational</span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

function QuickAction({
    icon: Icon,
    title,
    description,
}: {
    icon: typeof CalendarDays;
    title: string;
    description: string;
}) {
    return (
        <button
            type="button"
            className="group flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 p-3 text-left transition hover:border-red-100 hover:bg-red-50"
        >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-[#b91c1c] shadow-sm transition group-hover:bg-[#b91c1c] group-hover:text-white">
                <Icon className="h-4 w-4" />
            </div>

            <div className="min-w-0">
                <p className="truncate text-xs font-bold text-gray-800">
                    {title}
                </p>

                <p className="mt-0.5 truncate text-[10px] text-gray-500">
                    {description}
                </p>
            </div>
        </button>
    );
}
