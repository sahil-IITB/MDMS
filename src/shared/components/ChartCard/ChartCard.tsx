import type { ReactNode } from "react";
import { TimeRangeToggle, type TimeRange } from "./TimeRangeToggle";
import "./ChartCard.css";

export interface ChartCardProps {
    title: string;
    subtitle?: string;
    range?: {
        value: TimeRange;
        onChange: (range: TimeRange) => void;
        options?: TimeRange[];
    };
    actions?: ReactNode;
    loading?: boolean;
    error?: string | null;
    isEmpty?: boolean;
    emptyMessage?: string;
    height?: number;
    children: ReactNode;
}

export function ChartCard({
    title,
    subtitle,
    range,
    actions,
    loading = false,
    error = null,
    isEmpty = false,
    emptyMessage = "No data to display for this selection.",
    height = 300,
    children,
}: ChartCardProps) {
    let body: ReactNode = children;
    if (loading) {
        body = <div className="chart-card__skeleton" style={{ height }} aria-busy="true" />;
    } else if (error) {
        body = (
            <div className="chart-card__state" style={{ height }} role="alert">
                {error}
            </div>
        );
    } else if (isEmpty) {
        body = (
            <div className="chart-card__state" style={{ height }}>
                {emptyMessage}
            </div>
        );
    }

    return (
        <section className="chart-card">
            <header className="chart-card__header">
                <div>
                    <h3 className="chart-card__title">{title}</h3>
                    {subtitle ? <p className="chart-card__subtitle">{subtitle}</p> : null}
                </div>
                <div className="chart-card__controls">
                    {actions}
                    {range ? (
                        <TimeRangeToggle
                            value={range.value}
                            onChange={range.onChange}
                            options={range.options}
                        />
                    ) : null}
                </div>
            </header>
            <div className="chart-card__body">{body}</div>
        </section>
    );
}
