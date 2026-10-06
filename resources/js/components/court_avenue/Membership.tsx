import { Check, Crown } from 'lucide-react';

const benefits = [
    'Exclusive court rates',
    'Priority booking',
    'Tournament perks',
    'Member-only events',
    'Special discounts',
];

export default function Membership() {
    return (
        <section id="membership" className="py-20">
            <div className="mx-auto max-w-5xl px-6">
                <div className="rounded-3xl border border-neutral-200 bg-white p-8 shadow-xl sm:p-12">
                    <div className="text-center">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#fff0f3] text-[#b0002a]">
                            <Crown size={30} />
                        </div>

                        <p className="mt-6 text-sm font-bold uppercase tracking-[0.2em] text-[#b0002a]">
                            Membership
                        </p>

                        <h2 className="mt-3 text-4xl font-black">
                            Play More. Save More.
                        </h2>

                        <p className="mx-auto mt-4 max-w-xl text-neutral-600">
                            Become a Court Avenue member and enjoy exclusive
                            benefits every time you play.
                        </p>
                    </div>

                    <div className="mx-auto mt-10 grid max-w-2xl gap-4 sm:grid-cols-2">
                        {benefits.map((benefit) => (
                            <div
                                key={benefit}
                                className="flex items-center gap-3 rounded-xl bg-neutral-50 p-4"
                            >
                                <Check
                                    size={19}
                                    className="text-[#b0002a]"
                                />

                                <span className="font-semibold">
                                    {benefit}
                                </span>
                            </div>
                        ))}
                    </div>

                    <div className="mt-10 text-center">
                        <button className="rounded-full bg-[#b0002a] px-8 py-4 font-bold text-white hover:bg-[#8e0023]">
                            Learn More
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}