export type NotificationType =
    | "bill-generated"
    | "payment-due"
    | "payment-received"
    | "high-consumption"
    | "maintenance";

export interface EndUserNotification {
    id: string;
    userId: string;
    type: NotificationType;
    title: string;
    message: string;
    createdAt: string;
    isRead: boolean;
    actionLabel?: string;
    actionTo?: string;
}

export interface PaginatedNotificationsResponse {
    first: number;
    prev: number | null;
    next: number | null;
    last: number;
    pages: number;
    items: number;
    data: EndUserNotification[];
}
