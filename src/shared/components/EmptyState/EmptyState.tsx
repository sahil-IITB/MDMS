import { useId, type ReactNode } from "react";
import "./EmptyState.css";

interface EmptyStateProps {
    title: string;
    description?: string;
    icon?: ReactNode;
    action?: ReactNode;
    className?: string;
}

function EmptyState({
    title,
    description,
    icon,
    action,
    className = "",
}: EmptyStateProps) {
    const titleId = useId();

    return (
        <section
            className={`empty-state ${className}`.trim()}
            aria-labelledby={titleId}
        >
            <div className="empty-state__icon" aria-hidden="true">
                {icon ?? (
                    <svg viewBox="0 0 48 48" fill="none">
                        <path
                            d="M8 14.5h11l3 4h18v16a3 3 0 0 1-3 3H11a3 3 0 0 1-3-3v-20Z"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinejoin="round"
                        />
                        <path
                            d="M8 22h32l-3.5 11H11.5L8 22Z"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinejoin="round"
                        />
                    </svg>
                )}
            </div>

            <h2 className="empty-state__title" id={titleId}>
                {title}
            </h2>

            {description && (
                <p className="empty-state__description">{description}</p>
            )}

            {action && <div className="empty-state__action">{action}</div>}
        </section>
    );
}

export default EmptyState;