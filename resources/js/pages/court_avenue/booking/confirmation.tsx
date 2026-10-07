import { Head, Link, router } from "@inertiajs/react";
import {
    ArrowLeft,
    CalendarDays,
    CheckCircle2,
    Clock,
    Copy,
    CreditCard,
    MapPin,
} from "lucide-react";
import { useState } from "react";

type BookingItem = {
    id: number;
    booking_date: string | null;
    price: number | string;
    court: {
        id: number;
        name: string;
    };
    time_slot: {
        id: number;
        start_time: string;
        end_time: string;
    };
};

type Booking = {
    id: number;
    booking_reference: string;
    subtotal: number | string;
    service_fee: number | string;
    total: number | string;
    status: string;
    payment_status: string;
    payment_method: string | null;
    paid_at: string | null;
    items: BookingItem[];
};

type Props = {
    booking: Booking;
};

const formatCurrency = (value: number | string) => {
    return Number(value).toLocaleString("en-PH", {
        style: "currency",
        currency: "PHP",
        minimumFractionDigits: 2,
    });
};

const formatDate = (date: string | null | undefined) => {
    if (!date) return "—";

    const value = String(date).trim();

    const normalizedDate = /^\d{4}-\d{2}-\d{2}$/.test(value)
        ? `${value}T00:00:00`
        : value;

    const parsedDate = new Date(normalizedDate);

    if (Number.isNaN(parsedDate.getTime())) {
        return value;
    }

    return new Intl.DateTimeFormat("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
    }).format(parsedDate);
};

const formatTime = (time: string | null | undefined) => {
    if (!time) return "—";

    const value = String(time).trim();
    const [hours, minutes] = value.split(":").map(Number);

    if (
        Number.isNaN(hours) ||
        Number.isNaN(minutes) ||
        hours < 0 ||
        hours > 23 ||
        minutes < 0 ||
        minutes > 59
    ) {
        return value;
    }

    const date = new Date();
    date.setHours(hours, minutes, 0, 0);

    return new Intl.DateTimeFormat("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    }).format(date);
};

export default function Confirmation({ booking }: Props) {
    const [copied, setCopied] = useState(false);

    const copyBookingReference = async () => {
        await navigator.clipboard.writeText(booking.booking_reference);

        setCopied(true);

        setTimeout(() => {
            setCopied(false);
        }, 2000);
    };

    return (
        <>
            <Head title="Booking Confirmed | Court Avenue" />

            <div className="min-h-screen bg-gray-50">
                {/* Header */}
                <header className="border-b border-red-100 bg-white">
                    <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
                        <Link href="/" className="flex items-center">
                            <img
                                src="/header.png"
                                alt="Court Avenue"
                                className="h-8 w-auto"
                            />
                        </Link>

                        <Link
                            href="/"
                            className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 transition hover:text-[#b91c1c]"
                        >
                            <ArrowLeft className="h-3.5 w-3.5" />
                            Back to Home
                        </Link>
                    </div>
                </header>

                <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
                    {/* Success */}
                    <div className="mb-6 rounded-xl border border-green-200 bg-white p-6 text-center shadow-sm">
                        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                            <CheckCircle2 className="h-7 w-7 text-green-600" />
                        </div>

                        <h1 className="text-xl font-extrabold text-gray-900 sm:text-2xl">
                            Booking Confirmed!
                        </h1>

                        <p className="mt-1 text-xs text-gray-500 sm:text-sm">
                            Your pickleball court reservation has been
                            successfully confirmed.
                        </p>

                        <div className="mt-4">
                            <p className="mb-1.5 text-[9px] font-bold uppercase tracking-[0.16em] text-gray-400">
                                Booking Reference
                            </p>

                            <button
                                type="button"
                                onClick={copyBookingReference}
                                className="group inline-flex items-center gap-2 rounded-md bg-red-50 px-3 py-1.5 transition hover:bg-red-100"
                                title="Copy booking reference"
                            >
                                <span className="text-xs font-bold tracking-wide text-[#b91c1c]">
                                    {booking.booking_reference}
                                </span>

                                {copied ? (
                                    <CheckCircle2 className="h-3 w-3 text-green-600" />
                                ) : (
                                    <Copy className="h-3 w-3 text-[#b91c1c] transition group-hover:scale-110" />
                                )}
                            </button>

                            <p
                                className={`mt-1.5 text-[9px] ${
                                    copied ? "text-green-600" : "text-gray-400"
                                }`}
                            >
                                {copied
                                    ? "Booking reference copied!"
                                    : "Click the reference number to copy it."}
                            </p>
                        </div>
                    </div>

                    <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
                        {/* Reservations */}
                        <section className="rounded-xl border border-gray-200 bg-white shadow-sm">
                            <div className="border-b border-gray-100 px-5 py-4">
                                <h2 className="text-sm font-bold text-gray-900">
                                    Reserved Courts
                                </h2>
                                <p className="mt-0.5 text-[11px] text-gray-500">
                                    Your confirmed court schedules
                                </p>
                            </div>

                            <div className="divide-y divide-gray-100">
                                {booking.items.map((item) => (
                                    <div key={item.id} className="p-5">
                                        <div className="flex items-start justify-between gap-4">
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-red-50">
                                                        <MapPin className="h-4 w-4 text-[#b91c1c]" />
                                                    </div>

                                                    <div>
                                                        <h3 className="text-sm font-bold text-gray-900">
                                                            {item.court.name}
                                                        </h3>

                                                        <p className="text-[10px] text-gray-500">
                                                            Pickleball Court
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            <span className="text-sm font-bold text-gray-900">
                                                {formatCurrency(item.price)}
                                            </span>
                                        </div>

                                        <div className="mt-4 grid gap-2 sm:grid-cols-2">
                                            <div className="flex items-center gap-2 rounded-md bg-gray-50 px-3 py-2">
                                                <CalendarDays className="h-3.5 w-3.5 text-[#b91c1c]" />

                                                <div>
                                                    <p className="text-[9px] font-semibold uppercase tracking-wide text-gray-400">
                                                        Date
                                                    </p>
                                                    <p className="text-xs font-semibold text-gray-700">
                                                        {formatDate(
                                                            item.booking_date,
                                                        )}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2 rounded-md bg-gray-50 px-3 py-2">
                                                <Clock className="h-3.5 w-3.5 text-[#b91c1c]" />

                                                <div>
                                                    <p className="text-[9px] font-semibold uppercase tracking-wide text-gray-400">
                                                        Time
                                                    </p>
                                                    <p className="text-xs font-semibold text-gray-700">
                                                        {formatTime(
                                                            item.time_slot
                                                                .start_time,
                                                        )}{" "}
                                                        –{" "}
                                                        {formatTime(
                                                            item.time_slot
                                                                .end_time,
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Summary */}
                        <aside className="h-fit rounded-xl border border-gray-200 bg-white shadow-sm">
                            <div className="border-b border-gray-100 px-5 py-4">
                                <h2 className="text-sm font-bold text-gray-900">
                                    Payment Summary
                                </h2>
                            </div>

                            <div className="space-y-3 p-5">
                                <div className="flex justify-between text-xs">
                                    <span className="text-gray-500">
                                        Subtotal
                                    </span>
                                    <span className="font-semibold text-gray-800">
                                        {formatCurrency(booking.subtotal)}
                                    </span>
                                </div>

                                <div className="flex justify-between text-xs">
                                    <span className="text-gray-500">
                                        Service Fee
                                    </span>
                                    <span className="font-semibold text-gray-800">
                                        {formatCurrency(booking.service_fee)}
                                    </span>
                                </div>

                                <div className="border-t border-gray-100 pt-3">
                                    <div className="flex justify-between">
                                        <span className="text-sm font-bold text-gray-900">
                                            Total
                                        </span>
                                        <span className="text-base font-extrabold text-[#b91c1c]">
                                            {formatCurrency(booking.total)}
                                        </span>
                                    </div>
                                </div>

                                <div className="mt-4 rounded-lg bg-green-50 p-3">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2 className="h-4 w-4 text-green-600" />

                                        <span className="text-xs font-bold text-green-700">
                                            Payment{" "}
                                            {booking.payment_status.toUpperCase()}
                                        </span>
                                    </div>

                                    <div className="mt-2 flex items-center gap-2 text-[10px] text-green-700">
                                        <CreditCard className="h-3.5 w-3.5" />

                                        {booking.payment_method ??
                                            "Online Payment"}
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => {
                                        router.visit("/booking", {
                                            replace: true,
                                            preserveScroll: false,
                                        });
                                    }}
                                    className="inline-flex h-9 items-center justify-center rounded-md bg-[#b91c1c] px-4 text-xs font-semibold text-white transition hover:bg-red-800"
                                >
                                    Book Another Court
                                </button>
                            </div>
                        </aside>
                    </div>
                </main>
            </div>
        </>
    );
}
