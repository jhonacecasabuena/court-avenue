import { useState } from "react";
import { ChevronDown } from "lucide-react";

import type { Court, TimeSlot } from "@/types";

type Props = {
    date: string;
    courts: Court[];
    timeSlots: TimeSlot[];
    selections: {
        date: string;
        timeSlotId: number;
        courtId: number;
    }[];
    onToggleSlot: (date: string, timeSlotId: number, courtId: number) => void;
    getSlotStatus: (
        date: string,
        timeSlotId: number,
        courtId: number,
    ) => "available" | "pending" | "confirmed";
};

export default function CourtSchedule({
    date,
    courts,
    timeSlots,
    selections,
    onToggleSlot,
    getSlotStatus,
}: Props) {
    const [showSchedule, setShowSchedule] = useState(true);

    const isSelected = (timeSlotId: number, courtId: number) =>
        selections.some(
            (selection) =>
                selection.date === date &&
                selection.timeSlotId === timeSlotId &&
                selection.courtId === courtId,
        );

    const selectedCount = selections.filter(
        (selection) => selection.date === date,
    ).length;

    const formattedDate = new Intl.DateTimeFormat("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
    }).format(new Date(`${date}T00:00:00`));

    const formatTime = (time: string) => {
        const [hours, minutes] = time.split(":").map(Number);

        const timeDate = new Date();

        timeDate.setHours(hours, minutes, 0, 0);

        return new Intl.DateTimeFormat("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        }).format(timeDate);
    };

    return (
        <section className="border-b border-gray-200 last:border-b-0">
            {/* Date header */}
            <div className="flex items-center justify-between border-b border-red-100 bg-red-50 px-3 py-2.5 lg:px-4 lg:py-3">
                <div className="flex min-w-0 items-center gap-2">
                    <div className="min-w-0">
                        <p className="text-[8px] font-semibold uppercase tracking-wider text-[#b91c1c] lg:text-[9px]">
                            Selected date
                        </p>

                        <p className="truncate text-[11px] font-bold text-gray-900 lg:text-sm">
                            {formattedDate}
                        </p>
                    </div>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                    {/* Selected count */}
                    {selectedCount > 0 && (
                        <span className="hidden rounded-full border border-red-200 bg-white px-2 py-1 text-[8px] font-semibold text-[#b91c1c] sm:inline-flex lg:text-[9px]">
                            {selectedCount}{" "}
                            {selectedCount === 1 ? "slot" : "slots"}
                        </span>
                    )}

                    {/* Show / Hide */}
                    <button
                        type="button"
                        onClick={() => setShowSchedule((current) => !current)}
                        className="flex h-7 items-center gap-1.5 rounded-md border border-red-200 bg-white px-2 text-[8px] font-bold text-[#b91c1c] transition hover:bg-red-50 sm:h-8 sm:px-2.5 sm:text-[9px]"
                        aria-expanded={showSchedule}
                        aria-label={
                            showSchedule
                                ? `Hide schedule for ${formattedDate}`
                                : `Show schedule for ${formattedDate}`
                        }
                    >
                        <span>{showSchedule ? "Hide" : "Show"}</span>

                        <ChevronDown
                            className={`h-3.5 w-3.5 transition-transform ${
                                showSchedule ? "rotate-180" : ""
                            }`}
                        />
                    </button>
                </div>
            </div>

            {/* Schedule */}
            {showSchedule && (
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[520px] border-collapse">
                        <thead>
                            <tr className="border-b bg-white">
                                <th className="w-20 border-r px-2 py-1.5 text-left text-[9px] font-semibold uppercase tracking-wide text-gray-500">
                                    Time
                                </th>

                                {courts.map((court) => (
                                    <th
                                        key={court.id}
                                        className="border-r px-1.5 py-1.5 text-center last:border-r-0"
                                    >
                                        <div className="text-[9px] font-semibold text-gray-900">
                                            {court.name}
                                        </div>

                                        <div className="text-[8px] font-normal text-gray-500">
                                            ₱
                                            {Number(court.price).toLocaleString(
                                                "en-PH",
                                                {
                                                    minimumFractionDigits: 2,
                                                    maximumFractionDigits: 2,
                                                },
                                            )}
                                            /hr
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>

                        <tbody>
                            {timeSlots.map((slot) => (
                                <tr
                                    key={slot.id}
                                    className="border-b last:border-b-0"
                                >
                                    <td className="border-r bg-gray-50 px-2 py-1.5">
                                        <div className="text-[9px] font-semibold text-gray-900">
                                            {formatTime(slot.start_time)}
                                        </div>

                                        <div className="text-[8px] text-gray-500">
                                            {formatTime(slot.end_time)}
                                        </div>
                                    </td>

                                    {courts.map((court) => {
                                        const selected = isSelected(
                                            slot.id,
                                            court.id,
                                        );

                                        const status = getSlotStatus(
                                            date,
                                            slot.id,
                                            court.id,
                                        );

                                        const unavailable =
                                            status === "pending" ||
                                            status === "confirmed";

                                        return (
                                            <td
                                                key={court.id}
                                                className="border-r p-0.5 last:border-r-0"
                                            >
                                                <button
                                                    type="button"
                                                    disabled={unavailable}
                                                    onClick={() => {
                                                        if (unavailable) return;

                                                        onToggleSlot(
                                                            date,
                                                            slot.id,
                                                            court.id,
                                                        );
                                                    }}
                                                    className={`h-7 w-full rounded text-[8px] font-semibold leading-none transition sm:h-8 sm:text-[9px] ${
                                                        status === "confirmed"
                                                            ? "cursor-not-allowed bg-gray-100 text-gray-400"
                                                            : status ===
                                                                "pending"
                                                              ? "cursor-not-allowed bg-yellow-50 text-yellow-700"
                                                              : selected
                                                                ? "bg-[#b91c1c] text-white"
                                                                : "bg-green-50 text-green-700 hover:bg-green-100"
                                                    }`}
                                                >
                                                    {status === "confirmed"
                                                        ? "Booked"
                                                        : status === "pending"
                                                          ? "Pending"
                                                          : selected
                                                            ? "Selected"
                                                            : "Available"}
                                                </button>
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </section>
    );
}
