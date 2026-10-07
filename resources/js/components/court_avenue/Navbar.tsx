import { Link, router, usePage } from "@inertiajs/react";
import { AnimatePresence, motion } from "motion/react";
import {
    CalendarDays,
    ChevronDown,
    ClipboardList,
    LogOut,
    Menu,
    X,
} from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

type AuthUser = {
    id: number;
    name: string;
    email: string;
    role: string | null;
};

type PageProps = {
    auth: {
        user: AuthUser | null;
    };
};

const navItems = [
    {
        label: "Courts",
        href: "#courts",
    },
    {
        label: "Tournaments",
        href: "#tournaments",
    },
    {
        label: "About",
        href: "#about",
    },
    {
        label: "Contact",
        href: "#contact",
    },
];

export default function Navbar() {
    const [open, setOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);

    const { auth } = usePage<PageProps>().props;
    const user = auth.user;
    const initials = user
        ? user.name
              .trim()
              .split(/\s+/)
              .slice(0, 2)
              .map((part) => part.charAt(0).toUpperCase())
              .join("")
        : "";

    const closeMenu = () => {
        setOpen(false);
        setUserMenuOpen(false);
    };

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
    return (
        <header className="sticky top-0 z-50 border-b border-neutral-200/80 bg-white/95 backdrop-blur-xl">
            <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:h-[78px] lg:px-8">
                {/* =====================================================
                    LOGO
                ====================================================== */}
                <Link
                    href="/"
                    onClick={closeMenu}
                    className="group flex shrink-0 items-center"
                >
                    <img
                        src="/logo.jpg"
                        alt="Court Avenue"
                        className="w-[118px] transition duration-200 group-hover:opacity-90 sm:w-[130px]"
                    />
                </Link>

                {/* =====================================================
                    DESKTOP NAVIGATION
                ====================================================== */}
                <nav className="hidden h-full items-center lg:flex">
                    <div className="ml-10 flex h-full items-center gap-1 xl:ml-16 xl:gap-2">
                        {navItems.map((item) => (
                            <a
                                key={item.href}
                                href={item.href}
                                className="group relative flex h-full items-center px-4 text-[14px] font-semibold text-neutral-600 transition-colors duration-200 hover:text-[#b0002a]"
                            >
                                {item.label}

                                {/* Active / hover indicator */}
                                <span className="absolute bottom-0 left-4 right-4 h-[2px] origin-center scale-x-0 rounded-full bg-[#b0002a] transition-transform duration-200 group-hover:scale-x-100" />
                            </a>
                        ))}
                    </div>
                </nav>

                {/* =====================================================
                    DESKTOP RIGHT SIDE
                ====================================================== */}
                <div className="hidden items-center gap-3 lg:flex">
                    {user ? (
                        <div className="relative">
                            {/* User Button */}
                            <button
                                type="button"
                                onClick={() =>
                                    setUserMenuOpen((value) => !value)
                                }
                                className="flex items-center gap-2.5 rounded-full border border-neutral-200 bg-white py-1.5 pl-1.5 pr-3 transition-all duration-200 hover:border-neutral-300 hover:shadow-sm"
                            >
                                {/* Avatar */}
                                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#b0002a] text-sm font-bold text-white">
                                    {initials}
                                </div>

                                <div className="hidden max-w-[150px] text-left xl:block">
                                    <p className="truncate text-sm font-semibold text-neutral-800">
                                        {user.name}
                                    </p>
                                </div>

                                <ChevronDown
                                    size={15}
                                    className={`text-neutral-500 transition-transform duration-200 ${
                                        userMenuOpen ? "rotate-180" : ""
                                    }`}
                                />
                            </button>

                            {/* User Dropdown */}
                            <AnimatePresence>
                                {userMenuOpen && (
                                    <motion.div
                                        initial={{
                                            opacity: 0,
                                            y: -6,
                                            scale: 0.98,
                                        }}
                                        animate={{
                                            opacity: 1,
                                            y: 0,
                                            scale: 1,
                                        }}
                                        exit={{
                                            opacity: 0,
                                            y: -6,
                                            scale: 0.98,
                                        }}
                                        transition={{ duration: 0.15 }}
                                        className="absolute right-0 top-[calc(100%+10px)] w-56 overflow-hidden rounded-2xl border border-neutral-200 bg-white p-2 shadow-xl shadow-neutral-900/10"
                                    >
                                        {/* User Info */}
                                        <div className="border-b border-neutral-100 px-3 py-3">
                                            <p className="truncate text-sm font-bold text-neutral-900">
                                                {user.name}
                                            </p>

                                            <p className="mt-0.5 truncate text-xs text-neutral-500">
                                                {user.email}
                                            </p>
                                        </div>

                                        {/* My Bookings */}
                                        <Link
                                            href="/booking/my-bookings"
                                            onClick={closeMenu}
                                            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-neutral-700 transition hover:bg-neutral-50 hover:text-[#b0002a]"
                                        >
                                            <ClipboardList size={17} />
                                            My Bookings
                                        </Link>

                                        {/* Logout */}
                                        <button
                                            type="button"
                                            onClick={handleLogout}
                                            className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-neutral-600 transition hover:bg-red-50 hover:text-[#b0002a]"
                                        >
                                            <LogOut size={17} />
                                            Logout
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ) : (
                        <Link
                            href="/login"
                            className="rounded-full px-4 py-2.5 text-sm font-semibold text-neutral-700 transition hover:text-[#b0002a]"
                        >
                            Log in
                        </Link>
                    )}

                    {/* Booking CTA */}
                    <Link
                        href="/booking"
                        className="inline-flex items-center gap-2 rounded-full bg-[#b0002a] px-5 py-2.5 text-sm font-bold text-white shadow-sm shadow-[#b0002a]/20 transition-all duration-200 hover:bg-[#920024] hover:shadow-md hover:shadow-[#b0002a]/25 active:scale-[0.98]"
                    >
                        <CalendarDays size={17} />
                        Book a Court
                    </Link>
                </div>

                {/* =====================================================
                    MOBILE ACTIONS
                ====================================================== */}
                <div className="flex items-center gap-2 lg:hidden">
                    {/* Mobile Login / User */}
                    {!user && (
                        <Link
                            href="/login"
                            className="rounded-full px-3.5 py-2 text-sm font-bold text-neutral-700 transition hover:text-[#b0002a] sm:px-4"
                        >
                            Log in
                        </Link>
                    )}

                    {user && (
                        <div className="relative">
                            <button
                                type="button"
                                onClick={() =>
                                    setUserMenuOpen((value) => !value)
                                }
                                aria-label="Open profile menu"
                                aria-expanded={userMenuOpen}
                                className="flex h-9 w-9 items-center justify-center rounded-full bg-[#b0002a] text-sm font-bold text-white transition hover:bg-[#920024] active:scale-95"
                            >
                                {initials}
                            </button>

                            <AnimatePresence>
                                {userMenuOpen && (
                                    <motion.div
                                        initial={{
                                            opacity: 0,
                                            y: -5,
                                            scale: 0.97,
                                        }}
                                        animate={{
                                            opacity: 1,
                                            y: 0,
                                            scale: 1,
                                        }}
                                        exit={{
                                            opacity: 0,
                                            y: -5,
                                            scale: 0.97,
                                        }}
                                        transition={{ duration: 0.15 }}
                                        className="absolute right-0 top-[calc(100%+10px)] z-50 w-48 overflow-hidden rounded-2xl border border-neutral-200 bg-white p-2 shadow-xl shadow-neutral-900/10"
                                    >
                                        {/* User info */}
                                        <div className="border-b border-neutral-100 px-3 py-3">
                                            <p className="truncate text-sm font-bold text-neutral-900">
                                                {user.name}
                                            </p>

                                            <p className="mt-0.5 truncate text-xs text-neutral-500">
                                                {user.email}
                                            </p>
                                        </div>

                                        {/* My Bookings */}
                                        <Link
                                            href="/booking/my-bookings"
                                            onClick={closeMenu}
                                            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-neutral-700 transition hover:bg-neutral-50 hover:text-[#b0002a]"
                                        >
                                            <ClipboardList size={17} />
                                            My Bookings
                                        </Link>

                                        {/* Logout */}
                                        <button
                                            type="button"
                                            onClick={handleLogout}
                                            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-neutral-600 transition hover:bg-red-50 hover:text-[#b0002a]"
                                        >
                                            <LogOut size={17} />
                                            Logout
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    )}

                    {/* Menu Button */}
                    <button
                        type="button"
                        onClick={() => setOpen((value) => !value)}
                        aria-label={open ? "Close menu" : "Open menu"}
                        aria-expanded={open}
                        className="flex h-10 w-10 items-center justify-center rounded-xl border border-neutral-200 text-neutral-800 transition hover:bg-neutral-50 active:scale-95"
                    >
                        {open ? <X size={21} /> : <Menu size={21} />}
                    </button>
                </div>
            </div>

            {/* =========================================================
                MOBILE MENU
            ========================================================== */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{
                            opacity: 0,
                            height: 0,
                        }}
                        animate={{
                            opacity: 1,
                            height: "auto",
                        }}
                        exit={{
                            opacity: 0,
                            height: 0,
                        }}
                        transition={{
                            duration: 0.2,
                            ease: "easeOut",
                        }}
                        className="overflow-hidden border-t border-neutral-200 bg-white lg:hidden"
                    >
                        <motion.div
                            initial={{ y: -8 }}
                            animate={{ y: 0 }}
                            exit={{ y: -8 }}
                            className="mx-auto max-w-7xl px-4 py-4 sm:px-6"
                        >
                            {/* Mobile navigation */}
                            <nav className="space-y-1">
                                {navItems.map((item) => (
                                    <a
                                        key={item.href}
                                        href={item.href}
                                        onClick={closeMenu}
                                        className="flex items-center rounded-xl px-4 py-3.5 text-[15px] font-semibold text-neutral-700 transition hover:bg-neutral-50 hover:text-[#b0002a]"
                                    >
                                        {item.label}
                                    </a>
                                ))}
                            </nav>

                            {/* Mobile divider */}
                            <div className="my-3 h-px bg-neutral-100" />

                            {/* Mobile booking */}
                            <Link
                                href="/booking"
                                onClick={closeMenu}
                                className="flex items-center justify-center gap-2 rounded-xl bg-[#b0002a] px-5 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#920024] active:scale-[0.98]"
                            >
                                <CalendarDays size={17} />
                                Book a Court
                            </Link>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
