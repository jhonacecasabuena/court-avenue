import { Head, Link, router } from "@inertiajs/react";
import { useState } from "react";
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
    payment_status:
        | "pending"
        | "awaiting_confirmation"
        | "paid"
        | "expired"
        | "rejected";
    payment_proof: string | null;
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
        label: "Cancelled for non-payment",
        icon: XCircle,
        className: "bg-red-50 text-red-700",
    };
};

const getPaymentStatus = (booking: Booking) => {
    if (booking.payment_status === "paid") {
        return {
            label: "Confirmed",
            icon: CheckCircle2,
            className: "bg-green-50 text-green-700",
        };
    }

    if (booking.payment_status === "awaiting_confirmation") {
        return {
            label: "Awaiting Confirmation",
            icon: Clock3,
            className: "bg-yellow-50 text-yellow-700",
        };
    }

    if (booking.payment_status === "pending") {
        return {
            label: "Payment Pending",
            icon: Clock3,
            className: "bg-yellow-50 text-yellow-700",
        };
    }

    if (booking.payment_status === "rejected") {
        return {
            label: "Payment Rejected",
            icon: XCircle,
            className: "bg-red-50 text-red-700",
        };
    }

    return {
        label: "Expired",
        icon: XCircle,
        className: "bg-red-50 text-red-700",
    };
};

export default function MyBookings({ bookings }: Props) {
    const [selectedProof, setSelectedProof] = useState<string | null>(null);
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(
        null,
    );
    const [paymentProof, setPaymentProof] = useState<File | null>(null);
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

                                                    <p className="mt-1 text-xs text-neutral-800">
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

                                                                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-neutral-900">
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
                                                            </p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Payment details */}
                                            <div className="border-t border-neutral-100 bg-neutral-50/70 px-5 py-4 sm:px-6">
                                                <div className="grid gap-3 text-xs sm:grid-cols-4">
                                                    {/* Total */}
                                                    <div>
                                                        <p className="text-sm font-medium text-neutral-600">
                                                            Total
                                                        </p>

                                                        <p className="tracking-wider text-[14px] font-black text-neutral-900">
                                                            {formatCurrency(
                                                                booking.total,
                                                            )}
                                                        </p>
                                                    </div>

                                                    {/* Payment Status */}
                                                    <div>
                                                        <p className="text-xs font-semibold tracking-wide text-neutral-600">
                                                            Payment Status
                                                        </p>

                                                        <div
                                                            className={`mt-1 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ${paymentStatus.className}`}
                                                        >
                                                            <PaymentStatusIcon
                                                                size={13}
                                                            />
                                                            {
                                                                paymentStatus.label
                                                            }
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Payment Proof */}
                                                {booking.payment_proof && (
                                                    <div className="mt-3 border-t border-neutral-200 pt-3">
                                                        <div className="flex items-center justify-between gap-2">
                                                            <div className="flex items-center gap-2">
                                                                <Receipt
                                                                    size={14}
                                                                    className="text-[#b0002a]"
                                                                />

                                                                <p className="text-xs font-semibold text-neutral-700">
                                                                    Payment
                                                                    Proof
                                                                </p>

                                                                <span className="rounded-full bg-green-50 px-2 py-0.5 text-[9px] font-bold uppercase text-green-700 ring-1 ring-inset ring-green-200">
                                                                    Uploaded
                                                                </span>
                                                            </div>

                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    setSelectedProof(
                                                                        `/storage/${booking.payment_proof}`,
                                                                    )
                                                                }
                                                                className="rounded-md border border-neutral-200 bg-white px-3 py-1.5 text-[10px] font-bold text-neutral-700 transition hover:border-[#b0002a] hover:text-[#b0002a]"
                                                            >
                                                                View Proof
                                                            </button>
                                                        </div>

                                                        {booking.payment_status ===
                                                            "awaiting_confirmation" && (
                                                            <div className="mt-2 flex items-center gap-2 rounded-md bg-blue-50 px-3 py-2">
                                                                <Clock3
                                                                    size={13}
                                                                    className="shrink-0 text-blue-600"
                                                                />

                                                                <p className="text-[10px] text-blue-700">
                                                                    <span className="font-bold">
                                                                        Awaiting
                                                                        Confirmation
                                                                    </span>{" "}
                                                                    — Your
                                                                    payment is
                                                                    being
                                                                    verified.
                                                                </p>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}

                                                {/* Upload Payment Proof */}
                                                {booking.status === "pending" &&
                                                    !booking.payment_proof && (
                                                        <div className="mt-4 border-t border-neutral-200 pt-4">
                                                            <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-3">
                                                                <div className="flex items-start gap-2">
                                                                    <Clock3 className="mt-0.5 h-4 w-4 shrink-0 text-yellow-600" />

                                                                    <div>
                                                                        <p className="text-xs font-bold text-yellow-800">
                                                                            Payment
                                                                            proof
                                                                            required
                                                                        </p>

                                                                        <p className="mt-0.5 text-[11px] leading-relaxed text-yellow-700">
                                                                            Upload
                                                                            your
                                                                            payment
                                                                            receipt
                                                                            to
                                                                            submit
                                                                            this
                                                                            booking
                                                                            for
                                                                            confirmation.
                                                                        </p>
                                                                    </div>
                                                                </div>

                                                                <button
                                                                    type="button"
                                                                    onClick={() => {
                                                                        setSelectedBooking(
                                                                            booking,
                                                                        );
                                                                        setPaymentProof(
                                                                            null,
                                                                        );
                                                                    }}
                                                                    className="mt-3 flex w-full items-center justify-center gap-2 rounded-md bg-[#b91c1c] px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-[#991b1b]"
                                                                >
                                                                    <Receipt
                                                                        size={
                                                                            14
                                                                        }
                                                                    />
                                                                    Upload
                                                                    Payment
                                                                    Proof
                                                                </button>
                                                            </div>
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

            {/* Upload Payment Proof Modal */}
            {selectedBooking && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
                    onClick={() => {
                        setSelectedBooking(null);
                        setPaymentProof(null);
                    }}
                >
                    <div
                        className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl"
                        onClick={(event) => event.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="flex items-center justify-between border-b border-neutral-200 px-5 py-4">
                            <div>
                                <h3 className="text-sm font-bold text-neutral-900">
                                    Upload Payment Proof
                                </h3>

                                <p className="mt-0.5 text-[11px] text-neutral-500">
                                    {selectedBooking.booking_reference}
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() => {
                                    setSelectedBooking(null);
                                    setPaymentProof(null);
                                }}
                                className="flex h-8 w-8 items-center justify-center rounded-full text-xl text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-900"
                                aria-label="Close upload payment proof"
                            >
                                ×
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="space-y-4 p-5">
                            <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-3">
                                <div className="flex items-start gap-2">
                                    <Clock3 className="mt-0.5 h-4 w-4 shrink-0 text-yellow-600" />

                                    <div>
                                        <p className="text-xs font-bold text-yellow-800">
                                            Payment proof required
                                        </p>

                                        <p className="mt-0.5 text-[11px] leading-relaxed text-yellow-700">
                                            Upload your payment receipt for this
                                            booking.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Booking Reference */}
                            <div>
                                <p className="text-xs font-semibold text-neutral-600">
                                    Booking Reference
                                </p>

                                <p className="mt-1 text-sm font-bold tracking-wide text-neutral-900">
                                    {selectedBooking.booking_reference}
                                </p>
                            </div>

                            {/* Total */}
                            <div>
                                <p className="text-xs font-semibold text-neutral-600">
                                    Total Amount
                                </p>

                                <p className="mt-1 text-lg font-black text-[#b0002a]">
                                    {formatCurrency(selectedBooking.total)}
                                </p>
                            </div>

                            {/* File Upload */}
                            <div>
                                <label
                                    htmlFor="payment-proof"
                                    className="text-xs font-semibold text-neutral-700"
                                >
                                    Payment Receipt
                                </label>

                                <input
                                    id="payment-proof"
                                    type="file"
                                    accept="image/*"
                                    onChange={(event) => {
                                        setPaymentProof(
                                            event.target.files?.[0] ?? null,
                                        );
                                    }}
                                    className="mt-2 block w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-xs text-neutral-700 file:mr-3 file:rounded-md file:border-0 file:bg-[#b0002a] file:px-3 file:py-1.5 file:text-xs file:font-bold file:text-white hover:file:bg-[#920024]"
                                />

                                {paymentProof && (
                                    <p className="mt-2 text-[11px] text-neutral-500">
                                        Selected: {paymentProof.name}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="flex justify-end gap-2 border-t border-neutral-200 px-5 py-4">
                            <button
                                type="button"
                                onClick={() => {
                                    setSelectedBooking(null);
                                    setPaymentProof(null);
                                }}
                                className="rounded-lg border border-neutral-200 bg-white px-4 py-2 text-xs font-bold text-neutral-700 transition hover:bg-neutral-50"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                disabled={!paymentProof}
                                onClick={() => {
                                    if (!paymentProof || !selectedBooking)
                                        return;

                                    router.post(
                                        "/booking/my-bookings/payment-proof",
                                        {
                                            booking_id: selectedBooking.id,
                                            payment_proof: paymentProof,
                                        },
                                        {
                                            forceFormData: true,
                                            onSuccess: () => {
                                                setSelectedBooking(null);
                                                setPaymentProof(null);
                                            },
                                        },
                                    );
                                }}
                                className="rounded-lg bg-[#b0002a] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#920024] disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                Upload Payment Proof
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Payment Proof Modal */}
            {selectedProof && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
                    onClick={() => setSelectedProof(null)}
                >
                    <div
                        className="relative w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl"
                        onClick={(event) => event.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="flex items-center justify-between border-b border-neutral-200 px-4 py-3 sm:px-5">
                            <div>
                                <h3 className="text-sm font-bold text-neutral-900">
                                    Payment Proof
                                </h3>

                                <p className="mt-0.5 text-[11px] text-neutral-500">
                                    Uploaded payment receipt
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() => setSelectedProof(null)}
                                className="flex h-8 w-8 items-center justify-center rounded-full text-xl text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-900"
                                aria-label="Close payment proof"
                            >
                                ×
                            </button>
                        </div>

                        {/* Image */}
                        <div className="flex max-h-[75vh] items-center justify-center overflow-auto bg-neutral-100 p-3 sm:p-5">
                            <img
                                src={selectedProof}
                                alt="Payment proof"
                                className="max-h-[70vh] max-w-full rounded-lg object-contain"
                            />
                        </div>

                        {/* Modal Footer */}
                        <div className="flex justify-end border-t border-neutral-200 px-4 py-3 sm:px-5">
                            <button
                                type="button"
                                onClick={() => setSelectedProof(null)}
                                className="rounded-lg bg-[#b0002a] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#920024]"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
