import { useEffect, useMemo, useState } from "react";

import type { BookingSelection, Court, TimeSlot, BookedSlot } from "@/types";

type SlotStatus = "available" | "pending" | "confirmed" | "closed";

type SavedSelection = {
    date: string;
    court_id: number;
    time_slot_id: number;
};

export function useBooking(
    courts: Court[],
    timeSlots: TimeSlot[],
    bookedSlots: BookedSlot[],
    savedSelections: SavedSelection[] = [],
) {
    // Restore selected dates from the saved Laravel session data.
    const [selectedDates, setSelectedDates] = useState<string[]>(() =>
        [...new Set(savedSelections.map((selection) => selection.date))].sort(),
    );

    // Convert Laravel snake_case fields into the existing React selection format.
    const [selections, setSelections] = useState<BookingSelection[]>(() =>
        savedSelections.map((selection) => ({
            date: selection.date,
            courtId: Number(selection.court_id),
            timeSlotId: Number(selection.time_slot_id),
        })),
    );

    const [now, setNow] = useState(() => Date.now());

    // Refresh the current time while the booking page is open.
    useEffect(() => {
        const interval = window.setInterval(() => {
            setNow(Date.now());
        }, 30_000);

        return () => window.clearInterval(interval);
    }, []);

    // Compare dates and times using Philippine time.
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

        let endDate = date;

        // Handle slots that end at midnight or cross into the next day.
        if (end <= start) {
            const nextDate = new Date(`${date}T00:00:00Z`);
            nextDate.setUTCDate(nextDate.getUTCDate() + 1);

            endDate = [
                nextDate.getUTCFullYear(),
                String(nextDate.getUTCMonth() + 1).padStart(2, "0"),
                String(nextDate.getUTCDate()).padStart(2, "0"),
            ].join("-");
        }

        return `${endDate}T${end}` <= currentDateTime;
    };

    const getSlotStatus = (
        date: string,
        timeSlotId: number,
        courtId: number,
    ): SlotStatus => {
        const slot = bookedSlots.find(
            (item) =>
                item.date === date &&
                Number(item.time_slot_id) === timeSlotId &&
                Number(item.court_id) === courtId,
        );

        // Booked slots take priority over availability.
        if (slot?.status === "confirmed") {
            return "confirmed";
        }

        if (slot?.status === "pending") {
            return "pending";
        }

        const timeSlot = timeSlots.find(
            (item) => Number(item.id) === timeSlotId,
        );

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

            return [
                ...current,
                {
                    date,
                    timeSlotId,
                    courtId,
                },
            ];
        });
    };

    // Remove slots that become unavailable while the page is open.
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
            selections.reduce((sum, selection) => {
                const court = courts.find(
                    (item) => Number(item.id) === Number(selection.courtId),
                );

                return sum + Number(court?.price ?? 0);
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

// import { useEffect, useMemo, useState } from "react";

// import type { BookingSelection, Court, TimeSlot, BookedSlot } from "@/types";

// type SlotStatus = "available" | "pending" | "confirmed" | "closed";

// export function useBooking(
//     courts: Court[],
//     timeSlots: TimeSlot[],
//     bookedSlots: BookedSlot[],
// ) {
//     const [selectedDates, setSelectedDates] = useState<string[]>([]);
//     const [selections, setSelections] = useState<BookingSelection[]>([]);
//     const [now, setNow] = useState(() => Date.now());

//     // Refresh the current time while the booking page is open.
//     useEffect(() => {
//         const interval = window.setInterval(() => {
//             setNow(Date.now());
//         }, 30_000);

//         return () => window.clearInterval(interval);
//     }, []);

//     const isPastSlot = (
//         date: string,
//         startTime: string,
//         endTime: string,
//     ): boolean => {
//         const formatter = new Intl.DateTimeFormat("en-GB", {
//             timeZone: "Asia/Manila",
//             year: "numeric",
//             month: "2-digit",
//             day: "2-digit",
//             hour: "2-digit",
//             minute: "2-digit",
//             second: "2-digit",
//             hourCycle: "h23",
//         });

//         const parts = formatter.formatToParts(new Date(now));

//         const part = (type: string) =>
//             parts.find((item) => item.type === type)?.value ?? "00";

//         const currentDateTime =
//             `${part("year")}-${part("month")}-${part("day")}T` +
//             `${part("hour")}:${part("minute")}:${part("second")}`;

//         const normalizeTime = (time: string) =>
//             time.length === 5 ? `${time}:00` : time;

//         const start = normalizeTime(startTime);
//         const end = normalizeTime(endTime);

//         // If the end time is midnight or earlier than the start,
//         // the slot ends on the following day.
//         let endDate = date;

//         if (end <= start) {
//             const nextDate = new Date(`${date}T00:00:00Z`);
//             nextDate.setUTCDate(nextDate.getUTCDate() + 1);

//             endDate = [
//                 nextDate.getUTCFullYear(),
//                 String(nextDate.getUTCMonth() + 1).padStart(2, "0"),
//                 String(nextDate.getUTCDate()).padStart(2, "0"),
//             ].join("-");
//         }

//         const slotEndDateTime = `${endDate}T${end}`;

//         return slotEndDateTime <= currentDateTime;
//     };

//     const getSlotStatus = (
//         date: string,
//         timeSlotId: number,
//         courtId: number,
//     ): SlotStatus => {
//         const slot = bookedSlots.find(
//             (item) =>
//                 item.date === date &&
//                 item.time_slot_id === timeSlotId &&
//                 item.court_id === courtId,
//         );

//         // Preserve existing booking statuses.
//         if (slot?.status === "confirmed") {
//             return "confirmed";
//         }

//         if (slot?.status === "pending") {
//             return "pending";
//         }

//         // A slot whose start time has passed is closed.
//         const timeSlot = timeSlots.find((item) => item.id === timeSlotId);

//         if (
//             timeSlot &&
//             isPastSlot(date, timeSlot.start_time, timeSlot.end_time)
//         ) {
//             return "closed";
//         }

//         return "available";
//     };

//     const toggleDate = (date: string) => {
//         setSelectedDates((current) => {
//             if (current.includes(date)) {
//                 setSelections((previous) =>
//                     previous.filter((selection) => selection.date !== date),
//                 );

//                 return current.filter((item) => item !== date);
//             }

//             return [...current, date];
//         });
//     };

//     const toggleSlot = (date: string, timeSlotId: number, courtId: number) => {
//         if (getSlotStatus(date, timeSlotId, courtId) !== "available") {
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

//             return [...current, { date, timeSlotId, courtId }];
//         });
//     };

//     // Remove selections that have become unavailable.
//     useEffect(() => {
//         setSelections((current) =>
//             current.filter(
//                 (selection) =>
//                     getSlotStatus(
//                         selection.date,
//                         selection.timeSlotId,
//                         selection.courtId,
//                     ) === "available",
//             ),
//         );
//     }, [now, bookedSlots, timeSlots]);

//     const subtotal = useMemo(
//         () =>
//             selections.reduce((total, selection) => {
//                 const court = courts.find(
//                     (item) => item.id === selection.courtId,
//                 );

//                 return total + Number(court?.price ?? 0);
//             }, 0),
//         [selections, courts],
//     );

//     const serviceFee = 0;
//     const total = subtotal + serviceFee;

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
