import { Head, Link, router, usePage } from "@inertiajs/react";
import { useEffect, useState } from "react";
import {
    ArrowLeft,
    CalendarDays,
    CheckCircle2,
    ChevronDown,
    ClipboardList,
    Info,
    LogOut,
    MapPin,
    ShieldCheck,
} from "lucide-react";

import DateSelector from "@/components/booking_court_avenue/DateSelector";
import CourtSchedule from "@/components/booking_court_avenue/CourtSchedule";
import BookingSummary from "@/components/booking_court_avenue/BookingSummary";
import { useBooking } from "@/hooks/use-booking";
import type { Court, TimeSlot, BookedSlot } from "@/types";
import ChatWidget from "@/components/booking_chat/ChatWidget";
import { toast } from "sonner";

type AuthUser = {
    id: number;
    name: string;
    email: string;
    role?: string;
};

type Selection = {
    date: string;
    court_id: number;
    time_slot_id: number;
};

type PageProps = {
    auth: {
        user: AuthUser | null;
    };
    savedSelections: Selection[];
};

type BookingPageProps = {
    courts: Court[];
    timeSlots: TimeSlot[];
    bookedSlots: BookedSlot[];
};

export default function Booking({
    courts,
    timeSlots,
    bookedSlots,
}: BookingPageProps) {
    const { auth, savedSelections = [] } = usePage<PageProps>().props;
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [open, setOpen] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    const closeMenu = () => {
        setOpen(false);
        setUserMenuOpen(false);
    };

    const backUrl = auth.user?.role === "admin" ? "/admin/dashboard" : "/";

    const {
        selectedDates,
        selections,
        toggleDate,
        toggleSlot,
        getSlotStatus,
        subtotal,
        serviceFee,
        total,
    } = useBooking(courts, timeSlots, bookedSlots, savedSelections);

    useEffect(() => {
        const interval = setInterval(() => {
            router.reload({
                only: ["bookedSlots"],
            });
        }, 10000);

        return () => clearInterval(interval);
    }, []);

    const handleLogout = () => {
        closeMenu();

        router.post(
            "/logout",
            {},
            {
                onSuccess: () => {
                    toast.success("Logged out successfully", {
                        description:
                            "You have been safely signed out of your account.",
                    });
                },
            },
        );
    };

    return (
        <>
            <Head title="Book a Court | Court Avenue" />

            <div className="min-h-screen bg-gray-50">
                {/* Top Header */}
                <header className="border-b border-red-800 bg-[#b91c1c] text-white">
                    <div className="mx-auto flex h-14 w-full max-w-[1400px] items-center justify-between px-3 sm:px-4 lg:px-5">
                        <div className="flex items-center gap-3">
                            <Link
                                href={backUrl}
                                className="group flex items-center gap-3 rounded-lg px-1.5 py-1 transition hover:bg-white/10"
                            >
                                {/* Back icon */}
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-white/10 transition group-hover:bg-white/20">
                                    <ArrowLeft className="h-4 w-4" />
                                </div>

                                {/* Title */}
                                <div>
                                    <p className="text-[8px] font-semibold uppercase tracking-[0.2em] text-red-100">
                                        Court Avenue
                                    </p>

                                    <h1 className="text-sm font-bold leading-tight sm:text-base">
                                        {auth.user?.role === "admin"
                                            ? "Book Walk-In"
                                            : "Book a Court"}
                                    </h1>
                                </div>
                            </Link>
                        </div>

                        <div className="flex items-center">
                            {auth.user && (
                                <div className="relative">
                                    {/* User avatar trigger */}
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setMenuOpen((prev) => !prev)
                                        }
                                        aria-label="Open user menu"
                                        aria-expanded={menuOpen}
                                        className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 py-1.5 pl-2 pr-3 transition hover:bg-white/20"
                                    >
                                        {/* Logged-in user's initials */}
                                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-sm font-bold text-[#b91c1c] shadow-sm">
                                            {auth.user.name
                                                ?.trim()
                                                .split(/\s+/)
                                                .slice(0, 2)
                                                .map((name) =>
                                                    name[0].toUpperCase(),
                                                )
                                                .join("") || "U"}
                                        </div>

                                        <ChevronDown
                                            size={16}
                                            className={`text-white transition-transform duration-200 ${
                                                menuOpen ? "rotate-180" : ""
                                            }`}
                                        />
                                    </button>

                                    {/* Popup menu */}
                                    {menuOpen && (
                                        <>
                                            <button
                                                type="button"
                                                aria-label="Close user menu"
                                                className="fixed inset-0 z-40 cursor-default"
                                                onClick={() =>
                                                    setMenuOpen(false)
                                                }
                                            />

                                            <div className="absolute right-0 top-full z-50 mt-2 w-64 overflow-hidden rounded-xl border border-neutral-200 bg-white p-2 shadow-xl">
                                                {/* User information */}
                                                <div className="flex items-center gap-3 border-b border-neutral-100 px-3 py-3">
                                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#b91c1c] text-sm font-bold text-white">
                                                        {auth.user.name
                                                            ?.trim()
                                                            .split(/\s+/)
                                                            .slice(0, 2)
                                                            .map((name) =>
                                                                name[0].toUpperCase(),
                                                            )
                                                            .join("") || "U"}
                                                    </div>

                                                    <div className="min-w-0">
                                                        <p className="truncate text-sm font-bold text-neutral-900">
                                                            {auth.user.name}
                                                        </p>
                                                        <p className="truncate text-xs text-neutral-500">
                                                            {auth.user.email}
                                                        </p>
                                                        <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#b91c1c]">
                                                            {auth.user.role ===
                                                            "user"
                                                                ? "Player"
                                                                : "Administrator"}
                                                        </p>
                                                    </div>
                                                </div>
                                                {auth.user.role === "admin" && (
                                                    <>
                                                        <Link
                                                            href="/admin/dashboard"
                                                            onClick={() =>
                                                                setMenuOpen(
                                                                    false,
                                                                )
                                                            }
                                                            className="group mt-1 flex items-center gap-3 rounded-lg px-3 py-3 transition-colors hover:bg-red-50"
                                                        >
                                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50 text-[#b91c1c] transition-colors group-hover:bg-[#b91c1c] group-hover:text-white">
                                                                <ClipboardList
                                                                    size={19}
                                                                />
                                                            </div>

                                                            <div className="min-w-0 leading-tight">
                                                                <p className="text-sm font-bold text-neutral-800 group-hover:text-[#b91c1c]">
                                                                    Dashboard
                                                                </p>

                                                                <p className="mt-1 text-[11px] font-medium text-neutral-500">
                                                                    Go to
                                                                    Dashboard
                                                                </p>
                                                            </div>
                                                        </Link>
                                                        <Link
                                                            href="/support/inbox"
                                                            onClick={() =>
                                                                setMenuOpen(
                                                                    false,
                                                                )
                                                            }
                                                            className="group mt-1 flex items-center gap-3 rounded-lg px-3 py-3 transition-colors hover:bg-red-50"
                                                        >
                                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50 text-[#b91c1c] transition-colors group-hover:bg-[#b91c1c] group-hover:text-white">
                                                                <ClipboardList
                                                                    size={19}
                                                                />
                                                            </div>

                                                            <div className="min-w-0 leading-tight">
                                                                <p className="text-sm font-bold text-neutral-800 group-hover:text-[#b91c1c]">
                                                                    Messages
                                                                </p>

                                                                <p className="mt-1 text-[11px] font-medium text-neutral-500">
                                                                    Go to
                                                                    Customer's
                                                                    Inquiry
                                                                </p>
                                                            </div>
                                                        </Link>
                                                    </>
                                                )}

                                                {/* My Bookings */}
                                                <Link
                                                    href="/booking/my-bookings"
                                                    onClick={() =>
                                                        setMenuOpen(false)
                                                    }
                                                    className="group mt-1 flex items-center gap-3 rounded-lg px-3 py-3 transition-colors hover:bg-red-50"
                                                >
                                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50 text-[#b91c1c] transition-colors group-hover:bg-[#b91c1c] group-hover:text-white">
                                                        <ClipboardList
                                                            size={19}
                                                        />
                                                    </div>

                                                    <div className="min-w-0 leading-tight">
                                                        <p className="text-sm font-bold text-neutral-800 group-hover:text-[#b91c1c]">
                                                            {auth.user.role ===
                                                            "admin"
                                                                ? "View All Bookings"
                                                                : "My Bookings"}
                                                        </p>

                                                        <p className="mt-1 text-[11px] font-medium text-neutral-500">
                                                            {auth.user.role ===
                                                            "admin"
                                                                ? "Manage all reservations"
                                                                : "View your reservations"}
                                                        </p>
                                                    </div>
                                                </Link>

                                                {auth.user.role != "admin" && (
                                                    <Link
                                                        href="/"
                                                        onClick={() =>
                                                            setMenuOpen(false)
                                                        }
                                                        className="group mt-1 flex items-center gap-3 rounded-lg px-3 py-3 transition-colors hover:bg-red-50"
                                                    >
                                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50 text-[#b91c1c] transition-colors group-hover:bg-[#b91c1c] group-hover:text-white">
                                                            <ClipboardList
                                                                size={19}
                                                            />
                                                        </div>

                                                        <div className="min-w-0 leading-tight">
                                                            <p className="text-sm font-bold text-neutral-800 group-hover:text-[#b91c1c]">
                                                                Send an Inquiry
                                                            </p>

                                                            <p className="mt-1 text-[11px] font-medium text-neutral-500">
                                                                Ask Admin for
                                                                questions
                                                            </p>
                                                        </div>
                                                    </Link>
                                                )}

                                                <div className="my-2 border-t border-neutral-100" />

                                                {/* Logout */}
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setMenuOpen(false);
                                                        handleLogout();
                                                    }}
                                                    className="group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors duration-200 hover:bg-red-50"
                                                >
                                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-neutral-100 text-neutral-500 transition-colors group-hover:bg-red-100 group-hover:text-[#b0002a]">
                                                        <LogOut size={19} />
                                                    </div>

                                                    <div className="min-w-0 flex-1">
                                                        <p className="text-sm font-bold text-neutral-700 transition-colors group-hover:text-[#b0002a]">
                                                            Log Out
                                                        </p>
                                                        <p className="mt-0.5 text-xs text-neutral-500">
                                                            Sign out of your
                                                            account
                                                        </p>
                                                    </div>
                                                </button>

                                                {/* My Bookings */}
                                            </div>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* Red accent */}
                <div className="h-1 bg-red-700" />

                <div className="mx-auto w-full max-w-[1400px] px-3 py-4 sm:px-4 lg:px-5">
                    {/* Page intro */}

                    {/* Booking workspace */}
                    <div className="grid min-w-0 gap-3 lg:grid-cols-[280px_minmax(0,1fr)_260px] lg:items-start">
                        {/* Calendar */}
                        <div className="min-w-0">
                            <DateSelector
                                selectedDates={selectedDates}
                                onToggleDate={toggleDate}
                            />

                            {/* Location card */}
                            <div className="mt-3 hidden rounded-lg border border-gray-200 bg-white p-3 shadow-sm lg:block">
                                <div className="flex items-start gap-2">
                                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-red-50">
                                        <MapPin className="h-3.5 w-3.5 text-[#b91c1c]" />
                                    </div>

                                    <div>
                                        <p className="text-[11px] font-bold uppercase tracking-wide text-gray-400">
                                            Location
                                        </p>

                                        <p className="mt-0.5 text-[11px] font-semibold text-gray-900">
                                            Court Avenue
                                        </p>

                                        <p className="text-[11px] text-gray-500">
                                            Pickleball Courts
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Court schedules */}
                        <main className="min-w-0">
                            {selectedDates.length === 0 ? (
                                <div className="flex min-h-[360px] items-center justify-center rounded-lg border border-dashed border-red-200 bg-white px-4 text-center shadow-sm">
                                    <div className="max-w-xs">
                                        <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-red-50">
                                            <CalendarDays className="h-5 w-5 text-[#b91c1c]" />
                                        </div>

                                        <p className="mt-3 text-md font-bold text-gray-900">
                                            Select a date to begin
                                        </p>

                                        <p className="mt-1 text-[13px] leading-relaxed text-gray-700">
                                            Choose a date from the calendar to
                                            see the available courts and time
                                            slots.
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="w-full max-w-full overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
                                    {/* ONE scroll area for ALL dates */}
                                    {selectedDates.length > 1 && (
                                        <div className="flex items-start gap-2 border-b border-red-100 bg-red-50 px-4 py-3">
                                            <Info className="mt-0.5 h-4 w-4 shrink-0 text-[#b91c1c]" />

                                            <p className="text-xs leading-relaxed text-gray-700 sm:text-sm">
                                                You have selected{" "}
                                                <span className="font-semibold text-[#b91c1c]">
                                                    {selectedDates.length} dates
                                                </span>
                                                . Scroll down to view each
                                                date's court schedule and select
                                                your preferred time slots.
                                            </p>
                                        </div>
                                    )}

                                    <div className="max-h-[620px] overflow-y-auto">
                                        {selectedDates.map((date) => (
                                            <CourtSchedule
                                                key={date}
                                                date={date}
                                                courts={courts}
                                                timeSlots={timeSlots}
                                                selections={selections}
                                                onToggleSlot={toggleSlot}
                                                getSlotStatus={getSlotStatus}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </main>

                        {/* Summary */}
                        <aside className="min-w-0 lg:sticky lg:top-4 ">
                            <BookingSummary
                                selections={selections}
                                courts={courts}
                                timeSlots={timeSlots}
                                subtotal={subtotal}
                                serviceFee={serviceFee}
                                total={total}
                            />
                        </aside>
                    </div>
                </div>

                {/* Bottom info */}
                <div className="mx-auto w-full max-w-[1400px] px-3 pb-5 sm:px-4 lg:px-5">
                    <div className="flex flex-col gap-1 border-t border-gray-200 pt-3 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-[12px] text-gray-400">
                            Court Avenue · Play more. Book easier. Stay
                            connected.
                        </p>

                        <p className="text-[9px] text-gray-400">
                            © {new Date().getFullYear()} Court Avenue
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
