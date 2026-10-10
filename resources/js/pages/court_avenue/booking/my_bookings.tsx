import { Head, Link, router, usePage } from "@inertiajs/react";
import { useState, useEffect } from "react";
import {
    ArrowLeft,
    CalendarDays,
    CheckCircle2,
    ChevronDown,
    Clock,
    Clock3,
    Copy,
    CreditCard,
    LogOut,
    Mail,
    MapPin,
    Menu,
    Receipt,
    ReceiptText,
    Search,
    Settings,
    Settings2,
    UserRound,
    XCircle,
} from "lucide-react";
import { toast } from "sonner";

type AuthUser = {
    id: number;
    name: string;
    email: string;
    role?: string;
};

type PageProps = {
    auth: {
        user: AuthUser | null;
    };
};

type Court = {
    id: number;
    name: string;
};

type TimeSlot = {
    id: number;
    start_time: string;
    end_time: string;
};

type BookingItem = {
    id: number;
    booking_date: string;
    price: number | string;
    court: Court;
    time_slot: TimeSlot;
};

type Booking = {
    id: number;
    booking_reference: string;
    user?: {
        id: number;
        name: string;
        email: string;
    } | null;
    subtotal: number | string;
    service_fee: number | string;
    total: number | string;
    status: "pending" | "confirmed" | "cancelled";
    payment_status:
        | "pending"
        | "awaiting_confirmation"
        | "paid"
        | "expired"
        | "rejected";
    payment_proof: string | null;
    payment_method: string | null;
    payment_reference: string | null;
    paid_at: string | null;
    expires_at: string | null;
    created_at: string;
    items: BookingItem[];
};

type Props = {
    bookings: Booking[];
};

type BookingFilter = "all" | "pending" | "confirmed";

const formatDate = (date: string | null | undefined) => {
    if (!date) return "—";

    const value = String(date).trim();

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

const formatDateTime = (date: string | null | undefined) => {
    if (!date) return "—";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
        return date;
    }

    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
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

const formatCurrency = (value: number | string) => {
    return `₱${Number(value).toLocaleString("en-PH", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`;
};

const getStatus = (booking: Booking) => {
    if (booking.status === "confirmed") {
        return {
            label: "Booked",
            icon: CheckCircle2,
            className: "bg-green-50 text-green-700",
        };
    }

    if (booking.status === "pending") {
        return {
            label: "Pending",
            icon: Clock3,
            className: "bg-yellow-50 text-yellow-700",
        };
    }

    return {
        label: "Cancelled for non-payment",
        icon: XCircle,
        className: "bg-red-50 text-red-700",
    };
};

const getPaymentStatus = (booking: Booking) => {
    if (booking.payment_status === "paid") {
        return {
            label: "Confirmed",
            icon: CheckCircle2,
            className: "bg-green-50 text-green-700",
        };
    }

    if (booking.payment_status === "awaiting_confirmation") {
        return {
            label: "Awaiting Confirmation",
            icon: Clock3,
            className: "bg-yellow-50 text-yellow-700",
        };
    }

    if (booking.payment_status === "pending") {
        return {
            label: "Payment Pending",
            icon: Clock3,
            className: "bg-yellow-50 text-yellow-700",
        };
    }

    if (booking.payment_status === "rejected") {
        return {
            label: "Payment Rejected",
            icon: XCircle,
            className: "bg-red-50 text-red-700",
        };
    }

    return {
        label: "Expired",
        icon: XCircle,
        className: "bg-red-50 text-red-700",
    };
};

//admin

export default function MyBookings({ bookings }: Props) {
    const { auth } = usePage<PageProps>().props;
    const [open, setOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    const closeMenu = () => {
        setOpen(false);
        setUserMenuOpen(false);
    };

    const backUrl = auth.user?.role === "admin" ? "/admin/dashboard" : "/";

    const [selectedProof, setSelectedProof] = useState<string | null>(null);
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(
        null,
    );
    const [paymentProof, setPaymentProof] = useState<File | null>(null);

    const [bookingSearch, setBookingSearch] = useState("");
    const [bookingFilter, setBookingFilter] = useState<BookingFilter>("all");
    const [viewedProofs, setViewedProofs] = useState<number[]>([]);

    useEffect(() => {
        const interval = setInterval(() => {
            router.reload({
                only: ["bookings"],
            });
        }, 10000);

        return () => clearInterval(interval);
    }, []);

    const handleLogout = () => {
        closeMenu();

        router.post(
            "/logout",
            {},
            {
                onSuccess: () => {
                    toast.success("Logged out successfully", {
                        description:
                            "You have been safely signed out of your account.",
                    });
                },
            },
        );
    };

    const isAdmin = auth.user?.role === "admin";

    const filteredBookings = bookings.filter((booking) => {
        // Filter by booking status for both admin and user.
        if (bookingFilter !== "all" && booking.status !== bookingFilter) {
            return false;
        }

        // Search bookings for both admin and user.
        if (!bookingSearch.trim()) {
            return true;
        }

        const search = bookingSearch.trim().toLowerCase();

        return (
            booking.booking_reference?.toLowerCase().includes(search) ||
            booking.user?.name?.toLowerCase().includes(search) ||
            booking.user?.email?.toLowerCase().includes(search) ||
            booking.items?.some((item) =>
                item.court?.name?.toLowerCase().includes(search),
            )
        );
    });

    const pendingCount = bookings.filter(
        (booking) => booking.status === "pending",
    ).length;

    const confirmedCount = bookings.filter(
        (booking) => booking.status === "confirmed",
    ).length;

    return (
        <>
            <Head title="My Bookings | Court Avenue" />

            <div className="min-h-screen bg-neutral-50">
                {/* Header */}
                <header className="sticky top-0 z-40 border-b border-neutral-200 bg-white/95 shadow-sm backdrop-blur-md">
                    <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
                        {/* Logo */}
                        <Link
                            href={backUrl}
                            onClick={closeMenu}
                            className="group flex shrink-0 items-center"
                        >
                            <img
                                src="/logo.jpg"
                                alt="Court Avenue"
                                className="w-[90px] transition-opacity duration-200 group-hover:opacity-80 sm:w-[90px]"
                            />
                        </Link>

                        {/* Navigation Options Menu */}
                        <div className="relative">
                            {auth.user?.role === "admin" ? (
                                /* Admin Options Menu */
                                <div className="relative">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setMenuOpen((prev) => !prev)
                                        }
                                        className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-2.5 text-sm font-semibold text-neutral-700 shadow-sm transition hover:border-red-200 hover:bg-red-50 hover:text-[#b0002a]"
                                    >
                                        <Settings2 className="h-5 w-5" />
                                        <ChevronDown
                                            size={16}
                                            className={`transition-transform duration-200 ${
                                                menuOpen ? "rotate-180" : ""
                                            }`}
                                        />
                                    </button>

                                    {menuOpen && (
                                        <>
                                            {/* Click Outside to Close */}
                                            <button
                                                type="button"
                                                aria-label="Close options menu"
                                                className="fixed inset-0 z-40 cursor-default"
                                                onClick={() =>
                                                    setMenuOpen(false)
                                                }
                                            />

                                            {/* Popup Menu */}
                                            <div className="absolute right-0 top-full z-50 mt-2 w-60 overflow-hidden rounded-xl border border-neutral-200 bg-white p-2 shadow-xl">
                                                {/* Dashboard */}
                                                <Link
                                                    href={backUrl}
                                                    onClick={() =>
                                                        setMenuOpen(false)
                                                    }
                                                    className="group flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-neutral-700 transition hover:bg-red-50 hover:text-[#b0002a]"
                                                >
                                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-neutral-100 text-neutral-600 transition group-hover:bg-red-100 group-hover:text-[#b0002a]">
                                                        <ArrowLeft size={18} />
                                                    </div>

                                                    <div>
                                                        <p className="font-semibold">
                                                            Dashboard
                                                        </p>
                                                        <p className="mt-0.5 text-xs text-neutral-500">
                                                            Return to dashboard
                                                        </p>
                                                    </div>
                                                </Link>

                                                {/* Book Walk-In */}
                                                <Link
                                                    href="/booking"
                                                    onClick={() =>
                                                        setMenuOpen(false)
                                                    }
                                                    className="group flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-neutral-700 transition hover:bg-red-50 hover:text-[#b0002a]"
                                                >
                                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-50 text-[#b0002a] transition group-hover:bg-red-100">
                                                        <CalendarDays
                                                            size={18}
                                                        />
                                                    </div>

                                                    <div>
                                                        <p className="font-semibold">
                                                            Book Walk-In
                                                        </p>
                                                        <p className="mt-0.5 text-xs text-neutral-500">
                                                            Create a reservation
                                                        </p>
                                                    </div>
                                                </Link>
                                                {/* Divider */}
                                                <div className="my-2 border-t border-neutral-100" />

                                                {/* Logout */}
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setMenuOpen(false);
                                                        handleLogout();
                                                    }}
                                                    className="group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors duration-200 hover:bg-red-50"
                                                >
                                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-neutral-100 text-neutral-500 transition-colors group-hover:bg-red-100 group-hover:text-[#b0002a]">
                                                        <LogOut size={19} />
                                                    </div>

                                                    <div className="min-w-0 flex-1">
                                                        <p className="text-sm font-bold text-neutral-700 transition-colors group-hover:text-[#b0002a]">
                                                            Log Out
                                                        </p>
                                                        <p className="mt-0.5 text-xs text-neutral-500">
                                                            Sign out of your
                                                            account
                                                        </p>
                                                    </div>
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            ) : (
                                /* User and Guest Button */
                                <div className="relative">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setMenuOpen((prev) => !prev)
                                        }
                                        className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-2.5 text-sm font-semibold text-neutral-700 shadow-sm transition hover:border-red-200 hover:bg-red-50 hover:text-[#b0002a]"
                                    >
                                        <Settings className="h-5 w-5" />
                                        <ChevronDown
                                            size={16}
                                            className={`transition-transform duration-200 ${
                                                menuOpen ? "rotate-180" : ""
                                            }`}
                                        />
                                    </button>

                                    {menuOpen && (
                                        <>
                                            {/* Click Outside to Close */}
                                            <button
                                                type="button"
                                                aria-label="Close options menu"
                                                className="fixed inset-0 z-40 cursor-default"
                                                onClick={() =>
                                                    setMenuOpen(false)
                                                }
                                            />

                                            {/* Popup Menu */}
                                            <div className="absolute right-0 top-full z-50 mt-2 w-64 overflow-hidden rounded-2xl border border-neutral-200 bg-white p-2 shadow-xl shadow-neutral-900/10">
                                                {/* Home */}
                                                <Link
                                                    href={backUrl}
                                                    onClick={() =>
                                                        setMenuOpen(false)
                                                    }
                                                    className="group flex items-center gap-3 rounded-xl px-3 py-3 transition-colors duration-200 hover:bg-red-50"
                                                >
                                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-neutral-100 text-neutral-600 transition-colors group-hover:bg-red-100 group-hover:text-[#b0002a]">
                                                        <ArrowLeft size={19} />
                                                    </div>

                                                    <div className="min-w-0 flex-1">
                                                        <p className="text-sm font-bold text-neutral-800 transition-colors group-hover:text-[#b0002a]">
                                                            Home
                                                        </p>
                                                        <p className="mt-0.5 text-xs text-neutral-500">
                                                            Return to Home
                                                        </p>
                                                    </div>
                                                </Link>

                                                {/* Book a Court */}
                                                <Link
                                                    href="/booking"
                                                    onClick={() =>
                                                        setMenuOpen(false)
                                                    }
                                                    className="group flex items-center gap-3 rounded-xl px-3 py-3 transition-colors duration-200 hover:bg-red-50"
                                                >
                                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50 text-[#b0002a] transition-colors group-hover:bg-[#b0002a] group-hover:text-white">
                                                        <CalendarDays
                                                            size={19}
                                                        />
                                                    </div>

                                                    <div className="min-w-0 flex-1">
                                                        <p className="text-sm font-bold text-neutral-800 transition-colors group-hover:text-[#b0002a]">
                                                            Book a Court
                                                        </p>
                                                        <p className="mt-0.5 text-xs text-neutral-500">
                                                            Create a reservation
                                                        </p>
                                                    </div>
                                                </Link>

                                                {/* Divider */}
                                                <div className="my-2 border-t border-neutral-100" />

                                                {/* Logout */}
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setMenuOpen(false);
                                                        handleLogout();
                                                    }}
                                                    className="group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors duration-200 hover:bg-red-50"
                                                >
                                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-neutral-100 text-neutral-500 transition-colors group-hover:bg-red-100 group-hover:text-[#b0002a]">
                                                        <LogOut size={19} />
                                                    </div>

                                                    <div className="min-w-0 flex-1">
                                                        <p className="text-sm font-bold text-neutral-700 transition-colors group-hover:text-[#b0002a]">
                                                            Log Out
                                                        </p>
                                                        <p className="mt-0.5 text-xs text-neutral-500">
                                                            Sign out of your
                                                            account
                                                        </p>
                                                    </div>
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* Main */}
                <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
                    {/* Admin Booking Filters */}
                    {/* Booking Filters — Admin and User */}
                    <div className="mb-3 rounded-xl border border-neutral-200 bg-white p-2.5 shadow-sm sm:mb-5 sm:rounded-2xl sm:p-4">
                        <div className="mb-2 sm:mb-3">
                            <h2 className="text-xs font-bold text-neutral-900 sm:text-sm">
                                {isAdmin
                                    ? "Manage Bookings"
                                    : "Find My Bookings"}
                            </h2>

                            <p className="mt-0.5 text-[10px] text-neutral-500 sm:mt-1 sm:text-xs">
                                {isAdmin
                                    ? "Search and filter transactions by booking status."
                                    : "Search your reservations or filter them by booking status."}
                            </p>
                        </div>

                        {/* Booking Status Filters */}
                        <div className="flex flex-wrap gap-1.5 sm:gap-2">
                            {(
                                [
                                    {
                                        label: "All Bookings",
                                        value: "all",
                                        count: bookings.length,
                                    },
                                    {
                                        label: "Pending",
                                        value: "pending",
                                        count: pendingCount,
                                    },
                                    {
                                        label: "Confirmed",
                                        value: "confirmed",
                                        count: confirmedCount,
                                    },
                                ] as const
                            ).map((filter) => {
                                const active = bookingFilter === filter.value;

                                return (
                                    <button
                                        key={filter.value}
                                        type="button"
                                        onClick={() =>
                                            setBookingFilter(filter.value)
                                        }
                                        className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[10px] font-bold transition sm:gap-2 sm:rounded-xl sm:px-4 sm:py-2.5 sm:text-xs ${
                                            active
                                                ? "border-[#b91c1c] bg-[#b91c1c] text-white shadow-sm"
                                                : "border-neutral-200 bg-white text-neutral-600 hover:border-red-200 hover:bg-red-50 hover:text-[#b91c1c]"
                                        }`}
                                    >
                                        {filter.label}

                                        <span
                                            className={`rounded-full px-1.5 py-0.5 text-[9px] sm:px-2 sm:text-[10px] ${
                                                active
                                                    ? "bg-white/20 text-white"
                                                    : "bg-neutral-100 text-neutral-600"
                                            }`}
                                        >
                                            {filter.count}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Search Bookings */}
                        <div className="mt-2.5 sm:mt-3">
                            <div className="relative">
                                <Search
                                    size={16}
                                    className="absolute top-1/2 left-3 -translate-y-1/2 text-neutral-400"
                                />

                                <input
                                    type="text"
                                    value={bookingSearch}
                                    onChange={(event) =>
                                        setBookingSearch(event.target.value)
                                    }
                                    placeholder={
                                        isAdmin
                                            ? "Search name, email, reference, or court..."
                                            : "Search booking reference or court..."
                                    }
                                    aria-label="Search bookings"
                                    className="h-9 w-full rounded-lg border border-neutral-200 bg-white pr-10 pl-9 text-xs text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-[#b91c1c] focus:ring-2 focus:ring-red-100 sm:h-10 sm:rounded-xl sm:text-sm"
                                />

                                {bookingSearch && (
                                    <button
                                        type="button"
                                        onClick={() => setBookingSearch("")}
                                        aria-label="Clear booking search"
                                        className="absolute top-1/2 right-3 -translate-y-1/2 text-neutral-400 transition hover:text-[#b91c1c]"
                                    >
                                        <XCircle size={16} />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {filteredBookings.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-neutral-300 bg-white px-6 py-16 text-center">
                            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-[#b0002a]">
                                <CalendarDays size={25} />
                            </div>

                            <h2 className="mt-5 text-lg font-bold text-neutral-900">
                                {isAdmin && bookingSearch.trim()
                                    ? "No matching bookings"
                                    : isAdmin && bookingFilter !== "all"
                                      ? `No ${bookingFilter} bookings`
                                      : "No bookings yet"}
                            </h2>

                            <p className="mx-auto mt-2 max-w-md text-sm text-neutral-500">
                                {isAdmin && bookingSearch.trim()
                                    ? "No bookings match your search. Try a different name, email, or booking reference."
                                    : isAdmin && bookingFilter !== "all"
                                      ? `There are currently no ${bookingFilter} bookings to display.`
                                      : isAdmin
                                        ? "No booking transactions have been made."
                                        : "You don't have any court reservations yet. Find an available court and make your first booking."}
                            </p>

                            <Link
                                href="/booking"
                                className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#b0002a] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#920024]"
                            >
                                <CalendarDays size={17} />
                                {auth.user?.role === "admin"
                                    ? "Book Walk-in"
                                    : "Book a Court"}
                            </Link>
                        </div>
                    ) : (
                        <div className="max-h-[calc(100vh-230px)] overflow-y-auto pr-2">
                            <div className="space-y-5">
                                {filteredBookings.map((booking) => {
                                    const status = getStatus(booking);
                                    const StatusIcon = status.icon;

                                    const paymentStatus =
                                        getPaymentStatus(booking);
                                    const PaymentStatusIcon =
                                        paymentStatus.icon;
                                    return (
                                        <div
                                            key={booking.id}
                                            className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm"
                                        >
                                            {/* Booking header */}
                                            <div className="border-b border-neutral-100 bg-white px-4 py-4 sm:px-6">
                                                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                                    {/* Booking Details */}
                                                    <div className="flex min-w-0 items-start gap-3">
                                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50 text-[#b91c1c] ring-1 ring-inset ring-red-100">
                                                            <ReceiptText
                                                                size={19}
                                                            />
                                                        </div>

                                                        <div className="min-w-0 flex-1">
                                                            {/* Reference */}
                                                            <div className="flex flex-wrap items-center gap-2">
                                                                <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-neutral-500">
                                                                    Booking
                                                                    Reference
                                                                </p>

                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        navigator.clipboard.writeText(
                                                                            booking.booking_reference,
                                                                        )
                                                                    }
                                                                    title="Click to copy booking reference"
                                                                    className="inline-flex items-center gap-1 text-[10px] font-semibold text-neutral-400 transition hover:text-[#b91c1c]"
                                                                >
                                                                    <Copy
                                                                        size={
                                                                            11
                                                                        }
                                                                    />
                                                                    Copy
                                                                </button>
                                                            </div>

                                                            <p className="mt-1 break-all text-sm font-extrabold tracking-wide text-[#b91c1c]">
                                                                {
                                                                    booking.booking_reference
                                                                }
                                                            </p>

                                                            {/* Booking Date */}
                                                            <div className="mt-3 flex items-center gap-1.5 text-[11px] text-neutral-500">
                                                                <span>
                                                                    Booked on{" "}
                                                                    {formatDateTime(
                                                                        booking.created_at,
                                                                    )}
                                                                </span>
                                                            </div>
                                                            {/* Booked By */}
                                                            <div className=" flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
                                                                <span className="text-[10px] font-bold tracking-wider text-neutral-400">
                                                                    Booked By
                                                                </span>

                                                                <span className="text-xs font-semibold text-neutral-800">
                                                                    {booking
                                                                        .user
                                                                        ?.name ??
                                                                        "Unknown Booker"}
                                                                </span>

                                                                <span className="hidden text-neutral-300 sm:inline">
                                                                    ·
                                                                </span>

                                                                <span className="break-all text-xs text-neutral-500">
                                                                    {booking
                                                                        .user
                                                                        ?.email ??
                                                                        "Email unavailable"}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Booking Status */}
                                                    <div className="flex items-center justify-between gap-3 sm:justify-end">
                                                        <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 sm:hidden">
                                                            Booking Status
                                                        </span>

                                                        <span
                                                            className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-bold ring-1 ring-inset ${
                                                                status.className
                                                            } ${
                                                                booking.status ===
                                                                "confirmed"
                                                                    ? "ring-green-200"
                                                                    : booking.status ===
                                                                        "pending"
                                                                      ? "ring-yellow-200"
                                                                      : "ring-red-200"
                                                            }`}
                                                        >
                                                            <StatusIcon
                                                                size={12}
                                                            />
                                                            {status.label}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Booking items */}
                                            <div className="divide-y divide-neutral-100">
                                                {booking.items.map((item) => (
                                                    <div
                                                        key={item.id}
                                                        className="px-5 py-4 sm:px-6"
                                                    >
                                                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                                            <div>
                                                                <div className="flex items-center gap-2">
                                                                    <MapPin
                                                                        size={
                                                                            16
                                                                        }
                                                                        className="text-[#b0002a]"
                                                                    />

                                                                    <p className="text-sm font-bold text-neutral-900">
                                                                        {
                                                                            item
                                                                                .court
                                                                                .name
                                                                        }
                                                                    </p>
                                                                </div>

                                                                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-neutral-900">
                                                                    <span className="flex items-center gap-1.5">
                                                                        <CalendarDays
                                                                            size={
                                                                                14
                                                                            }
                                                                        />
                                                                        {formatDate(
                                                                            item.booking_date,
                                                                        )}
                                                                    </span>

                                                                    <span className="flex items-center gap-1.5">
                                                                        <Clock3
                                                                            size={
                                                                                14
                                                                            }
                                                                        />
                                                                        {formatTime(
                                                                            item
                                                                                .time_slot
                                                                                .start_time,
                                                                        )}{" "}
                                                                        –{" "}
                                                                        {formatTime(
                                                                            item
                                                                                .time_slot
                                                                                .end_time,
                                                                        )}
                                                                    </span>
                                                                </div>
                                                            </div>

                                                            <p className="text-sm font-bold text-neutral-800">
                                                                {formatCurrency(
                                                                    item.price,
                                                                )}{" "}
                                                            </p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Payment details */}
                                            <div className="border-t border-neutral-100 bg-white px-4 py-4 sm:px-6">
                                                <div className="grid grid-cols-2 items-center gap-4 sm:flex sm:flex-wrap sm:gap-x-5 sm:gap-y-3">
                                                    {/* Total */}
                                                    <div className="min-w-0">
                                                        <p className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
                                                            Total Amount
                                                        </p>
                                                        <p className="mt-1 text-sm font-black text-neutral-900 sm:text-base">
                                                            {formatCurrency(
                                                                booking.total,
                                                            )}
                                                        </p>
                                                    </div>

                                                    {/* Payment Status */}
                                                    <div className="min-w-0 sm:border-l sm:border-neutral-200 sm:pl-5">
                                                        <p className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
                                                            Payment Status
                                                        </p>
                                                        <div
                                                            className={`mt-1 inline-flex max-w-full items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold ${paymentStatus.className}`}
                                                        >
                                                            <PaymentStatusIcon
                                                                size={12}
                                                            />
                                                            <span className="break-words">
                                                                {
                                                                    paymentStatus.label
                                                                }
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* Payment Proof Uploaded */}
                                                    {booking.payment_proof && (
                                                        <div className="col-span-2 flex flex-wrap items-center justify-between gap-2 rounded-lg border border-neutral-200 bg-neutral-50/70 p-3 sm:col-span-1 sm:flex-1 sm:border-0 sm:bg-transparent sm:p-0">
                                                            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-green-700">
                                                                <Receipt
                                                                    size={14}
                                                                />
                                                                Receipt Uploaded
                                                            </span>

                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    setViewedProofs(
                                                                        (
                                                                            previous,
                                                                        ) =>
                                                                            previous.includes(
                                                                                booking.id,
                                                                            )
                                                                                ? previous
                                                                                : [
                                                                                      ...previous,
                                                                                      booking.id,
                                                                                  ],
                                                                    );

                                                                    setSelectedProof(
                                                                        `/storage/${booking.payment_proof}`,
                                                                    );
                                                                }}
                                                                className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-[10px] font-bold text-neutral-700 transition hover:border-[#b91c1c] hover:text-[#b91c1c]"
                                                            >
                                                                <Receipt
                                                                    size={13}
                                                                />
                                                                View Proof
                                                            </button>
                                                        </div>
                                                    )}

                                                    {/* Admin Verify Payment */}
                                                    {/* Admin Booking Actions */}
                                                    {isAdmin &&
                                                        booking.status ===
                                                            "pending" &&
                                                        booking.payment_proof &&
                                                        booking.payment_status ===
                                                            "awaiting_confirmation" && (
                                                            <div className="col-span-2 flex justify-end border-t border-neutral-100 pt-3 sm:col-span-2 sm:ml-auto sm:border-0 sm:pt-0">
                                                                <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center sm:gap-2">
                                                                    {/* Confirm Payment */}
                                                                    <button
                                                                        type="button"
                                                                        disabled={
                                                                            !viewedProofs.includes(
                                                                                booking.id,
                                                                            )
                                                                        }
                                                                        onClick={() => {
                                                                            if (
                                                                                !viewedProofs.includes(
                                                                                    booking.id,
                                                                                )
                                                                            )
                                                                                return;

                                                                            if (
                                                                                !window.confirm(
                                                                                    `Verify payment for booking ${booking.booking_reference}?`,
                                                                                )
                                                                            ) {
                                                                                return;
                                                                            }

                                                                            router.patch(
                                                                                `/admin/bookings/${booking.id}/verify-payment`,
                                                                                {},
                                                                                {
                                                                                    preserveScroll: true,
                                                                                },
                                                                            );
                                                                        }}
                                                                        className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-green-600 px-3 py-2 text-[11px] font-bold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-neutral-200 disabled:text-neutral-400 sm:w-auto"
                                                                    >
                                                                        <CheckCircle2
                                                                            size={
                                                                                14
                                                                            }
                                                                        />
                                                                        Confirm
                                                                        Payment
                                                                    </button>

                                                                    {/* Reject Booking */}
                                                                    <button
                                                                        type="button"
                                                                        disabled={
                                                                            !viewedProofs.includes(
                                                                                booking.id,
                                                                            )
                                                                        }
                                                                        onClick={() => {
                                                                            if (
                                                                                !viewedProofs.includes(
                                                                                    booking.id,
                                                                                )
                                                                            )
                                                                                return;

                                                                            if (
                                                                                !window.confirm(
                                                                                    `Reject booking ${booking.booking_reference} due to incorrect or invalid payment proof?`,
                                                                                )
                                                                            ) {
                                                                                return;
                                                                            }

                                                                            router.delete(
                                                                                `/booking/my-bookings/${booking.id}/reject`,
                                                                                {
                                                                                    preserveScroll: true,
                                                                                },
                                                                            );
                                                                        }}
                                                                        className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-red-200 bg-white px-3 py-2 text-[11px] font-bold text-[#b91c1c] transition hover:bg-red-50 disabled:cursor-not-allowed disabled:border-neutral-200 disabled:bg-neutral-100 disabled:text-neutral-400 sm:w-auto"
                                                                    >
                                                                        <XCircle
                                                                            size={
                                                                                14
                                                                            }
                                                                        />
                                                                        Reject
                                                                        Booking
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        )}

                                                    {/* User Cancel Booking */}
                                                    {!isAdmin &&
                                                        booking.status ===
                                                            "pending" &&
                                                        !booking.payment_proof && (
                                                            <div className="col-span-2 flex justify-end border-t border-neutral-100 pt-3 sm:col-span-2 sm:ml-auto sm:border-0 sm:pt-0">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => {
                                                                        if (
                                                                            !window.confirm(
                                                                                `Cancel booking ${booking.booking_reference}? This action cannot be undone.`,
                                                                            )
                                                                        ) {
                                                                            return;
                                                                        }

                                                                        router.delete(
                                                                            `/booking/my-bookings/${booking.id}/cancel`,
                                                                            {
                                                                                preserveScroll: true,
                                                                            },
                                                                        );
                                                                    }}
                                                                    className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-red-200 bg-white px-3 py-2 text-[11px] font-bold text-[#b91c1c] transition hover:bg-red-50 sm:w-auto"
                                                                >
                                                                    <XCircle
                                                                        size={
                                                                            14
                                                                        }
                                                                    />
                                                                    Cancel
                                                                    Booking
                                                                </button>
                                                            </div>
                                                        )}

                                                    {/* Pending Payment Notice / User Upload */}
                                                    {booking.status ===
                                                        "pending" &&
                                                        !booking.payment_proof && (
                                                            <div className="col-span-2 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2.5 sm:flex-1">
                                                                <div className="flex min-w-0 items-center gap-2">
                                                                    <Clock3
                                                                        size={
                                                                            14
                                                                        }
                                                                        className={
                                                                            isAdmin
                                                                                ? "shrink-0 text-blue-600"
                                                                                : "shrink-0 text-amber-600"
                                                                        }
                                                                    />
                                                                    <span className="text-[10px] font-medium text-neutral-600">
                                                                        {isAdmin
                                                                            ? "Waiting for payment receipt"
                                                                            : "Payment proof required"}
                                                                    </span>
                                                                </div>

                                                                {!isAdmin && (
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => {
                                                                            setSelectedBooking(
                                                                                booking,
                                                                            );
                                                                            setPaymentProof(
                                                                                null,
                                                                            );
                                                                        }}
                                                                        className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-md bg-[#b91c1c] px-3 py-2 text-[10px] font-bold text-white transition hover:bg-[#991b1b]"
                                                                    >
                                                                        <Receipt
                                                                            size={
                                                                                12
                                                                            }
                                                                        />
                                                                        Upload
                                                                        Proof
                                                                    </button>
                                                                )}
                                                            </div>
                                                        )}

                                                    {/* Awaiting Confirmation */}
                                                    {!isAdmin &&
                                                        booking.payment_proof &&
                                                        booking.payment_status ===
                                                            "awaiting_confirmation" && (
                                                            <div className="col-span-2 flex items-center gap-2 text-[10px] font-medium text-blue-700 sm:col-span-1">
                                                                <Clock3
                                                                    size={13}
                                                                />
                                                                Awaiting
                                                                verification
                                                            </div>
                                                        )}

                                                    {/* Cancel / Reject Booking */}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </main>
            </div>

            {/* Upload Payment Proof Modal */}
            {selectedBooking && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
                    onClick={() => {
                        setSelectedBooking(null);
                        setPaymentProof(null);
                    }}
                >
                    <div
                        className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl"
                        onClick={(event) => event.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="flex items-center justify-between border-b border-neutral-200 px-5 py-4">
                            <div>
                                <h3 className="text-sm font-bold text-neutral-900">
                                    Upload Payment Proof
                                </h3>

                                <p className="mt-0.5 text-[11px] text-neutral-500">
                                    {selectedBooking.booking_reference}
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() => {
                                    setSelectedBooking(null);
                                    setPaymentProof(null);
                                }}
                                className="flex h-8 w-8 items-center justify-center rounded-full text-xl text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-900"
                                aria-label="Close upload payment proof"
                            >
                                ×
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="space-y-4 p-5">
                            {/* Booking Reference */}
                            <div>
                                <p className="text-xs font-semibold text-neutral-600">
                                    Booking Reference
                                </p>

                                <p className="mt-1 text-sm font-bold tracking-wide text-neutral-900">
                                    {selectedBooking.booking_reference}
                                </p>
                            </div>

                            {/* Total */}
                            <div>
                                <p className="text-xs font-semibold text-neutral-600">
                                    Total Amount
                                </p>

                                <p className="mt-1 text-lg font-black text-[#b0002a]">
                                    {formatCurrency(selectedBooking.total)}
                                </p>
                            </div>

                            {/* File Upload */}
                            <div>
                                <label
                                    htmlFor="payment-proof"
                                    className="text-xs font-semibold text-neutral-700"
                                >
                                    Payment Receipt
                                </label>

                                <input
                                    id="payment-proof"
                                    type="file"
                                    accept="image/*"
                                    onChange={(event) => {
                                        setPaymentProof(
                                            event.target.files?.[0] ?? null,
                                        );
                                    }}
                                    className="mt-2 block w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-xs text-neutral-700 file:mr-3 file:rounded-md file:border-0 file:bg-[#b0002a] file:px-3 file:py-1.5 file:text-xs file:font-bold file:text-white hover:file:bg-[#920024]"
                                />

                                {paymentProof && (
                                    <p className="mt-2 text-[11px] text-neutral-500">
                                        Selected: {paymentProof.name}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="flex justify-end gap-2 border-t border-neutral-200 px-5 py-4">
                            <button
                                type="button"
                                onClick={() => {
                                    setSelectedBooking(null);
                                    setPaymentProof(null);
                                }}
                                className="rounded-lg border border-neutral-200 bg-white px-4 py-2 text-xs font-bold text-neutral-700 transition hover:bg-neutral-50"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                disabled={!paymentProof}
                                onClick={() => {
                                    if (!paymentProof || !selectedBooking)
                                        return;

                                    router.post(
                                        "/booking/my-bookings/payment-proof",
                                        {
                                            booking_id: selectedBooking.id,
                                            payment_proof: paymentProof,
                                        },
                                        {
                                            forceFormData: true,
                                            onSuccess: () => {
                                                setSelectedBooking(null);
                                                setPaymentProof(null);
                                            },
                                        },
                                    );
                                }}
                                className="rounded-lg bg-[#b0002a] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#920024] disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                Upload Payment Proof
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Payment Proof Modal */}
            {selectedProof && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
                    onClick={() => setSelectedProof(null)}
                >
                    <div
                        className="relative w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl"
                        onClick={(event) => event.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="flex items-center justify-between border-b border-neutral-200 px-4 py-3 sm:px-5">
                            <div>
                                <h3 className="text-sm font-bold text-neutral-900">
                                    Payment Proof
                                </h3>

                                <p className="mt-0.5 text-[11px] text-neutral-500">
                                    Uploaded payment receipt
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() => setSelectedProof(null)}
                                className="flex h-8 w-8 items-center justify-center rounded-full text-xl text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-900"
                                aria-label="Close payment proof"
                            >
                                ×
                            </button>
                        </div>

                        {/* Image */}
                        <div className="flex max-h-[75vh] items-center justify-center overflow-auto bg-neutral-100 p-3 sm:p-5">
                            <img
                                src={selectedProof}
                                alt="Payment proof"
                                className="max-h-[70vh] max-w-full rounded-lg object-contain"
                            />
                        </div>

                        {/* Modal Footer */}
                        <div className="flex justify-end border-t border-neutral-200 px-4 py-3 sm:px-5">
                            <button
                                type="button"
                                onClick={() => setSelectedProof(null)}
                                className="rounded-lg bg-[#b0002a] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#920024]"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
