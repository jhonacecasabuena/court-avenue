import { Link } from "@inertiajs/react";
import { ArrowLeft, Trophy } from "lucide-react";

import { home } from "@/routes";
import type { AuthLayoutProps } from "@/types";

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    return (
        <div className="min-h-svh bg-white">
            <div className="grid min-h-svh lg:grid-cols-2">
                <div className="relative hidden overflow-hidden bg-[#b91c1c] lg:flex">
                    <div className="absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full bg-white/10" />

                    <div className="absolute -bottom-48 -left-48 h-[600px] w-[600px] rounded-full bg-black/10" />

                    <div className="absolute inset-0 opacity-15">
                        <div className="absolute bottom-0 left-1/2 top-0 w-px bg-white" />

                        <div className="absolute left-0 right-0 top-1/2 h-px bg-white" />

                        <div className="absolute left-[15%] right-[15%] top-[25%] h-px bg-white" />

                        <div className="absolute left-[15%] right-[15%] top-[75%] h-px bg-white" />

                        <div className="absolute left-[15%] top-[25%] h-[50%] w-px bg-white" />

                        <div className="absolute right-[15%] top-[25%] h-[50%] w-px bg-white" />
                    </div>

                    <div className="relative z-10 flex min-h-svh w-full flex-col justify-between p-10 xl:p-14">
                        <Link
                            href={home()}
                            className="group flex w-fit items-center gap-3"
                        >
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-lg font-black text-[#b91c1c] shadow-lg transition-transform group-hover:scale-105">
                                <img
                                    src="/header.png"
                                    alt="Court Avenue"
                                    className="h-auto w-28 sm:w-32"
                                />
                            </div>

                            <div>
                                <div className="text-xl font-black tracking-tight text-white">
                                    COURT AVENUE
                                </div>

                                <div className="text-[10px] font-semibold uppercase tracking-[0.25em] text-white/70">
                                    Pickleball
                                </div>
                            </div>
                        </Link>

                        <div className="max-w-xl">
                            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm">
                                <Trophy className="h-4 w-4" />
                                Your game starts here
                            </div>

                            <h2 className="text-5xl font-black leading-[1.05] tracking-tight text-white xl:text-6xl">
                                Play more.
                                <br />
                                Book easier.
                                <br />
                                <span className="text-white/60">
                                    Stay connected.
                                </span>
                            </h2>

                            <p className="mt-6 max-w-lg text-base leading-7 text-white/75">
                                Welcome to Court Avenue — your place to discover
                                courts, book your games, and connect with the
                                pickleball community.
                            </p>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-white/60">
                            <span className="h-2 w-2 rounded-full bg-white" />
                            <span>Play. Book. Enjoy.</span>
                        </div>
                    </div>
                </div>

                {/* =====================================================
                    AUTH CONTENT
                ====================================================== */}
                <div className="relative flex min-h-svh items-center justify-center px-5 py-8 sm:px-10 sm:py-10 lg:px-12 xl:px-20">
                    <div className="w-full max-w-md">
                        {/* Mobile Logo */}
                        <div className="mb-6 flex justify-center lg:hidden sm:mb-8">
                            <Link
                                href={home()}
                                className="group flex items-center justify-center"
                            >
                                <img
                                    src="/header.png"
                                    alt="Court Avenue"
                                    className="h-auto w-36 transition-transform duration-200 group-hover:scale-105 sm:w-40"
                                />
                            </Link>
                        </div>

                        {/* Title / Description */}
                        <div className="mb-6 text-center sm:mb-8">
                            <h1 className="text-2xl font-black tracking-tight text-gray-950 sm:text-3xl">
                                {title}
                            </h1>

                            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-gray-500">
                                {description}
                            </p>
                        </div>

                        {children}

                        {/* Back to Court Avenue */}
                        <div className="mt-8 flex justify-center">
                            <Link
                                href={home()}
                                className="group inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition-colors hover:text-[#b91c1c]"
                            >
                                <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
                                Back to Home
                            </Link>
                        </div>
                        {/* Footer */}
                        <div className="mt-6 text-center text-[11px] text-gray-400 sm:mt-8 sm:text-xs">
                            © {new Date().getFullYear()} Court Avenue. All
                            rights reserved.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// import { Link } from "@inertiajs/react";
// import AppLogoIcon from "@/components/app-logo-icon";
// import { home } from "@/routes";
// import type { AuthLayoutProps } from "@/types";

// export default function AuthSimpleLayout({
//     children,
//     title,
//     description,
// }: AuthLayoutProps) {
//     return (
//         <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
//             <div className="w-full max-w-sm">
//                 <div className="flex flex-col gap-8">
//                     <div className="flex flex-col items-center gap-4">
//                         <Link
//                             href={home()}
//                             className="flex flex-col items-center gap-2 font-medium"
//                         >
//                             <div className="mb-1 flex h-9 w-9 items-center justify-center rounded-md">
//                                 <AppLogoIcon className="size-9 fill-current text-[var(--foreground)] dark:text-white" />
//                             </div>
//                             <span className="sr-only">{title}</span>dd
//                         </Link>

//                         <div className="space-y-2 text-center">
//                             <h1 className="text-xl font-medium">{title}</h1>
//                             <p className="text-center text-sm text-muted-foreground">
//                                 {description}
//                             </p>
//                         </div>
//                     </div>
//                     {children}
//                 </div>
//             </div>
//         </div>
//     );
// }
