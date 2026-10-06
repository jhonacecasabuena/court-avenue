import { Link } from "@inertiajs/react";
import { Facebook, Instagram, MapPin, Phone, Mail } from "lucide-react";

export default function Footer() {
    return (
        <footer id="contact" className="bg-neutral-950 text-white">
            <div className="mx-auto max-w-7xl px-5 py-12 sm:px-6 sm:py-16">
                <div className="grid gap-10 md:grid-cols-2 md:gap-12 lg:grid-cols-4">
                    {/* Brand */}
                    <div className="text-center md:text-left">
                        <div className="flex justify-center md:justify-start">
                            <img
                                src="/header.png"
                                alt="Court Avenue"
                                className="h-auto w-32 sm:w-36"
                            />
                        </div>

                        <p className="mt-4 text-sm leading-6 text-white/50">
                            Play. Connect. Unwind.
                            <br />
                            Your pickleball destination.
                        </p>

                        <div className="mt-5 flex justify-center gap-3 md:justify-start">
                            <a
                                href="#"
                                aria-label="Facebook"
                                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white/70 transition hover:bg-white/20 hover:text-white"
                            >
                                <Facebook size={18} />
                            </a>

                            <a
                                href="#"
                                aria-label="Instagram"
                                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white/70 transition hover:bg-white/20 hover:text-white"
                            >
                                <Instagram size={18} />
                            </a>
                        </div>
                    </div>

                    {/* Explore */}
                    <div>
                        <h3 className="text-center text-sm font-bold md:text-left">
                            Explore
                        </h3>

                        <div className="mt-4 flex flex-col items-center gap-3 text-sm text-white/50 md:items-start">
                            <Link
                                href="/booking"
                                className="transition hover:text-white"
                            >
                                Book a Court
                            </Link>

                            <Link
                                href="/tournaments"
                                className="transition hover:text-white"
                            >
                                Tournaments
                            </Link>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-center text-sm font-bold md:text-left">
                            Quick Links
                        </h3>

                        <div className="mt-4 flex flex-col items-center gap-3 text-sm text-white/50 md:items-start">
                            <a
                                href="#courts"
                                className="transition hover:text-white"
                            >
                                Courts
                            </a>

                            <a
                                href="#about"
                                className="transition hover:text-white"
                            >
                                About Us
                            </a>

                            <a
                                href="#contact"
                                className="transition hover:text-white"
                            >
                                Contact
                            </a>
                        </div>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-center text-sm font-bold md:text-left">
                            Contact
                        </h3>

                        <div className="mt-4 space-y-3 text-sm text-white/50">
                            <div className="flex items-center justify-center gap-3 md:justify-start">
                                <MapPin size={17} className="shrink-0" />
                                <span>Philippines</span>
                            </div>

                            <div className="flex items-center justify-center gap-3 md:justify-start">
                                <Phone size={17} className="shrink-0" />
                                <span>+63 900 000 0000</span>
                            </div>

                            <div className="flex items-center justify-center gap-3 md:justify-start">
                                <Mail size={17} className="shrink-0" />
                                <span>hello@courtavenue.com</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Copyright */}
                <div className="mt-10 border-t border-white/10 pt-6 text-center text-xs text-white/40 sm:mt-14 sm:pt-7 sm:text-sm md:text-left">
                    © {new Date().getFullYear()} Court Avenue. All rights
                    reserved.
                </div>
            </div>
        </footer>
    );
}
