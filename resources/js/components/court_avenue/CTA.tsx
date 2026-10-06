import { Link } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';

export default function CTA() {
    return (
        <section className="px-6 py-20">
            <div className="mx-auto max-w-7xl overflow-hidden rounded-3xl bg-[#b0002a]">
                <div className="px-8 py-16 text-center text-white sm:px-12">
                    <h2 className="text-4xl font-black sm:text-6xl">
                        Ready to Play?
                    </h2>

                    <p className="mx-auto mt-5 max-w-xl text-white/80">
                        Reserve your court today and experience Court Avenue.
                    </p>

                    <Link
                        href="/booking"
                        className="mt-8 inline-flex items-center gap-3 rounded-full bg-white px-8 py-4 font-bold text-[#b0002a]"
                    >
                        Book Your Court
                        <ArrowRight size={20} />
                    </Link>
                </div>
            </div>
        </section>
    );
}