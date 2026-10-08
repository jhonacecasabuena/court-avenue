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
                        <h2 className="text-center text-md font-extrabold text-gray-900 sm:text-left sm:text-2xl">
                            Complete your booking
                        </h2>

                        <div className="mt-2 flex items-center justify-center sm:justify-start">
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
                                <div className="border-b border-red-100 bg-red-50 px-4 py-3">
                                    <div className="flex items-center gap-2">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[#b91c1c] text-white">
                                            <CalendarDays className="h-4 w-4" />
                                        </div>

                                        <div>
                                            <div className="flex justify-between gap-2">
                                                <h3 className="text-sm font-bold text-gray-900 sm:text-sm">
                                                    Your Reservation
                                                </h3>
                                            </div>

                                            <p className="text-[11px] text-gray-700">
                                                Selected court schedules
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="max-h-[360px] overflow-y-auto divide-y divide-gray-100">
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
                                                        <div className="flex items-center gap-2">
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

                                                            <div className="flex items-center gap-1.5 text-sm text-gray-700">
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

                            {/* Payment */}
                            <section className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
                                <div className="border-b border-gray-100 px-4 py-3">
                                    <div className="flex items-center gap-2">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-red-50">
                                            <CreditCard className="h-4 w-4 text-[#b91c1c]" />
                                        </div>

                                        <div>
                                            <h3 className="text-[12px] font-bold text-gray-900 sm:text-sm">
                                                Payment
                                            </h3>

                                            <p className="text-[12px] text-gray-700">
                                                Choose your payment method
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-3 sm:p-4">
                                    {/* Current payment method */}
                                    <div className="rounded-lg border-2 border-[#b91c1c] bg-red-50 p-2.5 sm:p-3">
                                        <div className="flex items-center gap-2.5 sm:gap-3">
                                            {/* Icon */}
                                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-white sm:h-9 sm:w-9">
                                                <ReceiptText className="h-3.5 w-3.5 text-[#b91c1c] sm:h-4 sm:w-4" />
                                            </div>

                                            {/* Text */}
                                            <div className="min-w-0 flex-1">
                                                <p className="text-[11px] font-bold text-gray-900 sm:text-sm">
                                                    Upload Proof of Payment
                                                </p>

                                                <p className="mt-0.5 text-[9px] leading-tight text-gray-700 sm:text-[11px]">
                                                    Upload a screenshot or photo
                                                    of your payment receipt.
                                                </p>
                                            </div>

                                            {/* Selected indicator */}
                                            <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 border-[#b91c1c]">
                                                <div className="h-2 w-2 rounded-full bg-[#b91c1c]" />
                                            </div>
                                        </div>

                                        {/* Upload area */}
                                        <label
                                            htmlFor="payment_proof"
                                            className={`mt-2.5 block cursor-pointer rounded-lg border border-dashed p-2.5 transition sm:mt-3 sm:p-3 ${
                                                paymentProof
                                                    ? "border-green-300 bg-green-50"
                                                    : "border-red-300 bg-white hover:border-[#b91c1c] hover:bg-red-50"
                                            }`}
                                        >
                                            {paymentProofPreview ? (
                                                <div className="space-y-2.5 sm:space-y-3">
                                                    {/* Image preview */}
                                                    <div className="flex items-center justify-center overflow-hidden rounded-md border border-gray-200 bg-gray-100">
                                                        <img
                                                            src={
                                                                paymentProofPreview
                                                            }
                                                            alt="Payment proof preview"
                                                            className="h-[140px] w-full object-contain sm:h-[220px] md:h-[260px]"
                                                        />
                                                    </div>

                                                    {/* Selected file information */}
                                                    <div className="flex items-center justify-between gap-2">
                                                        <div className="flex min-w-0 items-center gap-2">
                                                            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-green-100 sm:h-8 sm:w-8">
                                                                <CheckCircle2 className="h-3.5 w-3.5 text-green-600 sm:h-4 sm:w-4" />
                                                            </div>

                                                            <div className="min-w-0">
                                                                <p className="text-[9px] font-bold text-gray-800 sm:text-[10px]">
                                                                    Payment
                                                                    proof
                                                                    selected
                                                                </p>

                                                                <p className="max-w-[160px] truncate text-[8px] text-gray-500 sm:max-w-[250px] sm:text-[9px]">
                                                                    {paymentProof
                                                                        ? paymentProof.name
                                                                        : "PNG, JPG or JPEG"}
                                                                </p>
                                                            </div>
                                                        </div>

                                                        <span className="shrink-0 text-[8px] font-bold text-[#b91c1c] sm:text-[9px]">
                                                            Change
                                                        </span>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center justify-center px-3 py-4 text-center sm:px-4 sm:py-5">
                                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-50 sm:h-9 sm:w-9">
                                                        <ReceiptText className="h-3.5 w-3.5 text-[#b91c1c] sm:h-4 sm:w-4" />
                                                    </div>

                                                    <p className="mt-2 text-[9px] font-bold text-gray-800 sm:text-[10px]">
                                                        Upload Proof of Payment
                                                    </p>

                                                    <p className="mt-0.5 text-[8px] text-gray-500 sm:text-[9px]">
                                                        PNG, JPG or JPEG
                                                    </p>
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
                                                        const previewUrl =
                                                            URL.createObjectURL(
                                                                file,
                                                            );

                                                        setPaymentProofPreview(
                                                            previewUrl,
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

                                    {/* Payment verification notice */}
                                    <div className="mt-2.5 flex items-start gap-2 rounded-md bg-gray-50 p-2.5 sm:mt-3 sm:p-3">
                                        <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-green-600" />

                                        <p className="text-[9px] leading-relaxed text-gray-700 sm:text-[11px]">
                                            Please upload a clear screenshot or
                                            photo of your payment receipt. Your
                                            booking will remain{" "}
                                            <span className="font-semibold text-yellow-700">
                                                Pending
                                            </span>{" "}
                                            until the payment is verified by
                                            Court Avenue.
                                        </p>
                                    </div>
                                </div>
                            </section>
                        </div>

                        {/* Right */}
                        <aside className="h-fit lg:sticky lg:top-4">
                            <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
                                <div className="border-b border-red-100 bg-red-50 px-4 py-3">
                                    <div className="flex items-center gap-2">
                                        <ReceiptText className="h-4 w-4 text-[#b91c1c]" />

                                        <h3 className="text-sm font-bold text-gray-900 sm:text-sm">
                                            Order Summary
                                        </h3>
                                    </div>
                                </div>

                                <div className="p-4">
                                    <div className="flex items-center justify-between text-[12px]">
                                        <span className="text-gray-900">
                                            Court slots
                                        </span>

                                        <span className="font-semibold text-gray-900">
                                            {booking.selections.length}
                                        </span>
                                    </div>

                                    <div className="mt-3 space-y-2 text-[12px]">
                                        <div className="flex justify-between">
                                            <span className="text-gray-900">
                                                Subtotal
                                            </span>

                                            <span className="font-medium text-gray-900">
                                                ₱
                                                {formatCurrency(
                                                    booking.subtotal,
                                                )}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="my-4 border-t border-dashed border-gray-200" />

                                    <div className="flex items-end justify-between">
                                        <div>
                                            <p className="text-[9px] font-semibold uppercase tracking-wider text-gray-800">
                                                Total
                                            </p>

                                            <p className="mt-0.5 text-xs font-bold text-gray-900">
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
                                        className={`mt-5 flex w-full items-center justify-center gap-2 rounded-md px-4 py-3 text-xs font-bold shadow-sm transition ${
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

                                    <p className="mt-3 text-center text-[12px] leading-relaxed text-gray-800">
                                        By continuing, you agree to the Court
                                        Avenue booking{" "}
                                        <span className="text-red-400 underline">
                                            terms and conditions
                                        </span>
                                        .
                                    </p>
                                </div>
                            </div>
                        </aside>
                    </div>
                </main>
            </div>
        </>
    );
}
