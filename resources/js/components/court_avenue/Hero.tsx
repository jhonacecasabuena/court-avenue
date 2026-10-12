import { Link, usePage } from "@inertiajs/react";
import { CalendarDays, Users, Trophy, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

import Reveal from "@/components/court_avenue/Reveal";
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
export default function Hero() {
    const { auth } = usePage<PageProps>().props;

    const welcomeText = "Welcome to Court Avenue!";
    const [typedText, setTypedText] = useState("");

    useEffect(() => {
        let index = 0;

        const interval = setInterval(() => {
            index++;
            setTypedText(welcomeText.slice(0, index));

            if (index >= welcomeText.length) {
                clearInterval(interval);
            }
        }, 80);

        return () => clearInterval(interval);
    }, []);

    return (
        <section
            id="home"
            className="relative isolate flex min-h-[calc(100svh-72px)] scroll-mt-[72px] items-center overflow-hidden bg-neutral-950 sm:min-h-[calc(100svh-78px)]"
        >
            {/* Background image */}
            <div
                className="absolute inset-0 -z-20 bg-cover bg-[center_55%] sm:bg-center"
                style={{
                    backgroundImage: "url('/images/court_avenue/court2.jpg')",
                }}
            />

            {/* Responsive overlay */}
            <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/80 via-black/55 to-black/30 sm:from-black/75 sm:via-black/50 sm:to-black/25" />

            {/* Bottom contrast for mobile */}
            <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/35 via-transparent to-black/10" />

            {/* Content */}
            <div className="mx-auto flex w-full max-w-7xl items-center px-4 py-12 sm:px-6 sm:py-16 md:py-20 lg:px-8 lg:py-24">
                <div className="w-full max-w-3xl text-white">
                    {/* Welcome badge */}
                    <Reveal direction="up" delay={0.05}>
                        <div className="mb-6 sm:mb-7">
                            <span className="inline-flex max-w-full items-center gap-2 rounded-full border border-white/25 bg-black/25 px-3 py-2 text-[10px] font-bold tracking-[0.1em] text-white shadow-sm backdrop-blur-md transition-colors duration-300 hover:bg-black/40 xs:px-4 sm:gap-2.5 sm:px-5 sm:py-2.5 sm:text-xs md:text-sm">
                                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#b0002a] text-white sm:h-6 sm:w-6">
                                    <Sparkles size={13} strokeWidth={2.5} />
                                </span>

                                <span className="min-w-0">
                                    {typedText}
                                    <span
                                        className="ml-0.5 inline-block h-3 w-[2px] animate-pulse bg-white align-middle sm:h-3.5"
                                        aria-hidden="true"
                                    />
                                </span>
                            </span>
                        </div>
                    </Reveal>

                    {/* Main heading */}
                    <Reveal direction="up" delay={0.12}>
                        <h1 className="max-w-3xl text-[clamp(2.5rem,8vw,5rem)] font-black leading-[0.98] tracking-[-0.045em] [text-shadow:0_2px_8px_rgba(0,0,0,0.3)]">
                            Your Game.
                            <br />
                            Your Court.
                            <br />
                            <span className="text-white">Your Avenue.</span>
                        </h1>
                    </Reveal>

                    {/* Description */}
                    <Reveal direction="up" delay={0.2}>
                        <p className="mt-5 max-w-xl text-sm leading-6 text-white [text-shadow:0_1px_3px_rgba(0,0,0,0.65)] sm:mt-6 sm:text-base sm:leading-7 md:text-lg md:leading-8">
                            We’re here to bring players together, build a strong
                            pickleball community, and create a court where
                            everyone is welcome to play, compete, connect, and
                            have fun.
                        </p>
                    </Reveal>

                    {/* Call-to-action buttons */}
                    <Reveal direction="up" delay={0.28}>
                        <div className="mt-7 grid w-full max-w-md grid-cols-1 gap-3 min-[400px]:grid-cols-2 sm:mt-8 sm:flex sm:max-w-none sm:flex-row sm:gap-4">
                            <Link
                                href="/booking"
                                className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-[#b0002a] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-black/15 transition duration-200 hover:bg-[#920024] active:scale-[0.98] sm:w-auto sm:px-7 sm:text-base"
                            >
                                <CalendarDays
                                    size={17}
                                    className="mr-2 shrink-0"
                                />
                                Book a Court
                            </Link>

                            {!auth.user && (
                                <Link
                                    href="/register"
                                    className="inline-flex min-h-12 w-full items-center justify-center rounded-full border border-white/60 bg-white/10 px-5 py-3 text-sm font-bold text-white backdrop-blur-sm transition duration-200 hover:bg-white hover:text-neutral-900 active:scale-[0.98] sm:w-auto sm:px-7 sm:text-base"
                                >
                                    Create an account
                                </Link>
                            )}
                        </div>
                    </Reveal>

                    {/* Feature highlights */}
                    <Reveal direction="up" delay={0.36}>
                        <div className="mt-9 grid max-w-2xl grid-cols-3 gap-2 border-t border-white/20 pt-5 sm:mt-11 sm:gap-5 sm:pt-6">
                            {/* Easy booking */}
                            <div className="flex min-w-0 flex-col items-center gap-2 text-center min-[480px]:flex-row min-[480px]:items-center min-[480px]:text-left sm:gap-3">
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/10 backdrop-blur-sm sm:h-11 sm:w-11">
                                    <CalendarDays
                                        size={17}
                                        className="sm:h-5 sm:w-5"
                                    />
                                </div>

                                <div className="min-w-0">
                                    <p className="text-[10px] font-bold leading-tight sm:text-xs md:text-sm">
                                        Easy Booking
                                    </p>
                                    <p className="mt-1 hidden text-xs text-white/75 md:block">
                                        Book anytime
                                    </p>
                                </div>
                            </div>

                            {/* Community */}
                            <div className="flex min-w-0 flex-col items-center gap-2 text-center min-[480px]:flex-row min-[480px]:items-center min-[480px]:text-left sm:gap-3">
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/10 backdrop-blur-sm sm:h-11 sm:w-11">
                                    <Users
                                        size={17}
                                        className="sm:h-5 sm:w-5"
                                    />
                                </div>

                                <div className="min-w-0">
                                    <p className="text-[10px] font-bold leading-tight sm:text-xs md:text-sm">
                                        Community
                                    </p>
                                    <p className="mt-1 hidden text-xs text-white/75 md:block">
                                        Meet players
                                    </p>
                                </div>
                            </div>

                            {/* Tournaments */}
                            <div className="flex min-w-0 flex-col items-center gap-2 text-center min-[480px]:flex-row min-[480px]:items-center min-[480px]:text-left sm:gap-3">
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/10 backdrop-blur-sm sm:h-11 sm:w-11">
                                    <Trophy
                                        size={17}
                                        className="sm:h-5 sm:w-5"
                                    />
                                </div>

                                <div className="min-w-0">
                                    <p className="text-[10px] font-bold leading-tight sm:text-xs md:text-sm">
                                        Tournaments
                                    </p>
                                    <p className="mt-1 hidden text-xs text-white/75 md:block">
                                        Compete &amp; win
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

// import { Link } from "@inertiajs/react";
// import {
//     ArrowRight,
//     CalendarDays,
//     Users,
//     Trophy,
//     Sparkles,
//     User,
// } from "lucide-react";

// import Reveal from "@/components/court_avenue/Reveal";
// import { useEffect, useState } from "react";

// export default function Hero() {
//     const welcomeText = "Welcome to Court Avenue!";
//     const [typedText, setTypedText] = useState("");

//     useEffect(() => {
//         let index = 0;

//         const interval = setInterval(() => {
//             index++;
//             setTypedText(welcomeText.slice(0, index));

//             if (index >= welcomeText.length) {
//                 clearInterval(interval);
//             }
//         }, 80);

//         return () => clearInterval(interval);
//     }, []);

//     return (
//         <section
//             id="home"
//             className="relative flex min-h-[calc(100svh-64px)] items-center overflow-hidden sm:min-h-[calc(100svh-80px)]"
//         >
//             {/* Background */}
//             <div
//                 className="absolute inset-0 bg-cover bg-center"
//                 style={{
//                     backgroundImage: "url('/images/court_avenue/court2.jpg')",
//                 }}
//             />

//             {/* Overlay */}
//             <div className="absolute inset-0 bg-black/50" />

//             {/* Content */}
//             <div className="relative mx-auto flex w-full max-w-7xl items-center px-5 py-8 sm:px-6 sm:py-10 lg:px-8">
//                 <div className="w-full max-w-3xl text-white">
//                     {/* Badge */}
//                     <Reveal direction="up" delay={0.05}>
//                         <span className="mb-8 sm:mb-5 inline-flex items-center gap-2 rounded-full border border-red-200/60 bg-[#b0002a]/10 px-4 py-2 text-xs font-bold tracking-[0.12em] text-white shadow-sm backdrop-blur-md transition-all duration-300 hover:border-[#b0002a]/30 hover:bg-[#b0002a]/15 sm:mb-5 sm:px-5 sm:py-2.5 sm:text-sm">
//                             <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#b0002a] text-white">
//                                 <Sparkles size={12} strokeWidth={2.5} />
//                             </span>

//                             <span>
//                                 {typedText}
//                                 <span className="ml-0.5 inline-block h-3.5 w-[2px] animate-pulse bg-white align-middle" />
//                             </span>
//                         </span>
//                     </Reveal>

//                     {/* Heading */}
//                     <Reveal direction="up" delay={0.12}>
//                         <h1 className="text-[2rem] font-black leading-[0.9] tracking-tight sm:text-6xl md:text-7xl lg:text-[4.5rem]">
//                             Your Game.
//                             <br />
//                             Your Court.
//                             <br />
//                             <span className="text-[#ffff]">Your Avenue.</span>
//                         </h1>
//                     </Reveal>

//                     {/* Description */}
//                     <Reveal direction="up" delay={0.2}>
//                         <p className="mt-5 max-w-xl text-md leading-6 text-white [text-shadow:0_1px_3px_rgba(0,0,0,0.45)] sm:mt-6 sm:text-base sm:leading-7 lg:text-lg lg:leading-8">
//                             We’re here to bring players together, build a strong
//                             pickleball community, and create a court where
//                             everyone is welcome to play, compete, connect, and
//                             have fun.
//                         </p>
//                     </Reveal>

//                     {/* Buttons */}
//                     <Reveal direction="up" delay={0.28}>
//                         <div className="mt-6 flex flex-col gap-3 sm:mt-7 sm:flex-row sm:gap-4">
//                             <Link
//                                 href="/booking"
//                                 className="inline-flex w-full items-center justify-center gap-3 rounded-full bg-[#b0002a] px-7 py-3 font-bold text-white transition hover:bg-[#8e0023] active:scale-[0.98] sm:w-auto sm:px-8 sm:py-3.5"
//                             >
//                                 Book a Court
//                             </Link>
//                             <Link
//                                 href="/booking"
//                                 className="inline-flex w-full items-center justify-center rounded-full border border-white/60 bg-white/10 px-7 py-3 font-bold backdrop-blur transition hover:bg-white hover:text-black active:scale-[0.98] sm:w-auto sm:px-8 sm:py-3.5"
//                             >
//                                 Create an account
//                             </Link>
//                         </div>
//                     </Reveal>

//                     {/* Features */}
//                     <Reveal direction="up" delay={0.36}>
//                         <div className="mt-7 grid max-w-lg grid-cols-3 gap-3 sm:mt-9 sm:gap-5">
//                             {/* Easy Booking */}
//                             <div className="flex flex-col items-center gap-1.5 text-center sm:flex-row sm:gap-2 sm:text-left">
//                                 <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 backdrop-blur sm:h-9 sm:w-9">
//                                     <CalendarDays size={16} />
//                                 </div>

//                                 <div>
//                                     <p className="text-[11px] font-bold sm:text-xs lg:text-sm">
//                                         Easy Booking
//                                     </p>

//                                     <p className="hidden text-xs text-white/60 sm:block">
//                                         Book anytime
//                                     </p>
//                                 </div>
//                             </div>

//                             {/* Community */}
//                             <div className="flex flex-col items-center gap-1.5 text-center sm:flex-row sm:gap-2 sm:text-left">
//                                 <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 backdrop-blur sm:h-9 sm:w-9">
//                                     <Users size={16} />
//                                 </div>

//                                 <div>
//                                     <p className="text-[11px] font-bold sm:text-xs lg:text-sm">
//                                         Community
//                                     </p>

//                                     <p className="hidden text-xs text-white/60 sm:block">
//                                         Meet players
//                                     </p>
//                                 </div>
//                             </div>

//                             {/* Tournaments */}
//                             <div className="flex flex-col items-center gap-1.5 text-center sm:flex-row sm:gap-2 sm:text-left">
//                                 <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 backdrop-blur sm:h-9 sm:w-9">
//                                     <Trophy size={16} />
//                                 </div>

//                                 <div>
//                                     <p className="text-[11px] font-bold sm:text-xs lg:text-sm">
//                                         Tournaments
//                                     </p>

//                                     <p className="hidden text-xs text-white/60 sm:block">
//                                         Compete & win
//                                     </p>
//                                 </div>
//                             </div>
//                         </div>
//                     </Reveal>
//                 </div>
//             </div>
//         </section>
//     );
// }
