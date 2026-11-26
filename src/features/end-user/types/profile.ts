export interface NotificationPreferences {
    email: boolean;
    sms: boolean;
}

export interface UserProfile {
    id: string;
    name: string;
    email: string;
    phone: string;
    notificationPreferences: NotificationPreferences;
}
