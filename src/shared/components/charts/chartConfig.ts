import "./charts.css";

export type ChartDatum = object;

export interface ChartSeries {
    dataKey: string;
    name: string;
    color?: string;
}

export const CHART_HEIGHT = 300;

export const CHART_COLORS = [
    "var(--chart-1)",
    "var(--chart-2)",
    "var(--chart-3)",
    "var(--chart-4)",
    "var(--chart-5)",
    "var(--chart-6)",
    "var(--chart-7)",
    "var(--chart-8)",
];

export const colorAt = (index: number): string =>
    CHART_COLORS[index % CHART_COLORS.length];

export const axisProps = {
    stroke: "var(--chart-axis)",
    tick: { fill: "var(--chart-axis)", fontSize: 12 },
    tickLine: false,
} as const;

export const gridProps = {
    stroke: "var(--chart-grid)",
    strokeDasharray: "3 3",
    vertical: false,
} as const;

export function tooltipProps(unit?: string) {
    return {
        contentStyle: {
            background: "var(--surface, #fff)",
            border: "1px solid var(--chart-grid)",
            borderRadius: 8,
            color: "var(--text, #0f172a)",
        },
        itemStyle: { color: "var(--text, #0f172a)" },
        cursor: { fill: "var(--chart-cursor)" },
        formatter: (value: unknown): string => {
            const number = Number(value);
            const text = Number.isFinite(number)
                ? number.toLocaleString("en-IN")
                : String(value);
            return unit ? `${text} ${unit}` : text;
        },
    };
}
