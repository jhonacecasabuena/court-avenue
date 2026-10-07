export type BookingDate = {
    date: string;
    day: string;
    dayNumber: number;
    month: string;
};

export type CourtStatus = "available" | "maintenance" | "inactive";

export type CourtType = "indoor" | "outdoor";

export type Court = {
    id: number;
    name: string;
    status: CourtStatus;
    description: string | null;
    court_type: CourtType;
    capacity: number;
    lighting: string;
    image: string | null;
    price: number;
};

export type TimeSlot = {
    id: number;
    start_time: string;
    end_time: string;
    is_active: boolean;
};

export type BookingSelection = {
    date: string;
    timeSlotId: number;
    courtId: number;
};

export type BookingSummary = {
    date: string;
    time: string;
    court: string;
    price: number;
};

export type BookedSlot = {
    date: string;
    court_id: number;
    time_slot_id: number;
    status: "pending" | "confirmed";
};
