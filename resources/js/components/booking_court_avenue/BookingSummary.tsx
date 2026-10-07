import { router } from "@inertiajs/react";
import { CalendarDays, CheckCircle2, Clock, ReceiptText } from "lucide-react";
import type { TimeSlot, Court } from "@/types";

type Props = {
    selections: {
        date: string;
        timeSlotId: number;
        courtId: number;
    }[];
    courts: {
        id: number;
        name: string;
        price: number;
    }[];
    timeSlots: TimeSlot[];
    subtotal: number;
    serviceFee: number;
    total: number;
};

const formatCurrency = (value: number) => {
    return Number(value).toLocaleString("en-PH", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
};

const formatDate = (date: string) => {
    return new Intl.DateTimeFormat("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
    }).format(new Date(`${date}T00:00:00`));
};

const formatTime = (time?: string) => {
    if (!time) {
        return "";
    }

    const [hours, minutes] = time.split(":").map(Number);

    const date = new Date();
    date.setHours(hours, minutes, 0, 0);

    return new Intl.DateTimeFormat("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    }).format(date);
};

export default function BookingSummary({
    selections,
    courts,
    timeSlots,
    subtotal,
    serviceFee,
    total,
}: Props) {
    const handleCheckout = () => {
        if (selections.length === 0) {
            return;
        }

        const bookingData = {
            selections: selections.map((selection) => {
                const court = courts.find(
                    (item) => item.id === selection.courtId,
                );

                const time = timeSlots.find(
                    (item) => item.id === selection.timeSlotId,
                );

                return {
                    date: selection.date,

                    court_id: selection.courtId,
                    court_name: court?.name ?? null,
                    court_price: Number(court?.price ?? 0),

                    time_slot_id: selection.timeSlotId,
                    start_time: time?.start_time ?? null,
                    end_time: time?.end_time ?? null,
                };
            }),

            subtotal: Number(subtotal),
            service_fee: Number(serviceFee),
            total: Number(total),
        };

        router.post("/booking/checkout", bookingData);
    };

    return (
        <aside className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
            {/* Header */}
            <div className="border-b border-red-100 bg-red-50 px-3 py-3 lg:px-4 lg:py-3.5">
                <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[#b91c1c] text-white">
                        <ReceiptText className="h-4 w-4" />
                    </div>

                    <div>
                        <h2 className="text-xs font-bold text-gray-900 lg:text-sm">
                            Booking Summary
                        </h2>

                        <p className="text-[9px] text-gray-500 lg:text-[10px]">
                            Review your selected court slots.
                        </p>
                    </div>
                </div>
            </div>

            {/* Selection count */}
            <div className="flex items-center justify-between border-b border-gray-100 px-3 py-2.5 lg:px-4">
                <span className="text-[9px] font-medium text-gray-500 lg:text-[10px]">
                    Selected bookings
                </span>

                <span className="rounded-full bg-red-50 px-2 py-0.5 text-[9px] font-bold text-[#b91c1c] lg:text-[10px]">
                    {selections.length}
                </span>
            </div>

            {/* Items */}
            <div className="max-h-[250px] space-y-2 overflow-y-auto p-3 lg:max-h-[290px] lg:p-4">
                {selections.length === 0 ? (
                    <div className="rounded-md border border-dashed border-red-200 bg-red-50/50 px-3 py-8 text-center">
                        <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-full bg-white">
                            <CalendarDays className="h-4 w-4 text-[#b91c1c]" />
                        </div>

                        <p className="mt-2 text-[10px] font-semibold text-gray-700 lg:text-xs">
                            No slots selected
                        </p>

                        <p className="mt-0.5 text-[9px] text-gray-400 lg:text-[10px]">
                            Select a court and time to continue.
                        </p>
                    </div>
                ) : (
                    selections.map((selection) => {
                        const court = courts.find(
                            (item) => item.id === selection.courtId,
                        );

                        const time = timeSlots.find(
                            (item) => item.id === selection.timeSlotId,
                        );

                        return (
                            <div
                                key={`${selection.date}-${selection.timeSlotId}-${selection.courtId}`}
                                className="rounded-md border border-gray-100 bg-gray-50 p-2.5 transition hover:border-red-100 hover:bg-red-50/40 lg:p-3"
                            >
                                {/* Court + Price */}
                                <div className="flex items-start justify-between gap-2">
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-1.5">
                                            <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-[#b91c1c]" />

                                            <p className="truncate text-[10px] font-bold text-gray-900 lg:text-xs">
                                                {court?.name}
                                            </p>
                                        </div>
                                    </div>

                                    <span className="shrink-0 text-[10px] font-bold text-gray-900 lg:text-xs">
                                        ₱
                                        {formatCurrency(
                                            Number(court?.price ?? 0),
                                        )}
                                    </span>
                                </div>

                                {/* Date */}
                                <div className="mt-2 flex items-center gap-1.5 text-[9px] text-gray-500 lg:text-[10px]">
                                    <CalendarDays className="h-3 w-3 shrink-0 text-[#b91c1c]" />

                                    <span>{formatDate(selection.date)}</span>
                                </div>

                                {/* Time */}
                                <div className="mt-1 flex items-center gap-1.5 text-[9px] text-gray-500 lg:text-[10px]">
                                    <Clock className="h-3 w-3 shrink-0 text-[#b91c1c]" />

                                    <span>
                                        {formatTime(time?.start_time)} -{" "}
                                        {formatTime(time?.end_time)}
                                    </span>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Pricing */}
            <div className="border-t border-gray-200 bg-white p-3 lg:p-4">
                <div className="space-y-2 text-[10px] lg:text-[11px]">
                    <div className="flex items-center justify-between">
                        <span className="text-gray-500">Subtotal</span>

                        <span className="font-medium text-gray-900">
                            ₱{formatCurrency(subtotal)}
                        </span>
                    </div>

                    <div className="flex items-center justify-between">
                        <span className="text-gray-500">Service fee</span>

                        <span className="font-medium text-gray-900">
                            ₱{formatCurrency(serviceFee)}
                        </span>
                    </div>
                </div>

                <div className="my-3 border-t border-dashed border-gray-200" />

                {/* Total */}
                <div className="flex items-end justify-between">
                    <div>
                        <p className="text-[9px] font-semibold uppercase tracking-wider text-gray-400 lg:text-[10px]">
                            Total amount
                        </p>

                        <p className="mt-0.5 text-xs font-bold text-gray-900 lg:text-sm">
                            Due for booking
                        </p>
                    </div>

                    <span className="text-lg font-extrabold text-[#b91c1c] lg:text-xl">
                        ₱{formatCurrency(total)}
                    </span>
                </div>

                {/* Checkout */}
                <button
                    type="button"
                    onClick={handleCheckout}
                    disabled={selections.length === 0}
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-md bg-[#b91c1c] px-3 py-2.5 text-[10px] font-bold text-white shadow-sm transition hover:bg-[#991b1b] disabled:cursor-not-allowed disabled:opacity-50 lg:py-3 lg:text-xs"
                >
                    Continue to Checkout
                </button>

                <p className="mt-2 text-center text-[8px] leading-relaxed text-gray-400 lg:text-[9px]">
                    You can review your booking before confirmation.
                </p>
            </div>
        </aside>
    );
}
