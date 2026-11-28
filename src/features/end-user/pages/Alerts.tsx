import { useEffect, useState, type ReactNode } from "react";
import { Bell, CalendarClock, CircleCheck, Clock3, ReceiptText, Wrench, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Button from "../../../shared/components/Button/Button";
import EmptyState from "../../../shared/components/EmptyState/EmptyState";
import PageHeader from "../../../shared/components/PageHeader";
import Pagination from "../../../shared/components/Pagination/Pagination";
import StatusBadge from "../../../shared/components/StatusBadge/StatusBadge";
import type { StatusBadgeVariant } from "../../../shared/components/StatusBadge/StatusBadge";
import { getEndUserNotifications } from "../services/notificationService";
import type { EndUserNotification, NotificationType } from "../types/notification";
import "./Alerts.css";

const TYPE_LABELS: Record<NotificationType, string> = {
    "bill-generated": "Bill generated",
    "payment-due": "Payment reminder",
    "payment-received": "Payment received",
    "high-consumption": "High consumption",
    maintenance: "Maintenance",
};

const TYPE_ICONS: Record<NotificationType, ReactNode> = {
    "bill-generated": <ReceiptText size={19} />,
    "payment-due": <CalendarClock size={19} />,
    "payment-received": <CircleCheck size={19} />,
    "high-consumption": <Zap size={19} />,
    maintenance: <Wrench size={19} />,
};

const TYPE_VARIANTS: Record<NotificationType, StatusBadgeVariant> = {
    "bill-generated": "info",
    "payment-due": "warning",
    "payment-received": "success",
    "high-consumption": "danger",
    maintenance: "neutral",
};

function formatTimestamp(value: string) {
    return new Intl.DateTimeFormat("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
    }).format(new Date(value));
}

type NotificationsState =
    | { queryKey: string; status: "success"; notifications: EndUserNotification[]; totalPages: number; totalItems: number }
    | { queryKey: string; status: "error"; message: string }
    | null;

function Alerts() {
    const navigate = useNavigate();
    const [filter, setFilter] = useState<"all" | "unread">("all");
    const [page, setPage] = useState(1);
    const [requestState, setRequestState] = useState<NotificationsState>(null);
    const unreadOnly = filter === "unread";
    const queryKey = `${filter}:${page}`;

    useEffect(() => {
        let isCurrent = true;

        getEndUserNotifications(page, unreadOnly)
            .then((response) => {
                if (isCurrent) {
                    setRequestState({
                        queryKey,
                        status: "success",
                        notifications: response.data.data,
                        totalPages: response.data.pages,
                        totalItems: response.data.items,
                    });
                }
            })
            .catch(() => {
                if (isCurrent) {
                    setRequestState({
                        queryKey,
                        status: "error",
                        message: "Your notifications could not be loaded. Please try again later.",
                    });
                }
            });

        return () => {
            isCurrent = false;
        };
    }, [page, queryKey, unreadOnly]);

    const currentRequest = requestState?.queryKey === queryKey ? requestState : null;
    const loading = currentRequest === null;
    const notifications = currentRequest?.status === "success" ? currentRequest.notifications : [];
    const totalPages = currentRequest?.status === "success" ? currentRequest.totalPages : 0;
    const totalItems = currentRequest?.status === "success" ? currentRequest.totalItems : 0;
    const error = currentRequest?.status === "error" ? currentRequest.message : "";

    const chooseFilter = (nextFilter: "all" | "unread") => {
        setFilter(nextFilter);
        setPage(1);
    };

    return (
        <div className="end-user-alerts">
            <PageHeader
                title="Alerts & notifications"
                description="Stay up to date with your bills, payments, meter activity, and service updates."
            />

            <section className="alerts-panel" aria-label="Notifications">
                <div className="alerts-panel__header">
                    <div className="alerts-panel__heading">
                        <span className="alerts-panel__icon"><Bell size={19} /></span>
                        <div>
                            <h2>Notifications</h2>
                            <p aria-live="polite">{loading ? "Loading notifications…" : `${totalItems} ${filter === "unread" ? "unread " : ""}notifications`}</p>
                        </div>
                    </div>
                    <div className="alerts-filter" role="group" aria-label="Filter notifications">
                        <Button
                            type="button"
                            size="sm"
                            variant={filter === "all" ? "primary" : "outline"}
                            aria-pressed={filter === "all"}
                            onClick={() => chooseFilter("all")}
                        >
                            All
                        </Button>
                        <Button
                            type="button"
                            size="sm"
                            variant={filter === "unread" ? "primary" : "outline"}
                            aria-pressed={filter === "unread"}
                            onClick={() => chooseFilter("unread")}
                        >
                            Unread
                        </Button>
                    </div>
                </div>

                {error ? (
                    <div className="alerts-error" role="alert">{error}</div>
                ) : currentRequest?.status === "success" && notifications.length === 0 ? (
                    <EmptyState
                        className="alerts-empty"
                        title={filter === "unread" ? "You’re all caught up" : "No notifications yet"}
                        description={filter === "unread" ? "You don’t have any unread notifications." : "New bill, payment, and meter updates will appear here."}
                        icon={<Bell size={26} />}
                    />
                ) : (
                    <div className="alerts-list" aria-busy={loading}>
                        {loading ? (
                            <div className="alerts-loading" role="status"><Clock3 size={18} /> Loading notifications…</div>
                        ) : notifications.map((notification) => (
                            <article
                                className={`alert-item${notification.isRead ? "" : " alert-item--unread"}`}
                                key={notification.id}
                            >
                                <span className={`alert-item__type-icon alert-item__type-icon--${notification.type}`} aria-hidden="true">
                                    {TYPE_ICONS[notification.type]}
                                </span>
                                <div className="alert-item__content">
                                    <div className="alert-item__title-row">
                                        <h3>{notification.title}</h3>
                                        {!notification.isRead && <span className="alert-item__unread-dot" aria-label="Unread" />}
                                    </div>
                                    <p className="alert-item__message">{notification.message}</p>
                                    <div className="alert-item__meta">
                                        <StatusBadge status={notification.type} variant={TYPE_VARIANTS[notification.type]}>
                                            {TYPE_LABELS[notification.type]}
                                        </StatusBadge>
                                        <span className="alert-item__time"><Clock3 size={13} />{formatTimestamp(notification.createdAt)}</span>
                                    </div>
                                </div>
                                {notification.actionLabel && notification.actionTo ? (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        className="alert-item__action"
                                        onClick={() => navigate(notification.actionTo!)}
                                    >
                                        {notification.actionLabel}
                                    </Button>
                                ) : null}
                            </article>
                        ))}
                    </div>
                )}

                {totalItems > 0 ? (
                    <footer className="alerts-panel__footer">
                        <span>Notifications are shown newest first.</span>
                        <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
                    </footer>
                ) : null}
            </section>
        </div>
    );
}

export default Alerts;
