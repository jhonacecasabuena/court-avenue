export default function About() {
    return (
        <section id="about" className="bg-neutral-50 py-20 text-black">
            <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 lg:grid-cols-2">
                <div>
                    <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#e0003c]">
                        About Court Avenue
                    </p>

                    <h2 className="mt-4 text-4xl font-black sm:text-5xl">
                        More Than a Court.
                        <br />
                        It's a Community.
                    </h2>

                    <p className="mt-6 leading-8 text-neutral-600">
                        Court Avenue is a pickleball destination built for
                        players of all levels. Whether you're here for a casual
                        game, a tournament, or simply to spend time with
                        friends, there's always a place for you.
                    </p>

                    <p className="mt-4 leading-8 text-neutral-600">
                        Play hard, connect with others, and unwind after the
                        game.
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-2xl bg-white/5 p-7">
                        <div className="text-4xl font-black text-[#e0003c]">
                            4
                        </div>

                        <p className="mt-2 text-neutral-600">
                            Pickleball Courts
                        </p>
                    </div>

                    <div className="rounded-2xl bg-white/5 p-7">
                        <div className="text-4xl font-black text-[#e0003c]">
                            7
                        </div>

                        <p className="mt-2 text-neutral-600">Days a Week</p>
                    </div>

                    <div className="rounded-2xl bg-white/5 p-7">
                        <div className="text-4xl font-black text-[#e0003c]">
                            100+
                        </div>

                        <p className="mt-2 text-neutral-600">Players</p>
                    </div>

                    <div className="rounded-2xl bg-white/5 p-7">
                        <div className="text-4xl font-black text-[#e0003c]">
                            24/7
                        </div>

                        <p className="mt-2 text-neutral-600">Online Booking</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
