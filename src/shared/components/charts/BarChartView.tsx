import {
    Bar,
    BarChart,
    CartesianGrid,
    Legend,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import {
    axisProps,
    CHART_HEIGHT,
    colorAt,
    gridProps,
    tooltipProps,
    type ChartDatum,
    type ChartSeries,
} from "./chartConfig";

export interface BarChartViewProps {
    data: ChartDatum[];
    xKey: string;
    series: ChartSeries[];
    height?: number;
    unit?: string;
    stacked?: boolean;
}

export function BarChartView({
    data,
    xKey,
    series,
    height = CHART_HEIGHT,
    unit,
    stacked = false,
}: BarChartViewProps) {
    return (
        <div style={{ width: "100%", height }}>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                    <CartesianGrid {...gridProps} />
                    <XAxis dataKey={xKey} {...axisProps} />
                    <YAxis {...axisProps} width={56} />
                    <Tooltip {...tooltipProps(unit)} />
                    {series.length > 1 ? <Legend /> : null}
                    {series.map((item, index) => (
                        <Bar
                            key={item.dataKey}
                            dataKey={item.dataKey}
                            name={item.name}
                            fill={item.color ?? colorAt(index)}
                            stackId={stacked ? "stack" : undefined}
                            radius={[4, 4, 0, 0]}
                        />
                    ))}
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
