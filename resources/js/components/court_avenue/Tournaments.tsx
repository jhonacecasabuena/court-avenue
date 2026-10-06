import { Trophy, ArrowRight } from "lucide-react";

export default function Tournaments() {
    return (
        <section id="tournaments" className="bg-white py-20">
            <div className="mx-auto max-w-7xl px-6">
                <div className="grid items-center gap-12 lg:grid-cols-2">
                    <div className="overflow-hidden rounded-3xl">
                        <img
                            src="/images/court_avenue/court.jpg"
                            alt="Pickleball tournament"
                            className="h-[420px] w-full object-cover"
                        />
                    </div>

                    <div>
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#fff0f3] text-[#b0002a]">
                            <Trophy size={28} />
                        </div>

                        <p className="mt-6 text-sm font-bold uppercase tracking-[0.2em] text-[#b0002a]">
                            Tournaments
                        </p>

                        <h2 className="mt-3 text-4xl font-black sm:text-5xl">
                            Ready to Compete?
                        </h2>

                        <p className="mt-5 leading-8 text-neutral-600">
                            Join upcoming Court Avenue tournaments, compete with
                            other players, and experience the thrill of
                            tournament play.
                        </p>

                        <button className="mt-8 inline-flex items-center gap-3 rounded-full bg-[#b0002a] px-7 py-4 font-bold text-white">
                            View Tournaments
                            <ArrowRight size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
