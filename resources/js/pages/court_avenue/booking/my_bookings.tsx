import { Head, Link, router } from "@inertiajs/react";
import {
    ArrowLeft,
    CalendarDays,
    CheckCircle2,
    Clock3,
    CreditCard,
    MapPin,
    Receipt,
    XCircle,
} from "lucide-react";

type Court = {
    id: number;
    name: string;
};

type TimeSlot = {
    id: number;
    start_time: string;
    end_time: string;
};

type BookingItem = {
    id: number;
    booking_date: string;
    price: number | string;
    court: Court;
    time_slot: TimeSlot;
};

type Booking = {
    id: number;
    booking_reference: string;
    subtotal: number | string;
    service_fee: number | string;
    total: number | string;
    status: "pending" | "confirmed" | "cancelled";
    payment_status: "pending" | "paid" | "expired";
    payment_method: string | null;
    payment_reference: string | null;
    paid_at: string | null;
    expires_at: string | null;
    created_at: string;
    items: BookingItem[];
};

type Props = {
    bookings: Booking[];
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

const formatDateTime = (date: string | null | undefined) => {
    if (!date) return "—";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
        return date;
    }

    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
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

const formatCurrency = (value: number | string) => {
    return `₱${Number(value).toLocaleString("en-PH", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`;
};

const getStatus = (booking: Booking) => {
    if (booking.status === "confirmed") {
        return {
            label: "Booked",
            icon: CheckCircle2,
            className: "bg-green-50 text-green-700",
        };
    }

    if (booking.status === "pending") {
        return {
            label: "Pending",
            icon: Clock3,
            className: "bg-yellow-50 text-yellow-700",
        };
    }

    return {
        label: "Cancelled",
        icon: XCircle,
        className: "bg-red-50 text-red-700",
    };
};

const getPaymentStatus = (booking: Booking) => {
    if (booking.payment_status === "paid") {
        return {
            label: "PAID",
            icon: CheckCircle2,
            className: "bg-green-50 text-green-700",
        };
    }

    if (booking.payment_status === "pending") {
        return {
            label: "Pending",
            icon: Clock3,
            className: "bg-yellow-50 text-yellow-700",
        };
    }

    return {
        label: "Expired",
        icon: XCircle,
        className: "bg-red-50 text-red-700",
    };
};

export default function MyBookings({ bookings }: Props) {
    return (
        <>
            <Head title="My Bookings | Court Avenue" />

            <div className="min-h-screen bg-neutral-50">
                {/* Header */}
                <header className="border-b border-neutral-200 bg-white">
                    <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
                        <Link
                            href="/"
                            className="flex items-center gap-3 text-sm font-semibold text-neutral-700 transition hover:text-[#b0002a]"
                        >
                            <ArrowLeft size={18} />
                            Back to Court Avenue
                        </Link>

                        <Link
                            href="/booking"
                            className="inline-flex items-center gap-2 rounded-full bg-[#b0002a] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#920024]"
                        >
                            <CalendarDays size={16} />
                            Book a Court
                        </Link>
                    </div>
                </header>

                {/* Main */}
                <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
                    {/* Page heading */}
                    <div className="mb-4 sm:mb-6">
                        <h3 className="text-xl font-black tracking-tight text-neutral-900 sm:text-2xl">
                            My Bookings
                        </h3>

                        <p className="mt-2 text-sm text-neutral-500">
                            View your court reservations and payment
                            transactions.
                        </p>
                    </div>

                    {bookings.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-neutral-300 bg-white px-6 py-16 text-center">
                            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-[#b0002a]">
                                <CalendarDays size={25} />
                            </div>

                            <h2 className="mt-5 text-lg font-bold text-neutral-900">
                                No bookings yet
                            </h2>

                            <p className="mx-auto mt-2 max-w-md text-sm text-neutral-500">
                                You don't have any court reservations yet. Find
                                an available court and make your first booking.
                            </p>

                            <Link
                                href="/booking"
                                className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#b0002a] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#920024]"
                            >
                                <CalendarDays size={17} />
                                Book a Court
                            </Link>
                        </div>
                    ) : (
                        <div className="max-h-[calc(100vh-230px)] overflow-y-auto pr-2">
                            <div className="space-y-5">
                                {bookings.map((booking) => {
                                    const status = getStatus(booking);
                                    const StatusIcon = status.icon;

                                    const paymentStatus =
                                        getPaymentStatus(booking);
                                    const PaymentStatusIcon =
                                        paymentStatus.icon;
                                    return (
                                        <div
                                            key={booking.id}
                                            className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm"
                                        >
                                            {/* Booking header */}
                                            <div className="flex flex-col gap-4 border-b border-neutral-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                                                <div>
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <Receipt
                                                            size={17}
                                                            className="text-[#b0002a]"
                                                        />

                                                        <span className="text-sm tracking-wider font-bold text-neutral-900">
                                                            {
                                                                booking.booking_reference
                                                            }
                                                        </span>

                                                        <span
                                                            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] uppercase font-bold ${status.className}`}
                                                        >
                                                            <StatusIcon
                                                                size={13}
                                                            />
                                                            {status.label}
                                                        </span>
                                                    </div>

                                                    <p className="mt-1 text-xs text-neutral-500">
                                                        Booked on{" "}
                                                        {formatDateTime(
                                                            booking.created_at,
                                                        )}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Booking items */}
                                            <div className="divide-y divide-neutral-100">
                                                {booking.items.map((item) => (
                                                    <div
                                                        key={item.id}
                                                        className="px-5 py-4 sm:px-6"
                                                    >
                                                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                                            <div>
                                                                <div className="flex items-center gap-2">
                                                                    <MapPin
                                                                        size={
                                                                            16
                                                                        }
                                                                        className="text-[#b0002a]"
                                                                    />

                                                                    <p className="text-sm font-bold text-neutral-900">
                                                                        {
                                                                            item
                                                                                .court
                                                                                .name
                                                                        }
                                                                    </p>
                                                                </div>

                                                                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-neutral-800">
                                                                    <span className="flex items-center gap-1.5">
                                                                        <CalendarDays
                                                                            size={
                                                                                14
                                                                            }
                                                                        />
                                                                        {formatDate(
                                                                            item.booking_date,
                                                                        )}
                                                                    </span>

                                                                    <span className="flex items-center gap-1.5">
                                                                        <Clock3
                                                                            size={
                                                                                14
                                                                            }
                                                                        />
                                                                        {formatTime(
                                                                            item
                                                                                .time_slot
                                                                                .start_time,
                                                                        )}{" "}
                                                                        –{" "}
                                                                        {formatTime(
                                                                            item
                                                                                .time_slot
                                                                                .end_time,
                                                                        )}
                                                                    </span>
                                                                </div>
                                                            </div>

                                                            <p className="text-sm font-bold text-neutral-800">
                                                                {formatCurrency(
                                                                    item.price,
                                                                )}{" "}
                                                                + service_fee
                                                            </p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Payment details */}
                                            {/* <div className="border-t border-neutral-100 bg-neutral-50/70 px-5 py-4 sm:px-6">
                                                <div className="grid gap-3 text-xs sm:grid-cols-3">
                                                    <div>
                                                        <p className="text-xs font-medium text-neutral-500">
                                                            Total
                                                        </p>

                                                        <p className="text-lg font-black text-neutral-900">
                                                            {formatCurrency(
                                                                booking.total,
                                                            )}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
                                                            Payment Status
                                                        </p>

                                                        <div
                                                            className={`mt-1 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ${
                                                                booking.payment_status ===
                                                                "paid"
                                                                    ? "bg-green-50 text-green-700"
                                                                    : booking.payment_status ===
                                                                        "pending"
                                                                      ? "bg-yellow-50 text-yellow-700"
                                                                      : "bg-red-50 text-red-700"
                                                            }`}
                                                        >
                                                            {booking.payment_status ===
                                                                "paid" && (
                                                                <CheckCircle2
                                                                    size={13}
                                                                />
                                                            )}

                                                            {booking.payment_status ===
                                                                "pending" && (
                                                                <Clock3
                                                                    size={13}
                                                                />
                                                            )}

                                                            {booking.payment_status ===
                                                                "expired" && (
                                                                <XCircle
                                                                    size={13}
                                                                />
                                                            )}

                                                            {booking.payment_status ===
                                                            "paid"
                                                                ? "PAID"
                                                                : booking.payment_status ===
                                                                    "pending"
                                                                  ? "Pending"
                                                                  : "Expired"}
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <p className="text-neutral-500">
                                                            Payment Method
                                                        </p>

                                                        <p className="mt-1 flex items-center gap-1.5 font-bold capitalize text-neutral-800">
                                                            <CreditCard
                                                                size={14}
                                                            />
                                                            {booking.payment_method ??
                                                                "—"}
                                                        </p>
                                                    </div>

                                                    <div>
                                                        <p className="text-neutral-500">
                                                            Payment Reference
                                                        </p>

                                                        <p className="mt-1 break-all font-bold text-neutral-800">
                                                            {booking.payment_reference ??
                                                                "—"}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div> */}
                                            {/* Payment details */}
                                            <div className="border-t border-neutral-100 bg-neutral-50/70 px-5 py-4 sm:px-6">
                                                <div className="grid gap-3 text-xs sm:grid-cols-4">
                                                    {/* Total */}
                                                    <div>
                                                        <p className="text-xs font-medium text-neutral-500">
                                                            Total
                                                        </p>

                                                        <p className="text-lg font-black text-neutral-900">
                                                            {formatCurrency(
                                                                booking.total,
                                                            )}
                                                        </p>
                                                    </div>

                                                    {/* Payment Status */}
                                                    <div>
                                                        <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
                                                            Payment Status
                                                        </p>

                                                        <div
                                                            className={`mt-1 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ${
                                                                booking.payment_status ===
                                                                "paid"
                                                                    ? "bg-green-50 text-green-700"
                                                                    : booking.payment_status ===
                                                                        "pending"
                                                                      ? "bg-yellow-50 text-yellow-700"
                                                                      : "bg-red-50 text-red-700"
                                                            }`}
                                                        >
                                                            {booking.payment_status ===
                                                                "paid" && (
                                                                <CheckCircle2
                                                                    size={13}
                                                                />
                                                            )}

                                                            {booking.payment_status ===
                                                                "pending" && (
                                                                <Clock3
                                                                    size={13}
                                                                />
                                                            )}

                                                            {booking.payment_status ===
                                                                "expired" && (
                                                                <XCircle
                                                                    size={13}
                                                                />
                                                            )}

                                                            {booking.payment_status ===
                                                            "paid"
                                                                ? "PAID"
                                                                : booking.payment_status ===
                                                                    "pending"
                                                                  ? "Pending"
                                                                  : "Expired"}
                                                        </div>
                                                    </div>

                                                    {/* Payment Method */}
                                                    <div>
                                                        <p className="text-neutral-500">
                                                            Payment Method
                                                        </p>

                                                        <p className="mt-1 flex items-center gap-1.5 font-bold capitalize text-neutral-800">
                                                            <CreditCard
                                                                size={14}
                                                            />
                                                            {booking.payment_method ??
                                                                "—"}
                                                        </p>
                                                    </div>

                                                    {/* Payment Reference */}
                                                    <div>
                                                        <p className="text-neutral-500">
                                                            Payment Reference
                                                        </p>

                                                        <p className="mt-1 break-all font-bold text-neutral-800">
                                                            {booking.payment_reference ??
                                                                "—"}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Complete Payment */}
                                                {booking.status === "pending" &&
                                                    booking.payment_status ===
                                                        "pending" && (
                                                        <div className="mt-4 border-t border-neutral-200 pt-4">
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    router.post(
                                                                        "/booking/confirm",
                                                                    );
                                                                }}
                                                                className="mt-5 flex w-full items-center justify-center gap-2 rounded-md bg-[#b91c1c] px-4 py-3 text-xs font-bold text-white shadow-sm transition hover:bg-[#991b1b]"
                                                            >
                                                                <CheckCircle2 className="h-3.5 w-3.5" />
                                                                Confirm Paid
                                                                Booking
                                                            </button>

                                                            <p className="mt-2 text-center text-xs text-neutral-500">
                                                                Complete your
                                                                payment before
                                                                the 8-minute
                                                                reservation
                                                                window expires.
                                                            </p>
                                                        </div>
                                                    )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </>
    );
}
