import { Link } from "@inertiajs/react";
import { ArrowRight, CalendarDays, Users, Trophy } from "lucide-react";

import Reveal from "@/components/court_avenue/Reveal";

export default function Hero() {
    return (
        <section
            id="home"
            className="relative flex min-h-[calc(100svh-64px)] items-center overflow-hidden sm:min-h-[calc(100svh-80px)]"
        >
            {/* Background */}
            <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                    backgroundImage: "url('/images/court_avenue/court.jpg')",
                }}
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/50" />

            {/* Content */}
            <div className="relative mx-auto flex w-full max-w-7xl items-center px-5 py-8 sm:px-6 sm:py-10 lg:px-8">
                <div className="w-full max-w-3xl text-white">
                    {/* Badge */}
                    <Reveal direction="up" delay={0.05}>
                        <span className="mb-4 inline-flex rounded-full bg-[#013CAA] px-3 py-1.5 text-xs font-semibold backdrop-blur sm:mb-5 sm:px-4 sm:py-2 sm:text-sm">
                            Pickleball • Lounge • Good Vibes
                        </span>
                    </Reveal>

                    {/* Heading */}
                    <Reveal direction="up" delay={0.12}>
                        <h1 className="text-[3rem] font-black leading-[0.9] tracking-tight sm:text-6xl md:text-7xl lg:text-[5.5rem]">
                            Play.
                            <br />
                            Connect.
                            <br />
                            <span className="text-[#ffff]">Unwind.</span>
                        </h1>
                    </Reveal>

                    {/* Description */}
                    <Reveal direction="up" delay={0.2}>
                        <p className="mt-5 max-w-xl text-sm  leading-6 text-white/85 sm:mt-6 sm:text-base sm:leading-7 lg:text-lg lg:leading-8">
                            Book your court, meet new players, join tournaments,
                            and enjoy the ultimate pickleball experience at
                            Court Avenue.
                        </p>
                    </Reveal>

                    {/* Buttons */}
                    <Reveal direction="up" delay={0.28}>
                        <div className="mt-6 flex flex-col gap-3 sm:mt-7 sm:flex-row sm:gap-4">
                            <Link
                                href="/booking"
                                className="inline-flex w-full items-center justify-center gap-3 rounded-full bg-[#b0002a] px-7 py-3 font-bold text-white transition hover:bg-[#8e0023] active:scale-[0.98] sm:w-auto sm:px-8 sm:py-3.5"
                            >
                                Book a Court
                                <ArrowRight size={19} />
                            </Link>

                            <a
                                href="#courts"
                                className="inline-flex w-full items-center justify-center rounded-full border border-white/60 bg-white/10 px-7 py-3 font-bold backdrop-blur transition hover:bg-white hover:text-black active:scale-[0.98] sm:w-auto sm:px-8 sm:py-3.5"
                            >
                                Explore Courts
                            </a>
                        </div>
                    </Reveal>

                    {/* Features */}
                    <Reveal direction="up" delay={0.36}>
                        <div className="mt-7 grid max-w-lg grid-cols-3 gap-3 sm:mt-9 sm:gap-5">
                            {/* Easy Booking */}
                            <div className="flex flex-col items-center gap-1.5 text-center sm:flex-row sm:gap-2 sm:text-left">
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 backdrop-blur sm:h-9 sm:w-9">
                                    <CalendarDays size={16} />
                                </div>

                                <div>
                                    <p className="text-[11px] font-bold sm:text-xs lg:text-sm">
                                        Easy Booking
                                    </p>

                                    <p className="hidden text-xs text-white/60 sm:block">
                                        Book anytime
                                    </p>
                                </div>
                            </div>

                            {/* Community */}
                            <div className="flex flex-col items-center gap-1.5 text-center sm:flex-row sm:gap-2 sm:text-left">
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 backdrop-blur sm:h-9 sm:w-9">
                                    <Users size={16} />
                                </div>

                                <div>
                                    <p className="text-[11px] font-bold sm:text-xs lg:text-sm">
                                        Community
                                    </p>

                                    <p className="hidden text-xs text-white/60 sm:block">
                                        Meet players
                                    </p>
                                </div>
                            </div>

                            {/* Tournaments */}
                            <div className="flex flex-col items-center gap-1.5 text-center sm:flex-row sm:gap-2 sm:text-left">
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 backdrop-blur sm:h-9 sm:w-9">
                                    <Trophy size={16} />
                                </div>

                                <div>
                                    <p className="text-[11px] font-bold sm:text-xs lg:text-sm">
                                        Tournaments
                                    </p>

                                    <p className="hidden text-xs text-white/60 sm:block">
                                        Compete & win
                                    </p>
                                </div>
                            </div>
                        </div>
                    </Reveal>
                </div>
            </div>
        </section>
    );
}
