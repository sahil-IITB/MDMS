import { useEffect } from "react";
import { AlertCircle, CheckCircle2, Info, TriangleAlert, X } from "lucide-react";
import "./ToastNotification.css";

export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastNotificationData {
    id: string;
    message: string;
    type?: ToastType;
    title?: string;
    duration?: number;
}

interface ToastNotificationsProps {
    notifications: ToastNotificationData[];
    onDismiss: (id: string) => void;
    duration?: number;
}

const toastIcons = {
    success: CheckCircle2,
    error: AlertCircle,
    warning: TriangleAlert,
    info: Info,
};

function ToastNotifications({
    notifications,
    onDismiss,
    duration = 5000,
}: ToastNotificationsProps) {
    return (
        <div className="toast-notifications" aria-label="Notifications">
            {notifications.map((notification) => (
                <ToastItem
                    key={notification.id}
                    notification={notification}
                    duration={notification.duration ?? duration}
                    onDismiss={onDismiss}
                />
            ))}
        </div>
    );
}

interface ToastItemProps {
    notification: ToastNotificationData;
    duration: number;
    onDismiss: (id: string) => void;
}

function ToastItem({ notification, duration, onDismiss }: ToastItemProps) {
    const type = notification.type ?? "info";
    const Icon = toastIcons[type];

    useEffect(() => {
        if (duration <= 0) {
            return;
        }

        const timeoutId = window.setTimeout(
            () => onDismiss(notification.id),
            duration,
        );

        return () => window.clearTimeout(timeoutId);
    }, [duration, notification.id, onDismiss]);

    return (
        <div
            className={`toast toast--${type}`}
            role={type === "error" ? "alert" : "status"}
            aria-live={type === "error" ? "assertive" : "polite"}
        >
            <Icon className="toast__icon" aria-hidden="true" size={20} />
            <div className="toast__content">
                {notification.title && (
                    <p className="toast__title">{notification.title}</p>
                )}
                <p className="toast__message">{notification.message}</p>
            </div>
            <button
                className="toast__dismiss"
                type="button"
                aria-label="Dismiss notification"
                onClick={() => onDismiss(notification.id)}
            >
                <X aria-hidden="true" size={18} />
            </button>
        </div>
    );
}

export default ToastNotifications;