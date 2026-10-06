import { ArrowRight, Users } from 'lucide-react';

export default function OpenPlay() {
    return (
        <section id="open-play" className="py-20">
            <div className="mx-auto max-w-7xl px-6">
                <div className="overflow-hidden rounded-3xl bg-[#b0002a]">
                    <div className="grid lg:grid-cols-2">
                        <div className="flex items-center p-8 text-white sm:p-12 lg:p-16">
                            <div>
                                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15">
                                    <Users />
                                </div>

                                <p className="mt-6 text-sm font-bold uppercase tracking-[0.2em] text-white/70">
                                    Open Play
                                </p>

                                <h2 className="mt-3 text-4xl font-black sm:text-5xl">
                                    Meet New Players.
                                    <br />
                                    Join the Game.
                                </h2>

                                <p className="mt-5 max-w-lg leading-7 text-white/80">
                                    Don't have a group? No problem. Join an
                                    open play session, meet other pickleball
                                    players, and enjoy the game together.
                                </p>

                                <button className="mt-8 inline-flex items-center gap-3 rounded-full bg-white px-7 py-3 font-bold text-[#b0002a]">
                                    Join Open Play
                                    <ArrowRight size={18} />
                                </button>
                            </div>
                        </div>

                        <div className="min-h-[350px]">
                            <img
                                src="/images/court-avenue/open-play.jpg"
                                alt="Open play pickleball"
                                className="h-full w-full object-cover"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}