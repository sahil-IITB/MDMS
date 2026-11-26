export type Id = number | string;
export type SortOrder = "asc" | "desc";

export type ActiveStatus = "Active" | "Deactivated";
export type MeterStatus = ActiveStatus | "Pending";
export type Severity = "Critical" | "Warning" | "Info";
export type AlertStatus = "Open" | "Acknowledged" | "Resolved";
export type LogStatus = "Success" | "Failed";
export type UserRole = "Enterprise Admin" | "Zone Admin" | "Consumer";
export type ReportPeriod = "Week" | "Month" | "Year";

export interface ListParams {
    page: number;
    pageSize: number;
    sortBy?: string;
    sortOrder?: SortOrder;
    search?: string;
    searchFields?: string[];
    filters?: Record<string, string | number | undefined>;
}

export interface PagedResult<T> {
    items: T[];
    total: number;
}

export interface Zone {
    id: Id;
    zoneCode: string;
    name: string;
    location: string;
    pincode: string;
    description: string;
    adminId: Id | null;
    adminName: string;
    status: ActiveStatus;
    totalMeters: number;
}

export interface ZoneSummary {
    totalMeters: number;
    activeMeters: number;
    consumers: number;
    openAlerts: number;
}

export interface Meter {
    id: Id;
    meterNo: string;
    ownerId: Id;
    ownerName: string;
    zoneId: Id;
    zoneName: string;
    status: MeterStatus;
    address: string;
    installedOn: string;
    tariff: string;
    lastReading: string | null;
    lastReadingKwh: number | null;
}

export interface EnterpriseUser {
    id: Id;
    userCode: string;
    name: string;
    email: string;
    phone: string;
    role: UserRole;
    zoneId: Id | null;
    zoneName: string | null;
    status: ActiveStatus;
    createdOn: string;
}

export interface Alert {
    id: Id;
    alertCode: string;
    zoneId: Id;
    zoneName: string;
    meterNo: string;
    type: string;
    message: string;
    severity: Severity;
    status: AlertStatus;
    createdAt: string;
}

export interface AuditLog {
    id: Id;
    logCode: string;
    timestamp: string;
    user: string;
    action: string;
    resource: string;
    status: LogStatus;
}

export interface EnterpriseSettings {
    dataRetention: { meterReadingsMonths: number; billsYears: number };
    policies: { autoLogoutMinutes: number; auditLogRetentionDays: number };
    localisation: { timeZone: string; defaultLanguage: string; currency: string };
    notifications: {
        emailEnabled: boolean;
        smsEnabled: boolean;
        pushEnabled: boolean;
        criticalAlertsOnly: boolean;
    };
}

export type ZoneAverage = {
    id: Id;
    zoneId: Id;
    zone: string;
    avgKwh: number;
    totalKwh: number;
};

export type ZoneComparisonRow = {
    id: Id;
    period: ReportPeriod;
    label: string;
} & Record<string, string | number>;

export type UserStatusYear = {
    id: Id;
    year: number;
    active: number;
    deactivated: number;
};
