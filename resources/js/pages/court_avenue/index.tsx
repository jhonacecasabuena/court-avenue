import { Head } from "@inertiajs/react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";

import Navbar from "@/components/court_avenue/Navbar";
import Hero from "@/components/court_avenue/Hero";
import Features from "@/components/court_avenue/Features";
import CourtsPreview from "@/components/court_avenue/CourtsPreview";
import Tournaments from "@/components/court_avenue/Tournaments";
import About from "@/components/court_avenue/About";
import CTA from "@/components/court_avenue/CTA";
import Footer from "@/components/court_avenue/Footer";
import ChatWidget from "@/components/booking_chat/ChatWidget";
import type { Court, TimeSlot, BookedSlot } from "@/types";

type Props = {
    courts: Court[];
    timeSlots: TimeSlot[];
    bookedSlots: BookedSlot[];
};

export default function Index({ courts }: Props) {
    const [showScrollTop, setShowScrollTop] = useState(false);
    const [isChatOpen, setIsChatOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setShowScrollTop(window.scrollY > 500);
        };

        window.addEventListener("scroll", handleScroll);

        handleScroll();

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    return (
        <>
            <Head title="Court Avenue | Pickleball Reservation System" />

            <div className="min-h-screen overflow-x-hidden bg-white text-neutral-900">
                <Navbar />

                <motion.main
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{
                        duration: 0.5,
                        ease: "easeOut",
                    }}
                >
                    <Hero />

                    <Features />

                    <CourtsPreview courts={courts} />

                    {/* <OpenPlay /> */}

                    <Tournaments />

                    {/* <Membership /> */}

                    <About />

                    {/* <CTA /> */}
                </motion.main>

                <Footer />

                {/* Chat Widget */}
                <ChatWidget onOpenChange={setIsChatOpen} />

                {/* Scroll To Top */}
                <AnimatePresence>
                    {showScrollTop && (
                        <motion.button
                            type="button"
                            onClick={scrollToTop}
                            aria-label="Scroll to top"
                            initial={{
                                opacity: 0,
                                scale: 0.8,
                                y: 20,
                            }}
                            animate={{
                                opacity: 1,
                                scale: 1,
                                y: 0,
                            }}
                            exit={{
                                opacity: 0,
                                scale: 0.8,
                                y: 20,
                            }}
                            transition={{
                                duration: 0.25,
                                ease: "easeOut",
                            }}
                            whileHover={{
                                y: -3,
                            }}
                            whileTap={{
                                scale: 0.9,
                            }}
                            className={`
                                fixed
                                right-5
                                z-50
                                flex
                                h-11
                                w-11
                                items-center
                                justify-center
                                rounded-full
                                bg-[#b0002a]
                                text-white
                                shadow-lg
                                shadow-black/15
                                transition-[bottom]
                                duration-300
                                hover:bg-[#8e0023]
                                sm:right-6
                                sm:h-12
                                sm:w-12
                                ${
                                    isChatOpen
                                        ? "bottom-[calc(100vh-80px)]"
                                        : "bottom-[88px] sm:bottom-[92px]"
                                }
                            `}
                        >
                            <ArrowUp size={20} strokeWidth={2.5} />
                        </motion.button>
                    )}
                </AnimatePresence>
            </div>
        </>
    );
}
