import { Link } from "@inertiajs/react";
import { motion } from "motion/react";
import {
    ArrowRight,
    CheckCircle2,
    Clock3,
    Lightbulb,
    Users,
} from "lucide-react";

const courts = [
    {
        name: "Court 1",
        image: "/images/court_avenue/court.jpg",
        status: "Available",
        type: "Indoor Court",
        surface: "Professional Acrylic",
        capacity: "2-4 Players",
        rate: "₱350 / hour",
        lighting: "LED Lighting",
    },
    {
        name: "Court 2",
        image: "/images/court_avenue/court.jpg",
        status: "Available",
        type: "Indoor Court",
        surface: "Professional Acrylic",
        capacity: "2-4 Players",
        rate: "₱350 / hour",
        lighting: "LED Lighting",
    },
    {
        name: "Court 3",
        image: "/images/court_avenue/court.jpg",
        status: "Available",
        type: "Indoor Court",
        surface: "Professional Acrylic",
        capacity: "2-4 Players",
        rate: "₱350 / hour",
        lighting: "LED Lighting",
    },
    {
        name: "Court 4",
        image: "/images/court_avenue/court.jpg",
        status: "Available",
        type: "Indoor Court",
        surface: "Professional Acrylic",
        capacity: "2-4 Players",
        rate: "₱350 / hour",
        lighting: "LED Lighting",
    },
];

export default function CourtsPreview() {
    return (
        <section
            id="courts"
            className="relative overflow-hidden bg-neutral-50 py-20 sm:py-24"
        >
            {/* Background Decoration */}
            <div className="pointer-events-none absolute -right-32 top-20 h-80 w-80 rounded-full bg-[#b0002a]/5 blur-3xl" />

            <div className="pointer-events-none absolute -left-32 bottom-20 h-80 w-80 rounded-full bg-[#b0002a]/5 blur-3xl" />

            <div className="relative mx-auto max-w-7xl px-6">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.6 }}
                    className="flex flex-col justify-between gap-6 md:flex-row md:items-end"
                >
                    <div className="max-w-2xl">
                        <div className="flex items-center gap-3">
                            <span className="h-px w-8 bg-[#b0002a]" />

                            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#b0002a]">
                                Our Courts
                            </p>
                        </div>

                        <h2 className="mt-4 text-4xl font-black tracking-tight text-neutral-900 sm:text-5xl">
                            Find Your
                            <span className="text-[#b0002a]">
                                {" "}
                                Perfect Court
                            </span>
                        </h2>

                        <p className="mt-5 max-w-xl text-base leading-7 text-neutral-600 sm:text-lg">
                            Play your best game on professionally maintained
                            pickleball courts designed for casual games,
                            training sessions, and competitive matches.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <Link
                            href="/booking?mode=multi"
                            className="
                            group
                            inline-flex
                            items-center
                            gap-2
                            rounded-full
                            border
                            border-[#b0002a]
                            px-5
                            py-3
                            text-sm
                            font-bold
                            text-[#b0002a]
                            transition-all
                            duration-300
                            hover:bg-[#b0002a]
                            hover:text-white
                        "
                        >
                            Book a Court
                            <ArrowRight
                                size={18}
                                className="transition-transform duration-300 group-hover:translate-x-1"
                            />
                        </Link>
                    </div>
                </motion.div>

                {/* Court Cards */}
                <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {courts.map((court, index) => (
                        <motion.article
                            key={court.name}
                            initial={{
                                opacity: 0,
                                y: 30,
                            }}
                            whileInView={{
                                opacity: 1,
                                y: 0,
                            }}
                            viewport={{
                                once: true,
                                amount: 0.15,
                            }}
                            transition={{
                                duration: 0.5,
                                delay: index * 0.08,
                            }}
                            whileHover={{
                                y: -6,
                            }}
                            className="
                                group
                                overflow-hidden
                                rounded-2xl
                                border
                                border-neutral-200
                                bg-white
                                shadow-sm
                                transition-shadow
                                duration-300
                                hover:shadow-xl
                                hover:shadow-black/10
                            "
                        >
                            {/* Court Image */}
                            <div className="relative aspect-[4/3] overflow-hidden">
                                <img
                                    src={court.image}
                                    alt={`${court.name} - Court Avenue`}
                                    className="
                                        h-full
                                        w-full
                                        object-cover
                                        transition-transform
                                        duration-700
                                        group-hover:scale-110
                                    "
                                />

                                {/* Image Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                                {/* Court Number */}
                                <div className="absolute left-4 top-4">
                                    <span className="rounded-full bg-white/95 px-3 py-1.5 text-xs font-black text-neutral-900 shadow-sm backdrop-blur">
                                        {court.name}
                                    </span>
                                </div>

                                {/* Availability */}
                                <div className="absolute right-4 top-4">
                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-green-500 px-3 py-1.5 text-xs font-bold text-white shadow-sm">
                                        <span className="h-1.5 w-1.5 rounded-full bg-white" />

                                        {court.status}
                                    </span>
                                </div>

                                {/* Court Type */}
                                <div className="absolute bottom-4 left-4">
                                    <p className="text-xs font-medium text-white/80">
                                        {court.type}
                                    </p>

                                    <p className="mt-0.5 text-lg font-black text-white">
                                        {court.surface}
                                    </p>
                                </div>
                            </div>

                            {/* Court Details */}
                            <div className="p-5">
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <h3 className="text-xl font-black text-neutral-900">
                                            {court.name}
                                        </h3>

                                        <p className="mt-1 text-sm text-neutral-500">
                                            Ready for your next game
                                        </p>
                                    </div>

                                    <CheckCircle2
                                        size={21}
                                        className="mt-1 shrink-0 text-green-600"
                                        strokeWidth={2.5}
                                    />
                                </div>

                                {/* Details */}
                                <div className="mt-5 grid grid-cols-2 gap-3 border-t border-neutral-100 pt-4">
                                    <div className="flex items-center gap-2">
                                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-50 text-[#b0002a]">
                                            <Users size={15} />
                                        </div>

                                        <div>
                                            <p className="text-[10px] font-medium uppercase tracking-wide text-neutral-400">
                                                Capacity
                                            </p>

                                            <p className="text-xs font-bold text-neutral-700">
                                                {court.capacity}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-50 text-[#b0002a]">
                                            <Lightbulb size={15} />
                                        </div>

                                        <div>
                                            <p className="text-[10px] font-medium uppercase tracking-wide text-neutral-400">
                                                Lighting
                                            </p>

                                            <p className="text-xs font-bold text-neutral-700">
                                                {court.lighting}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Bottom */}
                                {/* <div className="mt-5 flex items-center justify-between border-t border-neutral-100 pt-4">
                                    <div>
                                        <p className="text-[10px] font-semibold uppercase tracking-wide text-neutral-400">
                                            Court Rate
                                        </p>

                                        <p className="mt-0.5 text-lg font-black text-[#b0002a]">
                                            {court.rate}
                                        </p>
                                    </div>
                                </div> */}
                            </div>
                        </motion.article>
                    ))}
                </div>

                {/* Bottom Information */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="
                        mt-8
                        flex
                        flex-col
                        gap-3
                        rounded-2xl
                        border
                        border-neutral-200
                        bg-white
                        p-4
                        shadow-sm
                        sm:flex-row
                        sm:items-center
                        sm:justify-between
                        sm:px-6
                    "
                >
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-50 text-green-600">
                            <CheckCircle2 size={19} />
                        </div>

                        <div>
                            <p className="text-sm font-bold text-neutral-900">
                                All courts are professionally maintained
                            </p>

                            <p className="text-xs text-neutral-500">
                                Clean facilities, quality playing surface, and
                                reliable lighting.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm font-semibold text-neutral-600">
                        <Clock3 size={17} className="text-[#b0002a]" />
                        Open daily
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
