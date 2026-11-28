import type { ReactNode } from "react";
import "./StatusBadge.css";

export type StatusBadgeVariant =
    | "success"
    | "warning"
    | "danger"
    | "info"
    | "neutral";

interface StatusBadgeProps {
    status: string;
    variant?: StatusBadgeVariant;
    children?: ReactNode;
    className?: string;
}

function StatusBadge({
    status,
    variant,
    children,
    className = "",
}: StatusBadgeProps) {
    const normalizedStatus = status.trim().toLowerCase();

    const statusVariant: StatusBadgeVariant =
        variant ??
        (normalizedStatus === "active" ||
        normalizedStatus === "success" ||
        normalizedStatus === "completed" ||
        normalizedStatus === "paid"
            ? "success"
            : normalizedStatus === "pending" ||
                normalizedStatus === "warning"
              ? "warning"
              : normalizedStatus === "inactive" ||
                  normalizedStatus === "failed" ||
                  normalizedStatus === "error" ||
                  normalizedStatus === "overdue"
                ? "danger"
                : normalizedStatus === "info" ||
                    normalizedStatus === "processing"
                  ? "info"
                  : "neutral");

    const label =
        children ??
        status.replace(/[-_]/g, " ").replace(/\b\w/g, (letter) =>
            letter.toUpperCase(),
        );

    return (
        <span
            className={`status-badge status-badge--${statusVariant} ${className}`.trim()}
        >
            <span className="status-badge__dot" aria-hidden="true" />
            <span className="status-badge__text">{label}</span>
        </span>
    );
}

export default StatusBadge;