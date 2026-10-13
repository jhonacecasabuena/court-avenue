import { motion } from "motion/react";

type RevenueMonth = {
    month: string;
    amount: number;
};

type MonthlyRevenueChartProps = {
    data: RevenueMonth[];
    selectedMonth: string;
    selectedAmount: number;
};

const currency = (amount: number) =>
    new Intl.NumberFormat("en-PH", {
        style: "currency",
        currency: "PHP",
        maximumFractionDigits: 0,
    }).format(amount);

const monthLabel = (month: string) => {
    const [year, monthNumber] = month.split("-").map(Number);

    return new Date(year, monthNumber - 1, 1).toLocaleDateString("en-PH", {
        month: "short",
        year: "numeric",
    });
};

export default function MonthlyRevenueChart({
    data,
    selectedMonth,
    selectedAmount,
}: MonthlyRevenueChartProps) {
    const width = 720;
    const height = 250;
    const left = 64;
    const right = 16;
    const top = 20;
    const bottom = 42;

    const plotWidth = width - left - right;
    const plotHeight = height - top - bottom;

    const maxAmount = Math.max(
        1,
        ...data.map((item) => Number(item.amount) || 0),
    );

    const points = data.map((item, index) => ({
        ...item,
        x:
            left +
            (data.length > 1
                ? (index / (data.length - 1)) * plotWidth
                : plotWidth / 2),
        y:
            top +
            plotHeight -
            ((Number(item.amount) || 0) / maxAmount) * plotHeight,
    }));

    const line = points.map((point) => `${point.x},${point.y}`).join(" ");

    const area = points.length
        ? [
              `${points[0].x},${top + plotHeight}`,
              ...points.map((point) => `${point.x},${point.y}`),
              `${points[points.length - 1].x},${top + plotHeight}`,
          ].join(" ")
        : "";

    return (
        <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6"
        >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <h2 className="text-base font-bold text-gray-950 sm:text-lg">
                        Monthly Revenue
                    </h2>
                    <p className="mt-1 text-xs text-gray-500 sm:text-sm">
                        Revenue collected from confirmed and paid bookings
                    </p>
                </div>

                <div className="sm:text-right">
                    <p className="text-xs text-gray-500">
                        {monthLabel(selectedMonth)}
                    </p>
                    <p className="mt-1 text-xl font-bold text-gray-950 sm:text-2xl">
                        {currency(selectedAmount)}
                    </p>
                </div>
            </div>

            {points.length > 0 ? (
                <div className="mt-5 w-full overflow-x-auto">
                    <svg
                        viewBox={`0 0 ${width} ${height}`}
                        role="img"
                        aria-label="Monthly revenue for the last 12 months"
                        className="h-auto w-full min-w-[560px] overflow-visible"
                    >
                        {[0, 0.25, 0.5, 0.75, 1].map((fraction) => {
                            const y = top + plotHeight * (1 - fraction);

                            return (
                                <g key={fraction}>
                                    <line
                                        x1={left}
                                        x2={width - right}
                                        y1={y}
                                        y2={y}
                                        stroke="#e5e7eb"
                                        strokeDasharray="4 4"
                                    />
                                    <text
                                        x={left - 10}
                                        y={y + 4}
                                        textAnchor="end"
                                        fill="#9ca3af"
                                        fontSize="11"
                                    >
                                        {new Intl.NumberFormat("en-PH", {
                                            notation: "compact",
                                            maximumFractionDigits: 1,
                                        }).format(maxAmount * fraction)}
                                    </text>
                                </g>
                            );
                        })}

                        <polygon
                            points={area}
                            fill="#b91c1c"
                            fillOpacity="0.08"
                        />

                        <polyline
                            points={line}
                            fill="none"
                            stroke="#b91c1c"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />

                        {points.map((point) => (
                            <g key={point.month}>
                                <circle
                                    cx={point.x}
                                    cy={point.y}
                                    r={point.month === selectedMonth ? 5 : 3.5}
                                    fill="white"
                                    stroke="#b91c1c"
                                    strokeWidth="2.5"
                                >
                                    <title>
                                        {monthLabel(point.month)}:{" "}
                                        {currency(Number(point.amount))}
                                    </title>
                                </circle>

                                <text
                                    x={point.x}
                                    y={height - 12}
                                    textAnchor="middle"
                                    fill="#6b7280"
                                    fontSize="10"
                                >
                                    {monthLabel(point.month).split(" ")[0]}
                                </text>
                            </g>
                        ))}
                    </svg>
                </div>
            ) : (
                <p className="py-12 text-center text-sm text-gray-500">
                    No revenue history available.
                </p>
            )}

            <div className="mt-3 border-t border-gray-100 pt-3 text-xs text-gray-500">
                Showing the last 12 months. Values are based on payment receipt
                dates.
            </div>
        </motion.section>
    );
}
