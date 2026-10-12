import { Link } from "@inertiajs/react";
import { Facebook, Instagram, MapPin, Phone, Mail } from "lucide-react";

export default function Footer() {
    return (
        <footer id="contact" className="scroll-mt-20 bg-neutral-950 text-white">
            <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
                <div className="grid grid-cols-1 gap-9 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-10 lg:grid-cols-4 lg:gap-10">
                    {/* Brand */}
                    <div className="flex min-w-0 flex-col items-center text-center sm:items-start sm:text-left">
                        <Link
                            href="/"
                            aria-label="Court Avenue homepage"
                            className="inline-flex"
                        >
                            <img
                                src="/header.png"
                                alt="Court Avenue"
                                className="h-auto w-28 max-w-full object-contain sm:w-32 lg:w-36"
                            />
                        </Link>

                        <p className="mt-4 max-w-xs text-sm leading-6 text-white/60">
                            Your Game. Your Court. Your Avenue.
                            <br />
                            Your pickleball destination.
                        </p>

                        <div className="mt-5 flex items-center justify-center gap-3 sm:justify-start">
                            <a
                                href="https://www.facebook.com/profile.php?id=61593608975376"
                                aria-label="Facebook"
                                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white/70 transition-colors duration-200 hover:bg-[#b91c1c] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                            >
                                <Facebook size={18} />
                            </a>

                            <a
                                href="#"
                                aria-label="Instagram"
                                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white/70 transition-colors duration-200 hover:bg-[#b91c1c] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                            >
                                <Instagram size={18} />
                            </a>
                        </div>
                    </div>

                    {/* Explore */}
                    <div className="min-w-0 text-center sm:text-left">
                        <h3 className="text-sm font-bold tracking-wide text-white">
                            Explore
                        </h3>

                        <div className="mt-4 flex flex-col items-center gap-3 text-sm text-white/60 sm:items-start">
                            <Link
                                href="/booking"
                                className="transition-colors hover:text-white focus-visible:text-white"
                            >
                                Book a Court
                            </Link>

                            <Link
                                href="#tournaments"
                                className="transition-colors hover:text-white focus-visible:text-white"
                            >
                                Tournaments
                            </Link>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="min-w-0 text-center sm:text-left">
                        <h3 className="text-sm font-bold tracking-wide text-white">
                            Quick Links
                        </h3>

                        <div className="mt-4 flex flex-col items-center gap-3 text-sm text-white/60 sm:items-start">
                            <a
                                href="#courts"
                                className="transition-colors hover:text-white focus-visible:text-white"
                            >
                                Courts
                            </a>

                            <a
                                href="#about"
                                className="transition-colors hover:text-white focus-visible:text-white"
                            >
                                About Us
                            </a>

                            <a
                                href="#contact"
                                className="transition-colors hover:text-white focus-visible:text-white"
                            >
                                Contact
                            </a>
                        </div>
                    </div>

                    {/* Contact */}
                    <div className="min-w-0 text-center sm:text-left">
                        <h3 className="text-sm font-bold tracking-wide text-white">
                            Contact
                        </h3>

                        <div className="mt-4 space-y-4 text-sm leading-6 text-white/60">
                            <div className="flex min-w-0 items-start justify-center gap-3 sm:justify-start">
                                <MapPin
                                    size={17}
                                    className="mt-1 shrink-0 text-white/80"
                                />
                                <span className="min-w-0 break-words [overflow-wrap:anywhere]">
                                    1010 JA Clarin street, Purok 2, Dao
                                    District, Tagbilaran City, Philippines, 6300
                                </span>
                            </div>

                            <a
                                href="tel:+639000000000"
                                className="flex min-w-0 items-start justify-center gap-3 transition-colors hover:text-white sm:justify-start"
                            >
                                <Phone
                                    size={17}
                                    className="mt-1 shrink-0 text-white/80"
                                />
                                <span className="min-w-0 break-words">
                                    +63 900 000 0000
                                </span>
                            </a>

                            <a
                                href="mailto:courtavenue2026@gmail.com"
                                className="flex min-w-0 items-start justify-center gap-3 transition-colors hover:text-white sm:justify-start"
                            >
                                <Mail
                                    size={17}
                                    className="mt-1 shrink-0 text-white/80"
                                />
                                <span className="min-w-0 break-all [overflow-wrap:anywhere]">
                                    courtavenue2026@gmail.com
                                </span>
                            </a>
                        </div>
                    </div>
                </div>

                {/* Copyright */}
                <div className="mt-9 border-t border-white/10 pt-5 text-center sm:mt-12 sm:pt-6 lg:mt-14 lg:text-left">
                    <p className="text-xs leading-5 text-white/40 sm:text-sm">
                        © {new Date().getFullYear()} Court Avenue. All rights
                        reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
