import { Head, usePage, Link, router } from "@inertiajs/react";
import { useState } from "react";
import {
    ArrowLeft,
    CalendarDays,
    CheckCircle2,
    ClipboardList,
    Clock,
    CreditCard,
    LockKeyhole,
    MapPin,
    ReceiptText,
    ShieldCheck,
} from "lucide-react";

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

type BookingSelection = {
    date: string | null;
    court_id: number;
    court_name: string | null;
    court_price: number | string | null;
    time_slot_id: number;
    start_time: string | null;
    end_time: string | null;
};

type Booking = {
    selections: BookingSelection[];
    subtotal: number;
    service_fee: number;
    total: number;
    booking_reference: string;
    created_at: string;
};

type Props = {
    booking: Booking;
};

const formatCurrency = (value: number) => {
    return Number(value).toLocaleString("en-PH", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
};

const formatDate = (date: string | null | undefined) => {
    if (!date) return "—";

    const value = String(date).trim();

    // Laravel may return either YYYY-MM-DD or an ISO datetime.
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

const formatDateTime = (date: string | null | undefined) => {
    if (!date) return "—";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
        return date;
    }

    return new Intl.DateTimeFormat("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    }).format(parsedDate);
};

export default function Checkout({ booking }: Props) {
    const { auth } = usePage<PageProps>().props;

    const [paymentProof, setPaymentProof] = useState<File | null>(null);
    const [paymentProofPreview, setPaymentProofPreview] = useState<
        string | null
    >(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    return (
        <>
            <Head title="Booking Checkout | Court Avenue" />

            <div className="min-h-screen bg-gray-50">
                {/* Header */}
                <header className="border-b border-red-800 bg-[#b91c1c] text-white">
                    <div className="mx-auto flex h-14 w-full max-w-[1200px] items-center justify-between px-4">
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
                                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-red-100">
                                        Court Avenue
                                    </p>

                                    <h1 className="text-sm font-bold leading-tight sm:text-base">
                                        Checkout
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

                <div className="h-1 bg-red-700" />

                {/* Content */}
                <main className="mx-auto w-full max-w-[1200px] px-4 py-5 sm:py-6">
                    {/* Page heading */}
                    <div className="mb-3 sm:mb-5">
                        <h2 className="hidden lg:block text-center text-md font-extrabold text-gray-900 sm:text-left sm:text-xl">
                            Complete your booking
                        </h2>

                        <div className="mt-0 sm:mt-2 flex items-center justify-center sm:justify-start">
                            <div className="rounded-md bg-yellow-50 px-3 py-1.5 text-center text-[11px] font-semibold text-yellow-700 sm:text-left">
                                Please complete payment within 8 minutes.
                                <span className="font-bold">
                                    {" "}
                                    Unpaid bookings will be automatically
                                    cancelled.
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_340px]">
                        {/* Left */}
                        <div className="space-y-4">
                            {/* Booking information */}
                            <section className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
                                <div className="border-b border-gray-200 bg-white px-4 py-4">
                                    <div className="flex items-center justify-between gap-3">
                                        <div className="flex min-w-0 items-start gap-3">
                                            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-red-50 text-[#b91c1c] ring-1 ring-inset ring-red-100">
                                                <CalendarDays className="h-3 w-3" />
                                            </div>

                                            <div className="min-w-0">
                                                <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-700">
                                                    Booking Reference
                                                </p>

                                                <h3
                                                    onClick={() =>
                                                        navigator.clipboard.writeText(
                                                            booking.booking_reference,
                                                        )
                                                    }
                                                    title="Click to copy booking reference"
                                                    className="mt-1 cursor-pointer break-all text-[14px] sm:text-[16px] font-extrabold tracking-wider text-[#b91c1c] transition hover:text-red-800 hover:underline"
                                                >
                                                    {booking.booking_reference}
                                                </h3>
                                            </div>
                                        </div>

                                        <span className="shrink-0 rounded-full bg-yellow-50 px-2.5 py-1 text-[10px] font-bold text-yellow-700 ring-1 ring-inset ring-yellow-200">
                                            Pending
                                        </span>
                                    </div>
                                    <p className="ml-10 mt-1 text-[10px] text-neutral-500">
                                        Booking created:{" "}
                                        <span className="font-medium text-neutral-700">
                                            {formatDateTime(booking.created_at)}
                                        </span>
                                    </p>
                                </div>

                                <div className="max-h-[414px] divide-y divide-gray-100 overflow-y-auto">
                                    {booking.selections.map(
                                        (selection, index) => (
                                            <div
                                                key={`${selection.date}-${selection.time_slot_id}-${selection.court_id}`}
                                                className="flex items-center justify-between gap-4 px-4 py-3"
                                            >
                                                <div className="flex min-w-0 items-center gap-3">
                                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-50 text-[10px] font-bold text-[#b91c1c]">
                                                        {index + 1}
                                                    </div>

                                                    <div className="min-w-0">
                                                        <div className="flex flex-wrap items-center gap-2">
                                                            <div className="font-semibold text-gray-900">
                                                                {
                                                                    selection.court_name
                                                                }
                                                            </div>

                                                            <span className="rounded-full bg-yellow-50 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-yellow-700 ring-1 ring-inset ring-yellow-200">
                                                                Pending Payment
                                                            </span>
                                                        </div>

                                                        <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-sm text-gray-700">
                                                            <span className="flex items-center gap-1">
                                                                <CalendarDays className="h-3 w-3 text-[#b91c1c]" />
                                                                {formatDate(
                                                                    selection.date,
                                                                )}
                                                            </span>

                                                            <div className="flex items-center gap-1.5">
                                                                <Clock className="h-4 w-4 text-[#b91c1c]" />
                                                                <span>
                                                                    {formatTime(
                                                                        selection.start_time,
                                                                    )}
                                                                    {" – "}
                                                                    {formatTime(
                                                                        selection.end_time,
                                                                    )}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <CheckCircle2 className="h-4 w-4 shrink-0 text-green-600" />
                                            </div>
                                        ),
                                    )}
                                </div>
                            </section>
                        </div>

                        {/* Right: Compact Payment + Order Summary */}
                        <aside className="flex h-fit flex-col gap-3 lg:sticky lg:top-4">
                            {/* Payment */}
                            <section className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
                                <div className="p-3">
                                    {/* Upload proof */}
                                    <div className="rounded-lg border border-red-200 bg-red-50/50 p-2.5">
                                        <div className="flex items-center gap-2">
                                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-white">
                                                <ReceiptText className="h-4 w-4 text-[#b91c1c]" />
                                            </div>

                                            <div className="min-w-0 flex-1">
                                                <p className="text-[12px] font-bold text-gray-900">
                                                    Upload Proof of Payment
                                                </p>
                                                <p className="text-[11px] text-gray-700">
                                                    PNG, JPG or JPEG
                                                </p>
                                            </div>

                                            {paymentProof && (
                                                <CheckCircle2 className="h-4 w-4 shrink-0 text-green-600" />
                                            )}
                                        </div>

                                        <label
                                            htmlFor="payment_proof"
                                            className={`mt-2 block cursor-pointer rounded-md border border-dashed p-2 transition ${
                                                paymentProof
                                                    ? "border-green-300 bg-green-50"
                                                    : "border-gray-300 bg-white hover:border-[#b91c1c] hover:bg-red-50"
                                            }`}
                                        >
                                            {paymentProofPreview ? (
                                                <div className="flex items-center gap-3">
                                                    <img
                                                        src={
                                                            paymentProofPreview
                                                        }
                                                        alt="Payment proof preview"
                                                        className="h-16 w-16 shrink-0 rounded-md border border-gray-200 bg-white object-cover"
                                                    />

                                                    <div className="min-w-0 flex-1">
                                                        <p className="text-[10px] font-bold text-green-700">
                                                            Proof selected
                                                        </p>
                                                        <p className="mt-0.5 truncate text-[10px] text-gray-600">
                                                            {paymentProof
                                                                ? paymentProof.name
                                                                : "PNG, JPG or JPEG"}
                                                        </p>
                                                        <p className="mt-1 text-[10px] font-semibold text-[#b91c1c]">
                                                            Click to change
                                                        </p>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-3 px-1 py-2">
                                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-red-50">
                                                        <ReceiptText className="h-4 w-4 text-[#b91c1c]" />
                                                    </div>

                                                    <div className="min-w-0">
                                                        <p className="text-[12px] font-semibold text-gray-800">
                                                            Choose payment
                                                            screenshot
                                                        </p>
                                                        <p className="mt-0.5 text-[11px] text-gray-700">
                                                            Click here to browse
                                                            files
                                                        </p>
                                                    </div>
                                                </div>
                                            )}

                                            <input
                                                id="payment_proof"
                                                type="file"
                                                accept="image/png,image/jpeg,image/jpg"
                                                className="hidden"
                                                required
                                                onChange={(event) => {
                                                    const file =
                                                        event.target
                                                            .files?.[0] ?? null;

                                                    setPaymentProof(file);

                                                    if (file) {
                                                        setPaymentProofPreview(
                                                            URL.createObjectURL(
                                                                file,
                                                            ),
                                                        );
                                                    } else {
                                                        setPaymentProofPreview(
                                                            null,
                                                        );
                                                    }
                                                }}
                                            />
                                        </label>
                                    </div>

                                    {/* Compact verification notice */}
                                </div>
                            </section>

                            {/* Order Summary */}
                            <section className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
                                <div className="flex items-center gap-2 border-b border-red-100 bg-red-50 px-3 py-2.5">
                                    <ReceiptText className="h-4 w-4 text-[#b91c1c]" />
                                    <h3 className="text-xs font-bold text-gray-900">
                                        Order Summary
                                    </h3>
                                </div>

                                <div className="p-3">
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-gray-700">
                                            Court slots
                                        </span>
                                        <span className="font-semibold text-gray-900">
                                            {booking.selections.length}
                                        </span>
                                    </div>

                                    <div className="mt-3 space-y-2 text-xs">
                                        <div className="flex items-center justify-between border-t border-dashed border-gray-200 pt-2">
                                            <span className="font-semibold text-gray-700">
                                                Subtotal (
                                                {booking.selections.length} x P
                                                350.00)
                                            </span>
                                            <span className="font-bold text-gray-900">
                                                ₱
                                                {formatCurrency(
                                                    booking.subtotal,
                                                )}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="my-3 border-t border-dashed border-gray-200" />

                                    <div className="flex items-center justify-between gap-2">
                                        <div>
                                            <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                                                Total
                                            </p>
                                            <p className="text-xs font-medium text-gray-700">
                                                Due today
                                            </p>
                                        </div>

                                        <span className="text-xl font-extrabold text-[#b91c1c]">
                                            ₱{formatCurrency(booking.total)}
                                        </span>
                                    </div>

                                    <button
                                        type="button"
                                        disabled={!paymentProof || isSubmitting}
                                        onClick={() => {
                                            if (!paymentProof) return;

                                            setIsSubmitting(true);

                                            const formData = new FormData();
                                            formData.append(
                                                "payment_proof",
                                                paymentProof,
                                            );

                                            router.post(
                                                "/booking/confirm",
                                                formData,
                                                {
                                                    forceFormData: true,
                                                    onFinish: () => {
                                                        setIsSubmitting(false);
                                                    },
                                                },
                                            );
                                        }}
                                        className={`mt-3 flex w-full items-center justify-center gap-2 rounded-md px-3 py-2.5 text-xs font-bold transition ${
                                            !paymentProof || isSubmitting
                                                ? "cursor-not-allowed bg-gray-300 text-gray-500"
                                                : "bg-[#b91c1c] text-white hover:bg-[#991b1b]"
                                        }`}
                                    >
                                        <CheckCircle2 className="h-3.5 w-3.5" />
                                        {isSubmitting
                                            ? "Submitting..."
                                            : paymentProof
                                              ? "Submit Booking & Proof"
                                              : "Upload Proof to Continue"}
                                    </button>
                                    <div className="mt-2 flex items-start gap-1.5 rounded-md bg-gray-50 p-2">
                                        <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-green-600" />
                                        <p className="text-[10px] leading-relaxed text-gray-600">
                                            Your booking remains{" "}
                                            <span className="font-semibold text-yellow-700">
                                                Pending
                                            </span>{" "}
                                            until Court Avenue verifies your
                                            payment.
                                        </p>
                                    </div>
                                    <p className="mt-2 text-center text-[10px] leading-relaxed text-gray-500">
                                        By continuing, you agree to the Court
                                        Avenue booking{" "}
                                        <span className="text-red-600 underline">
                                            terms and conditions
                                        </span>
                                        .
                                    </p>
                                </div>
                            </section>
                        </aside>
                    </div>
                </main>
            </div>
        </>
    );
}
