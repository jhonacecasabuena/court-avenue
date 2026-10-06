import {
    CalendarDays,
    Users,
    Trophy,
    Crown,
    Coffee,
    MessageCircle,
} from "lucide-react";

const features = [
    {
        title: "Book a Court",
        description: "Reserve your preferred court and time slot online.",
        icon: CalendarDays,
    },
    // {
    //     title: 'Open Play',
    //     description: 'Meet new players and join an open play session.',
    //     icon: Users,
    // },
    {
        title: "Tournaments",
        description: "Compete, connect, and enjoy organized tournaments.",
        icon: Trophy,
    },
    // {
    //     title: 'Membership',
    //     description: 'Get exclusive rates, perks, and member benefits.',
    //     icon: Crown,
    // },
    {
        title: "Snack Bar",
        description: "Grab a drink or snack before or after your game.",
        icon: Coffee,
    },
    {
        title: "Contact Us",
        description: "Have questions? Our team is here to help.",
        icon: MessageCircle,
    },
];

export default function Features() {
    return (
        <section className="bg-white py-20">
            <div className="mx-auto max-w-7xl px-6">
                <div className="mx-auto mb-12 max-w-2xl text-center">
                    <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#b0002a]">
                        Everything in one place
                    </p>

                    <h2 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
                        Your Pickleball Experience
                    </h2>

                    <p className="mt-4 text-neutral-600">
                        More than just courts. Court Avenue is your place to
                        play, connect, compete, and unwind.
                    </p>
                </div>

                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-2">
                    {features.map((feature) => {
                        const Icon = feature.icon;

                        return (
                            <div
                                key={feature.title}
                                className="group rounded-2xl border border-neutral-200 bg-white p-7 transition hover:-translate-y-1 hover:border-[#b0002a] hover:shadow-xl"
                            >
                                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#fff0f3] text-[#b0002a]">
                                    <Icon size={27} />
                                </div>

                                <h3 className="mt-6 text-xl font-black">
                                    {feature.title}
                                </h3>

                                <p className="mt-2 leading-7 text-neutral-600">
                                    {feature.description}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
