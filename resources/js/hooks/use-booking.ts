import { useMemo, useState } from "react";

import type { BookingSelection, Court, TimeSlot, BookedSlot } from "@/types";

export function useBooking(
    courts: Court[],
    timeSlots: TimeSlot[],
    bookedSlots: BookedSlot[],
) {
    const [selectedDates, setSelectedDates] = useState<string[]>([]);

    const [selections, setSelections] = useState<BookingSelection[]>([]);

    const toggleDate = (date: string) => {
        setSelectedDates((current) => {
            if (current.includes(date)) {
                setSelections((selections) =>
                    selections.filter((selection) => selection.date !== date),
                );

                return current.filter((item) => item !== date);
            }

            return [...current, date];
        });
    };

    const toggleSlot = (date: string, timeSlotId: number, courtId: number) => {
        const status = getSlotStatus(date, timeSlotId, courtId);

        if (status !== "available") {
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

    const subtotal = useMemo(() => {
        return selections.reduce((total, selection) => {
            const court = courts.find(
                (court) => court.id === selection.courtId,
            );

            return total + Number(court?.price ?? 0);
        }, 0);
    }, [selections, courts]);

    const serviceFee = selections.length > 0 ? 20 : 0;

    const total = subtotal + serviceFee;

    const isSlotBooked = (
        date: string,
        timeSlotId: number,
        courtId: number,
    ) => {
        return bookedSlots.some(
            (slot) =>
                slot.date === date &&
                slot.time_slot_id === timeSlotId &&
                slot.court_id === courtId,
        );
    };

    const getSlotStatus = (
        date: string,
        timeSlotId: number,
        courtId: number,
    ): "available" | "pending" | "confirmed" => {
        const slot = bookedSlots.find(
            (item) =>
                item.date === date &&
                item.time_slot_id === timeSlotId &&
                item.court_id === courtId,
        );

        return slot?.status ?? "available";
    };

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
