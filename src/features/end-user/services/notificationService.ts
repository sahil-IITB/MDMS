import API from "../../../services/http";
import type { PaginatedNotificationsResponse } from "../types/notification";

const NOTIFICATIONS_PER_PAGE = 8;
const END_USER_ID = "2";

export function getEndUserNotifications(page: number, unreadOnly: boolean) {
    const params: Record<string, string | number> = {
        userId: END_USER_ID,
        _page: page,
        _per_page: NOTIFICATIONS_PER_PAGE,
        _sort: "-createdAt",
    };

    if (unreadOnly) params["isRead:eq"] = "false";

    return API.get<PaginatedNotificationsResponse>("/notifications", { params });
}
