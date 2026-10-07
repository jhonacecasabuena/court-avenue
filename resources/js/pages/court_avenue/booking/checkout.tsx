import { Head, Link } from "@inertiajs/react";
import { router } from "@inertiajs/react";
import {
    ArrowLeft,
    CalendarDays,
    CheckCircle2,
    Clock,
    CreditCard,
    LockKeyhole,
    MapPin,
    ReceiptText,
    ShieldCheck,
} from "lucide-react";

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
    return (
        <>
            <Head title="Checkout | Court Avenue" />

            <div className="min-h-screen bg-gray-50">
                {/* Header */}
                <header className="border-b border-red-800 bg-[#b91c1c] text-white">
                    <div className="mx-auto flex h-14 w-full max-w-[1200px] items-center justify-between px-4">
                        <div className="flex items-center gap-3">
                            <Link
                                href="/booking"
                                className="flex h-8 w-8 items-center justify-center rounded-md bg-white/10 transition hover:bg-white/20"
                            >
                                <ArrowLeft className="h-4 w-4" />
                            </Link>

                            <div>
                                <p className="text-[8px] font-semibold uppercase tracking-[0.2em] text-red-100">
                                    Court Avenue
                                </p>

                                <h1 className="text-sm font-bold">Checkout</h1>
                            </div>
                        </div>

                        <div className="hidden items-center gap-2 sm:flex">
                            <LockKeyhole className="h-3.5 w-3.5" />

                            <span className="text-[10px] font-medium">
                                Secure Checkout
                            </span>
                        </div>
                    </div>
                </header>

                <div className="h-1 bg-red-700" />

                {/* Content */}
                <main className="mx-auto w-full max-w-[1200px] px-4 py-5 sm:py-6">
                    {/* Page heading */}
                    <div className="mb-5">
                        <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#b91c1c]">
                            Reservation
                        </p>

                        <h2 className="mt-1 text-xl font-extrabold text-gray-900 sm:text-2xl">
                            Complete your booking
                        </h2>

                        <p className="mt-1 text-xs text-gray-500">
                            Review your selected courts and continue to payment.
                        </p>
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
                                            <h3 className="text-xs font-bold text-gray-900 sm:text-sm">
                                                Your Reservation
                                            </h3>

                                            <p className="text-[9px] text-gray-500">
                                                Selected court schedules
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="divide-y divide-gray-100">
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
                                                        <div className="font-semibold text-gray-900">
                                                            {
                                                                selection.court_name
                                                            }
                                                        </div>

                                                        <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-sm text-gray-500">
                                                            <span className="flex items-center gap-1">
                                                                <CalendarDays className="h-3 w-3 text-[#b91c1c]" />

                                                                {formatDate(
                                                                    selection.date,
                                                                )}
                                                            </span>

                                                            <div className="flex items-center gap-1.5 text-sm text-gray-600">
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
                                            <h3 className="text-xs font-bold text-gray-900 sm:text-sm">
                                                Payment
                                            </h3>

                                            <p className="text-[9px] text-gray-500">
                                                Choose your payment method
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-4">
                                    {/* Future payment provider */}
                                    <button
                                        type="button"
                                        className="flex w-full items-center gap-3 rounded-lg border-2 border-[#b91c1c] bg-red-50 p-3 text-left"
                                    >
                                        <div className="flex h-9 w-9 items-center justify-center rounded-md bg-white">
                                            <CreditCard className="h-4 w-4 text-[#b91c1c]" />
                                        </div>

                                        <div className="flex-1">
                                            <p className="text-xs font-bold text-gray-900">
                                                Online Payment
                                            </p>

                                            <p className="mt-0.5 text-[9px] text-gray-500">
                                                Pay securely using card or
                                                supported payment methods.
                                            </p>
                                        </div>

                                        <div className="flex h-4 w-4 items-center justify-center rounded-full border-2 border-[#b91c1c]">
                                            <div className="h-2 w-2 rounded-full bg-[#b91c1c]" />
                                        </div>
                                    </button>

                                    <div className="mt-3 flex items-start gap-2 rounded-md bg-gray-50 p-3">
                                        <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-green-600" />

                                        <p className="text-[9px] leading-relaxed text-gray-500">
                                            Your payment will be processed
                                            securely through our payment
                                            provider. Court Avenue does not
                                            store your card details.
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

                                        <h3 className="text-xs font-bold text-gray-900 sm:text-sm">
                                            Order Summary
                                        </h3>
                                    </div>
                                </div>

                                <div className="p-4">
                                    <div className="flex items-center justify-between text-[10px]">
                                        <span className="text-gray-500">
                                            Court slots
                                        </span>

                                        <span className="font-semibold text-gray-900">
                                            {booking.selections.length}
                                        </span>
                                    </div>

                                    <div className="mt-3 space-y-2 text-[10px]">
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">
                                                Subtotal
                                            </span>

                                            <span className="font-medium text-gray-900">
                                                ₱
                                                {formatCurrency(
                                                    booking.subtotal,
                                                )}
                                            </span>
                                        </div>

                                        <div className="flex justify-between">
                                            <span className="text-gray-500">
                                                Service fee
                                            </span>

                                            <span className="font-medium text-gray-900">
                                                ₱
                                                {formatCurrency(
                                                    booking.service_fee,
                                                )}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="my-4 border-t border-dashed border-gray-200" />

                                    <div className="flex items-end justify-between">
                                        <div>
                                            <p className="text-[9px] font-semibold uppercase tracking-wider text-gray-400">
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

                                    {/* Payment button */}
                                    <button
                                        type="button"
                                        onClick={() => {
                                            router.post("/booking/confirm");
                                        }}
                                        className="mt-5 flex w-full items-center justify-center gap-2 rounded-md bg-[#b91c1c] px-4 py-3 text-xs font-bold text-white shadow-sm transition hover:bg-[#991b1b]"
                                    >
                                        <CheckCircle2 className="h-3.5 w-3.5" />
                                        Confirm Paid Booking
                                    </button>

                                    <p className="mt-3 text-center text-[8px] leading-relaxed text-gray-400">
                                        By continuing, you agree to the Court
                                        Avenue booking terms and conditions.
                                    </p>
                                </div>
                            </div>

                            {/* Location */}
                            <div className="mt-3 rounded-lg border border-gray-200 bg-white p-3">
                                <div className="flex items-start gap-2">
                                    <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#b91c1c]" />

                                    <div>
                                        <p className="text-[9px] font-bold uppercase tracking-wide text-gray-400">
                                            Booking Location
                                        </p>

                                        <p className="mt-0.5 text-[10px] font-semibold text-gray-900">
                                            Court Avenue
                                        </p>

                                        <p className="text-[9px] text-gray-500">
                                            Pickleball Courts
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </aside>
                    </div>
                </main>
            </div>
        </>
    );
}
