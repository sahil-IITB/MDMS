import {
    CartesianGrid,
    Legend,
    Line,
    LineChart,
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

export interface LineChartViewProps {
    data: ChartDatum[];
    xKey: string;
    series: ChartSeries[];
    height?: number;
    unit?: string;
}

export function LineChartView({
    data,
    xKey,
    series,
    height = CHART_HEIGHT,
    unit,
}: LineChartViewProps) {
    return (
        <div style={{ width: "100%", height }}>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                    <CartesianGrid {...gridProps} />
                    <XAxis dataKey={xKey} {...axisProps} />
                    <YAxis {...axisProps} width={56} />
                    <Tooltip {...tooltipProps(unit)} />
                    {series.length > 1 ? <Legend /> : null}
                    {series.map((item, index) => (
                        <Line
                            key={item.dataKey}
                            type="monotone"
                            dataKey={item.dataKey}
                            name={item.name}
                            stroke={item.color ?? colorAt(index)}
                            strokeWidth={2}
                            dot={{ r: 3 }}
                            activeDot={{ r: 5 }}
                        />
                    ))}
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
