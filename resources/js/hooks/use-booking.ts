import { useEffect, useMemo, useState } from "react";

import type { BookingSelection, Court, TimeSlot, BookedSlot } from "@/types";

type SlotStatus = "available" | "pending" | "confirmed" | "closed";

export function useBooking(
    courts: Court[],
    timeSlots: TimeSlot[],
    bookedSlots: BookedSlot[],
) {
    const [selectedDates, setSelectedDates] = useState<string[]>([]);
    const [selections, setSelections] = useState<BookingSelection[]>([]);
    const [now, setNow] = useState(() => Date.now());

    // Refresh the current time while the booking page is open.
    useEffect(() => {
        const interval = window.setInterval(() => {
            setNow(Date.now());
        }, 30_000);

        return () => window.clearInterval(interval);
    }, []);

    // Compare dates and times using Philippine time.
    // const isPastSlot = (date: string, startTime: string): boolean => {
    //     const formatter = new Intl.DateTimeFormat("en-CA", {
    //         timeZone: "Asia/Manila",
    //         year: "numeric",
    //         month: "2-digit",
    //         day: "2-digit",
    //     });

    //     const currentDate = formatter.format(new Date(now));

    //     if (date < currentDate) {
    //         return true;
    //     }

    //     if (date > currentDate) {
    //         return false;
    //     }

    //     const timeFormatter = new Intl.DateTimeFormat("en-GB", {
    //         timeZone: "Asia/Manila",
    //         hour: "2-digit",
    //         minute: "2-digit",
    //         second: "2-digit",
    //         hourCycle: "h23",
    //     });

    //     const parts = timeFormatter.formatToParts(new Date(now));
    //     const part = (type: string) =>
    //         parts.find((item) => item.type === type)?.value ?? "00";

    //     const currentTime = `${part("hour")}:${part("minute")}:${part("second")}`;

    //     const slotStart =
    //         startTime.length === 5 ? `${startTime}:00` : startTime;

    //     return slotStart <= currentTime;
    // };

    const isPastSlot = (
        date: string,
        startTime: string,
        endTime: string,
    ): boolean => {
        const formatter = new Intl.DateTimeFormat("en-GB", {
            timeZone: "Asia/Manila",
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hourCycle: "h23",
        });

        const parts = formatter.formatToParts(new Date(now));

        const part = (type: string) =>
            parts.find((item) => item.type === type)?.value ?? "00";

        const currentDateTime =
            `${part("year")}-${part("month")}-${part("day")}T` +
            `${part("hour")}:${part("minute")}:${part("second")}`;

        const normalizeTime = (time: string) =>
            time.length === 5 ? `${time}:00` : time;

        const start = normalizeTime(startTime);
        const end = normalizeTime(endTime);

        // If the end time is midnight or earlier than the start,
        // the slot ends on the following day.
        let endDate = date;

        if (end <= start) {
            const nextDate = new Date(`${date}T00:00:00Z`);
            nextDate.setUTCDate(nextDate.getUTCDate() + 1);

            endDate = [
                nextDate.getUTCFullYear(),
                String(nextDate.getUTCMonth() + 1).padStart(2, "0"),
                String(nextDate.getUTCDate()).padStart(2, "0"),
            ].join("-");
        }

        const slotEndDateTime = `${endDate}T${end}`;

        return slotEndDateTime <= currentDateTime;
    };

    const getSlotStatus = (
        date: string,
        timeSlotId: number,
        courtId: number,
    ): SlotStatus => {
        const slot = bookedSlots.find(
            (item) =>
                item.date === date &&
                item.time_slot_id === timeSlotId &&
                item.court_id === courtId,
        );

        // Preserve existing booking statuses.
        if (slot?.status === "confirmed") {
            return "confirmed";
        }

        if (slot?.status === "pending") {
            return "pending";
        }

        // A slot whose start time has passed is closed.
        const timeSlot = timeSlots.find((item) => item.id === timeSlotId);

        if (
            timeSlot &&
            isPastSlot(date, timeSlot.start_time, timeSlot.end_time)
        ) {
            return "closed";
        }

        return "available";
    };

    const toggleDate = (date: string) => {
        setSelectedDates((current) => {
            if (current.includes(date)) {
                setSelections((previous) =>
                    previous.filter((selection) => selection.date !== date),
                );

                return current.filter((item) => item !== date);
            }

            return [...current, date];
        });
    };

    const toggleSlot = (date: string, timeSlotId: number, courtId: number) => {
        if (getSlotStatus(date, timeSlotId, courtId) !== "available") {
            return;
        }

        setSelections((current) => {
            const exists = current.some(
                (selection) =>
                    selection.date === date &&
                    selection.timeSlotId === timeSlotId &&
                    selection.courtId === courtId,
            );

            if (exists) {
                return current.filter(
                    (selection) =>
                        !(
                            selection.date === date &&
                            selection.timeSlotId === timeSlotId &&
                            selection.courtId === courtId
                        ),
                );
            }

            return [...current, { date, timeSlotId, courtId }];
        });
    };

    // Remove selections that have become unavailable.
    useEffect(() => {
        setSelections((current) =>
            current.filter(
                (selection) =>
                    getSlotStatus(
                        selection.date,
                        selection.timeSlotId,
                        selection.courtId,
                    ) === "available",
            ),
        );
    }, [now, bookedSlots, timeSlots]);

    const subtotal = useMemo(
        () =>
            selections.reduce((total, selection) => {
                const court = courts.find(
                    (item) => item.id === selection.courtId,
                );

                return total + Number(court?.price ?? 0);
            }, 0),
        [selections, courts],
    );

    const serviceFee = 0;
    const total = subtotal + serviceFee;

    return {
        selectedDates,
        selections,
        toggleDate,
        toggleSlot,
        getSlotStatus,
        subtotal,
        serviceFee,
        total,
        courts,
        timeSlots,
    };
}

// import { useMemo, useState } from "react";

// import type { BookingSelection, Court, TimeSlot, BookedSlot } from "@/types";

// export function useBooking(
//     courts: Court[],
//     timeSlots: TimeSlot[],
//     bookedSlots: BookedSlot[],
// ) {
//     const [selectedDates, setSelectedDates] = useState<string[]>([]);

//     const [selections, setSelections] = useState<BookingSelection[]>([]);

//     const toggleDate = (date: string) => {
//         setSelectedDates((current) => {
//             if (current.includes(date)) {
//                 setSelections((selections) =>
//                     selections.filter((selection) => selection.date !== date),
//                 );

//                 return current.filter((item) => item !== date);
//             }

//             return [...current, date];
//         });
//     };

//     const toggleSlot = (date: string, timeSlotId: number, courtId: number) => {
//         const status = getSlotStatus(date, timeSlotId, courtId);

//         if (status !== "available") {
//             return;
//         }

//         setSelections((current) => {
//             const exists = current.some(
//                 (selection) =>
//                     selection.date === date &&
//                     selection.timeSlotId === timeSlotId &&
//                     selection.courtId === courtId,
//             );

//             if (exists) {
//                 return current.filter(
//                     (selection) =>
//                         !(
//                             selection.date === date &&
//                             selection.timeSlotId === timeSlotId &&
//                             selection.courtId === courtId
//                         ),
//                 );
//             }

//             return [
//                 ...current,
//                 {
//                     date,
//                     timeSlotId,
//                     courtId,
//                 },
//             ];
//         });
//     };

//     const subtotal = useMemo(() => {
//         return selections.reduce((total, selection) => {
//             const court = courts.find(
//                 (court) => court.id === selection.courtId,
//             );

//             return total + Number(court?.price ?? 0);
//         }, 0);
//     }, [selections, courts]);

//     const serviceFee = selections.length > 0 ? 0 : 0;

//     const total = subtotal + serviceFee;

//     const getSlotStatus = (
//         date: string,
//         timeSlotId: number,
//         courtId: number,
//     ): "available" | "pending" | "confirmed" => {
//         const slot = bookedSlots.find(
//             (item) =>
//                 item.date === date &&
//                 item.time_slot_id === timeSlotId &&
//                 item.court_id === courtId,
//         );

//         if (!slot) {
//             return "available";
//         }

//         if (slot.status === "confirmed") {
//             return "confirmed";
//         }

//         if (slot.status === "pending") {
//             return "pending";
//         }

//         // cancelled / expired / anything else
//         return "available";
//     };
//     return {
//         selectedDates,
//         selections,
//         toggleDate,
//         toggleSlot,
//         getSlotStatus,
//         subtotal,
//         serviceFee,
//         total,
//         courts,
//         timeSlots,
//     };
// }
