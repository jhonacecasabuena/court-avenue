import { Head, Link, router, usePage } from "@inertiajs/react";
import { useEffect } from "react";
import {
    ArrowLeft,
    CalendarDays,
    CheckCircle2,
    ClipboardList,
    MapPin,
    ShieldCheck,
} from "lucide-react";

import DateSelector from "@/components/booking_court_avenue/DateSelector";
import CourtSchedule from "@/components/booking_court_avenue/CourtSchedule";
import BookingSummary from "@/components/booking_court_avenue/BookingSummary";
import { useBooking } from "@/hooks/use-booking";
import type { Court, TimeSlot, BookedSlot } from "@/types";

type AuthUser = {
    id: number;
    name: string;
    email: string;
};

type PageProps = {
    auth: {
        user: AuthUser | null;
    };
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
    const { auth } = usePage<PageProps>().props;

    const {
        selectedDates,
        selections,
        toggleDate,
        toggleSlot,
        getSlotStatus,
        subtotal,
        serviceFee,
        total,
    } = useBooking(courts, timeSlots, bookedSlots);

    useEffect(() => {
        const interval = setInterval(() => {
            router.reload({
                only: ["bookedSlots"],
            });
        }, 10000);

        return () => clearInterval(interval);
    }, []);

    return (
        <>
            <Head title="Book a Court | Court Avenue" />

            <div className="min-h-screen bg-gray-50">
                {/* Top Header */}
                <header className="border-b border-red-800 bg-[#b91c1c] text-white">
                    <div className="mx-auto flex h-14 w-full max-w-[1400px] items-center justify-between px-3 sm:px-4 lg:px-5">
                        <div className="flex items-center gap-3">
                            <Link
                                href="/"
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
                                        Book a Court
                                    </h1>
                                </div>
                            </Link>
                        </div>

                        <div className=" items-center sm:flex">
                            {auth.user && (
                                <Link
                                    href="/booking/my-bookings"
                                    className="group relative flex items-center gap-3 rounded-xl border border-transparent px-3 py-2 transition-all duration-200 hover:border-white/20 hover:bg-white/10"
                                >
                                    {/* Icon */}
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-[#b91c1c] shadow-sm transition-all duration-200 group-hover:scale-105 group-hover:bg-red-50 group-hover:shadow-md">
                                        <ClipboardList className="h-4 w-4 transition-transform duration-200 group-hover:-rotate-3" />
                                    </div>

                                    {/* Text */}
                                    <div className="leading-tight">
                                        <p className="text-sm font-bold text-white transition-colors duration-200 group-hover:text-red-50">
                                            My Bookings
                                        </p>

                                        <p className="mt-0.5 text-[11px] font-medium text-red-100 transition-colors duration-200 group-hover:text-white">
                                            View your reservations
                                        </p>
                                    </div>

                                    {/* Hover indicator */}
                                    <span className="absolute bottom-1.5 left-3 right-3 h-0.5 origin-left scale-x-0 rounded-full bg-white transition-transform duration-200 group-hover:scale-x-100" />
                                </Link>
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
