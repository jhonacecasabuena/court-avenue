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
    ) => "available" | "pending" | "confirmed" | "closed";
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
        month: "short",
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
            <div className="flex min-h-[72px] w-full items-center justify-between border-b border-red-100 bg-red-50 px-4 py-3 sm:min-h-[76px] sm:px-5 sm:py-3.5">
                <div className="flex min-w-0 flex-1 items-center gap-3">
                    <div className="min-w-0">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#b91c1c] sm:text-xs">
                            Selected date
                        </p>

                        <p className="mt-0.5 truncate text-md font-bold leading-tight text-gray-900 sm:text-md">
                            {formattedDate}
                        </p>
                    </div>
                </div>

                <div className="ml-3 flex shrink-0 items-center gap-2">
                    {/* Selected count */}
                    {selectedCount > 0 && (
                        <span className="tracking-wider inline-flex items-center rounded-full border border-red-200 bg-white px-3 py-1.5 text-[10px] font-semibold text-[#b91c1c] sm:text-xs">
                            {selectedCount}{" "}
                            {selectedCount === 1
                                ? "slot selected"
                                : "slots selected"}
                        </span>
                    )}

                    {/* Show / Hide */}
                    <button
                        type="button"
                        onClick={() => setShowSchedule((current) => !current)}
                        className="flex h-9 items-center gap-2 rounded-md border border-red-200 bg-white px-3.5 text-xs font-bold text-[#b91c1c] shadow-sm transition hover:bg-red-50 sm:h-10 sm:px-4 sm:text-sm"
                        aria-expanded={showSchedule}
                        aria-label={
                            showSchedule
                                ? `Hide schedule for ${formattedDate}`
                                : `Show schedule for ${formattedDate}`
                        }
                    >
                        <span>{showSchedule ? "Hide" : "Show "}</span>

                        <ChevronDown
                            className={`h-4 w-4 transition-transform ${
                                showSchedule ? "rotate-180" : ""
                            }`}
                        />
                    </button>
                </div>
            </div>

            {showSchedule && (
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[430px] table-fixed border-collapse">
                        <colgroup>
                            {/* Time */}
                            <col className="w-[65px]" />

                            {/* Courts */}
                            {courts.map((court) => (
                                <col key={court.id} className="w-[91px]" />
                            ))}
                        </colgroup>

                        <thead>
                            <tr className="border-b bg-white">
                                <th className="border-r px-1 py-1.5 text-center text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                                    Time
                                </th>

                                {courts.map((court) => (
                                    <th
                                        key={court.id}
                                        className="border-r px-1 py-1 text-center last:border-r-0"
                                    >
                                        <div className="text-[12px] font-semibold text-gray-900">
                                            {court.name}
                                        </div>

                                        <div className="text-[11px] font-normal text-gray-800 tracking-wider">
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
                                    <td className="border-r bg-gray-50 px-1 py-1 text-center">
                                        <div className="text-[12px] sm:text-[12px] font-semibold text-gray-600">
                                            {formatTime(slot.start_time)}
                                        </div>

                                        <div className="text-[12px] font-semibold text-gray-600">
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

                                        // const unavailable =
                                        //     status === "pending" ||
                                        //     status === "confirmed";

                                        const unavailable =
                                            status === "pending" ||
                                            status === "confirmed" ||
                                            status === "closed";

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
                                                    className={`h-9 w-full rounded text-[11px] font-semibold leading-none transition ${
                                                        status === "confirmed"
                                                            ? "cursor-not-allowed bg-gray-100 text-gray-700"
                                                            : status ===
                                                                "pending"
                                                              ? "cursor-not-allowed bg-yellow-50 text-yellow-700"
                                                              : status ===
                                                                  "closed"
                                                                ? "cursor-not-allowed bg-gray-200 text-gray-500"
                                                                : selected
                                                                  ? "bg-[#b91c1c] text-white tracking-widest"
                                                                  : "bg-green-100 text-green-700 hover:bg-green-300 hover:text-green-900 tracking-widest"
                                                    }`}
                                                    // className={`h-9 w-full rounded text-[11px] font-semibold leading-none transition ${
                                                    //     status === "confirmed"
                                                    //         ? "cursor-not-allowed bg-gray-100 text-gray-700"
                                                    //         : status ===
                                                    //             "pending"
                                                    //           ? "cursor-not-allowed bg-yellow-50 text-yellow-700"
                                                    //           : selected
                                                    //             ? "bg-[#b91c1c] text-white tracking-widest"
                                                    //             : "bg-green-100 text-green-700 hover:bg-green-300 hover:text-green-900 tracking-widest"
                                                    // }`}
                                                >
                                                    {status === "confirmed"
                                                        ? "BOOKED"
                                                        : status === "pending"
                                                          ? "Pending"
                                                          : status === "closed"
                                                            ? "CLOSED"
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
