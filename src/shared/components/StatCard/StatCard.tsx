import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import "./StatCard.css";

export interface StatCardProps {
    label: string;
    value: ReactNode;
    hint?: string;
    linkLabel?: string;
    linkTo?: string;
    icon?: ReactNode;
    loading?: boolean;
    align?: "center" | "left";
}

export function StatCard({
    label,
    value,
    hint,
    linkLabel,
    linkTo,
    icon,
    loading = false,
    align = "center",
}: StatCardProps) {
    return (
        <div className={`stat-card stat-card--${align}`}>
            {icon ? <div className="stat-card__icon">{icon}</div> : null}
            <div className="stat-card__value" aria-busy={loading}>
                {loading ? <span className="stat-card__skeleton" /> : value}
            </div>
            <div className="stat-card__label">{label}</div>
            {hint ? <div className="stat-card__hint">{hint}</div> : null}
            {linkLabel && linkTo ? (
                <Link className="stat-card__link" to={linkTo}>
                    {linkLabel} &rsaquo;
                </Link>
            ) : null}
        </div>
    );
}
