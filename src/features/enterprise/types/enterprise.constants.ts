import type {
    ActiveStatus,
    AlertStatus,
    LogStatus,
    MeterStatus,
    Severity,
    UserRole,
} from "./enterprise.types";

export const ENDPOINTS = {
    zones: "/zones",
    users: "/users",
    meters: "/meters",
    alerts: "/alerts",
    auditLogs: "/auditLogs",
    settings: "/enterpriseSettings",
    zoneAverages: "/zoneAverages",
    zoneComparison: "/zoneComparison",
    userStatusByYear: "/userStatusByYear",
} as const;

export const ROLES: Record<"enterpriseAdmin" | "zoneAdmin" | "consumer", UserRole> = {
    enterpriseAdmin: "Enterprise Admin",
    zoneAdmin: "Zone Admin",
    consumer: "Consumer",
};

export const PAGE_SIZE = 10;

export interface Option {
    value: string;
    label: string;
}

const all = (label: string): Option => ({ value: "all", label });
const options = <T extends string>(values: T[]): Option[] =>
    values.map((value) => ({ value, label: value }));

export const ZONE_STATUS_OPTIONS: Option[] = [
    all("All statuses"),
    ...options<ActiveStatus>(["Active", "Deactivated"]),
];
export const METER_STATUS_OPTIONS: Option[] = [
    all("All statuses"),
    ...options<MeterStatus>(["Active", "Deactivated", "Pending"]),
];
export const USER_STATUS_OPTIONS = ZONE_STATUS_OPTIONS;
export const SEVERITY_OPTIONS: Option[] = [
    all("All severities"),
    ...options<Severity>(["Critical", "Warning", "Info"]),
];
export const ALERT_STATUS_OPTIONS: Option[] = [
    all("All statuses"),
    ...options<AlertStatus>(["Open", "Acknowledged", "Resolved"]),
];
export const LOG_STATUS_OPTIONS: Option[] = [
    all("All statuses"),
    ...options<LogStatus>(["Success", "Failed"]),
];
