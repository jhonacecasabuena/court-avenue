import { motion, type Variants } from "motion/react"
import type { ReactNode } from 'react';

interface RevealProps {
    children: ReactNode;
    className?: string;
    delay?: number;
    direction?: 'up' | 'down' | 'left' | 'right' | 'none';
}

const variants: Record<string, Variants> = {
    up: {
        hidden: {
            opacity: 0,
            y: 40,
        },
        visible: {
            opacity: 1,
            y: 0,
        },
    },

    down: {
        hidden: {
            opacity: 0,
            y: -40,
        },
        visible: {
            opacity: 1,
            y: 0,
        },
    },

    left: {
        hidden: {
            opacity: 0,
            x: -40,
        },
        visible: {
            opacity: 1,
            x: 0,
        },
    },

    right: {
        hidden: {
            opacity: 0,
            x: 40,
        },
        visible: {
            opacity: 1,
            x: 0,
        },
    },

    none: {
        hidden: {
            opacity: 0,
        },
        visible: {
            opacity: 1,
        },
    },
};

export default function Reveal({
    children,
    className = '',
    delay = 0,
    direction = 'up',
}: RevealProps) {
    return (
        <motion.div
            className={className}
            variants={variants[direction]}
            initial="hidden"
            whileInView="visible"
            viewport={{
                once: true,
                amount: 0.15,
            }}
            transition={{
                duration: 0.65,
                delay,
                ease: [0.22, 1, 0.36, 1],
            }}
        >
            {children}
        </motion.div>
    );
}   