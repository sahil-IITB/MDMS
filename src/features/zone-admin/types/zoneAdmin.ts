export type ZoneMeterStatus = "Active" | "Offline" | "Maintenance";
export type ZoneUserStatus = "Active" | "Invited" | "Suspended";
export type ZoneAlertSeverity = "Critical" | "Warning" | "Info";
export type ZoneAlertStatus = "Open" | "Acknowledged" | "Resolved";

export interface ZoneMeter {
    id: string;
    meterNumber: string;
    customer: string;
    email: string;
    address: string;
    meterType: "Smart meter" | "Prepaid meter";
    status: ZoneMeterStatus;
    lastReading: number;
    lastSync: string;
    monthlyUsage: number;
    installedOn: string;
}

export interface ZoneUser {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: "Zone Admin" | "Field Operator" | "Customer Support";
    status: ZoneUserStatus;
    lastActive: string;
    joinedOn: string;
}

export interface ZoneAlert {
    id: string;
    title: string;
    detail: string;
    meterNumber: string;
    location: string;
    severity: ZoneAlertSeverity;
    status: ZoneAlertStatus;
    createdAt: string;
}
