import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { colorAt, tooltipProps } from "./chartConfig";

export interface DonutDatum {
    name: string;
    value: number;
    color?: string;
}

export interface DonutChartViewProps {
    data: DonutDatum[];
    height?: number;
    centerLabel?: string;
}

export function DonutChartView({
    data,
    height = 260,
    centerLabel = "Total",
}: DonutChartViewProps) {
    const total = data.reduce((sum, datum) => sum + datum.value, 0);

    return (
        <div className="donut" style={{ height }}>
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        dataKey="value"
                        nameKey="name"
                        innerRadius="60%"
                        outerRadius="85%"
                        paddingAngle={2}
                        stroke="none"
                    >
                        {data.map((datum, index) => (
                            <Cell
                                key={datum.name}
                                fill={datum.color ?? colorAt(index)}
                            />
                        ))}
                    </Pie>
                    <Tooltip {...tooltipProps()} />
                    <Legend verticalAlign="bottom" />
                </PieChart>
            </ResponsiveContainer>
            <div className="donut__center">
                <strong>{total.toLocaleString("en-IN")}</strong>
                <span>{centerLabel}</span>
            </div>
        </div>
    );
}
