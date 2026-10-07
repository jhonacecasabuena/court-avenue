import { useMemo, useState } from "react";
import {
    CalendarDays,
    ChevronLeft,
    ChevronRight,
    CheckCircle2,
    ChevronDown,
} from "lucide-react";

type Props = {
    selectedDates: string[];
    onToggleDate: (date: string) => void;
};

const TIME_ZONE = "Asia/Manila";

function getManilaToday(): string {
    return new Intl.DateTimeFormat("en-CA", {
        timeZone: TIME_ZONE,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    }).format(new Date());
}

function getManilaDate(): Date {
    const today = getManilaToday();
    const [year, month, day] = today.split("-").map(Number);

    return new Date(year, month - 1, day);
}

function formatDate(year: number, month: number, day: number): string {
    return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(
        2,
        "0",
    )}`;
}

export default function DateSelector({ selectedDates, onToggleDate }: Props) {
    const today = useMemo(() => getManilaToday(), []);

    const [showCalendar, setShowCalendar] = useState(true);

    const [currentMonth, setCurrentMonth] = useState(() => {
        const date = getManilaDate();

        return {
            year: date.getFullYear(),
            month: date.getMonth(),
        };
    });

    const monthName = new Intl.DateTimeFormat("en-US", {
        month: "long",
        year: "numeric",
    }).format(new Date(currentMonth.year, currentMonth.month, 1));

    const daysInMonth = new Date(
        currentMonth.year,
        currentMonth.month + 1,
        0,
    ).getDate();

    const firstDay = new Date(
        currentMonth.year,
        currentMonth.month,
        1,
    ).getDay();

    const startOffset = (firstDay + 6) % 7;

    const calendarDays = useMemo(() => {
        return Array.from(
            {
                length: startOffset + daysInMonth,
            },
            (_, index) => {
                if (index < startOffset) {
                    return null;
                }

                const day = index - startOffset + 1;

                return {
                    day,
                    date: formatDate(
                        currentMonth.year,
                        currentMonth.month + 1,
                        day,
                    ),
                };
            },
        );
    }, [currentMonth.year, currentMonth.month, daysInMonth, startOffset]);

    const previousMonth = () => {
        setCurrentMonth((current) =>
            current.month === 0
                ? {
                      year: current.year - 1,
                      month: 11,
                  }
                : {
                      ...current,
                      month: current.month - 1,
                  },
        );
    };

    const nextMonth = () => {
        setCurrentMonth((current) =>
            current.month === 11
                ? {
                      year: current.year + 1,
                      month: 0,
                  }
                : {
                      ...current,
                      month: current.month + 1,
                  },
        );
    };

    return (
        <section className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
            {/* Header */}
            <div className="border-b border-red-100 bg-red-50 px-3 py-3 sm:px-3.5 sm:py-3.5 lg:px-4 lg:py-4">
                <div className="flex items-center justify-between gap-2.5">
                    <div className="flex min-w-0 items-center gap-2.5">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[#b91c1c] text-white sm:h-9 sm:w-9 lg:h-10 lg:w-10">
                            <CalendarDays className="h-4 w-4 sm:h-4.5 sm:w-4.5 lg:h-5 lg:w-5" />
                        </div>

                        <div className="min-w-0">
                            <p className="text-[8px] font-bold uppercase tracking-[0.16em] text-[#b91c1c] sm:text-[9px] lg:text-[10px]">
                                Reservation
                            </p>

                            <h2 className="text-xs font-bold text-gray-900 sm:text-sm lg:text-base">
                                Select dates
                            </h2>

                            <p className="mt-0.5 text-[9px] text-gray-500 sm:text-[10px] lg:text-[11px]">
                                Multiple dates allowed
                            </p>
                        </div>
                    </div>

                    {/* Minimize / Show button - mobile only */}
                    <button
                        type="button"
                        onClick={() => setShowCalendar((current) => !current)}
                        className="flex h-8 shrink-0 items-center gap-1.5 rounded-md border border-red-200 bg-white px-2.5 text-[9px] font-semibold text-[#b91c1c] transition hover:bg-red-50 lg:hidden"
                        aria-expanded={showCalendar}
                        aria-label={
                            showCalendar ? "Minimize calendar" : "Show calendar"
                        }
                    >
                        <span>{showCalendar ? "Hide" : "Show"}</span>

                        <ChevronDown
                            className={`h-3.5 w-3.5 transition-transform ${
                                showCalendar ? "rotate-180" : ""
                            }`}
                        />
                    </button>
                </div>
            </div>

            {/* Calendar body */}
            <div
                className={`p-3 sm:p-3.5 lg:p-4 ${
                    showCalendar ? "block" : "hidden"
                } lg:block`}
            >
                {/* Month navigation */}
                <div className="mb-3 flex items-center justify-between rounded-md border border-gray-100 bg-gray-50 p-1 sm:p-1.5 lg:mb-4">
                    <button
                        type="button"
                        onClick={previousMonth}
                        className="flex h-7 w-7 items-center justify-center rounded-md text-gray-500 transition hover:bg-white hover:text-[#b91c1c] sm:h-8 sm:w-8 lg:h-9 lg:w-9"
                        aria-label="Previous month"
                    >
                        <ChevronLeft className="h-4 w-4 lg:h-4.5 lg:w-4.5" />
                    </button>

                    <div className="text-center">
                        <p className="text-[11px] font-bold text-gray-900 sm:text-xs lg:text-sm">
                            {monthName}
                        </p>

                        <p className="text-[8px] text-gray-400 sm:text-[9px] lg:text-[10px]">
                            Choose your playing date
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={nextMonth}
                        className="flex h-7 w-7 items-center justify-center rounded-md text-gray-500 transition hover:bg-white hover:text-[#b91c1c] sm:h-8 sm:w-8 lg:h-9 lg:w-9"
                        aria-label="Next month"
                    >
                        <ChevronRight className="h-4 w-4 lg:h-4.5 lg:w-4.5" />
                    </button>
                </div>

                {/* Weekdays */}
                <div className="mb-1 grid grid-cols-7">
                    {["M", "T", "W", "T", "F", "S", "S"].map((day, index) => (
                        <div
                            key={`${day}-${index}`}
                            className="py-1 text-center text-[8px] font-bold uppercase tracking-wide text-gray-400 sm:text-[9px] lg:py-1.5 lg:text-[10px]"
                        >
                            {day}
                        </div>
                    ))}
                </div>

                {/* Days */}
                <div className="grid grid-cols-7 gap-1 sm:gap-1.5 lg:gap-1.5">
                    {calendarDays.map((item, index) => {
                        if (!item) {
                            return (
                                <div
                                    key={`empty-${index}`}
                                    className="aspect-square"
                                />
                            );
                        }

                        const selected = selectedDates.includes(item.date);
                        const past = item.date < today;
                        const isToday = item.date === today;

                        return (
                            <button
                                key={item.date}
                                type="button"
                                disabled={past}
                                onClick={() => onToggleDate(item.date)}
                                className={`relative flex aspect-square items-center justify-center rounded-md text-[10px] font-semibold transition sm:text-[11px] lg:text-xs ${
                                    selected
                                        ? "bg-[#b91c1c] text-white shadow-sm"
                                        : past
                                          ? "cursor-not-allowed text-gray-300"
                                          : "text-gray-700 hover:bg-red-50 hover:text-[#b91c1c]"
                                }`}
                            >
                                {item.day}

                                {isToday && !selected && (
                                    <span className="absolute bottom-1 h-1 w-1 rounded-full bg-[#b91c1c] sm:h-1.5 sm:w-1.5" />
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Selected status */}
                <div className="mt-3 border-t border-gray-100 pt-3 sm:mt-3.5 sm:pt-3.5 lg:mt-4 lg:pt-4">
                    <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                            <CheckCircle2
                                className={`h-3.5 w-3.5 ${
                                    selectedDates.length > 0
                                        ? "text-[#b91c1c]"
                                        : "text-gray-300"
                                }`}
                            />

                            <span className="text-[9px] font-semibold text-gray-600 sm:text-[10px] lg:text-[11px]">
                                {selectedDates.length > 0
                                    ? `${selectedDates.length} date${
                                          selectedDates.length > 1 ? "s" : ""
                                      } selected`
                                    : "No dates selected"}
                            </span>
                        </div>

                        {selectedDates.length > 0 && (
                            <span className="rounded-full bg-red-50 px-2 py-0.5 text-[8px] font-bold text-[#b91c1c] sm:text-[9px] lg:text-[10px]">
                                Ready
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
