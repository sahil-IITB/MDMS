
export interface DailyData {
    id: string;
    date: string;
    units: number;
}

export interface DashboardSummary {
    id: string;
    userName: string;
    zoneName: string;
    meterNumber: string;
    lastSynced: string;
    currentConsumptionKwh: number;
    currentMonthBill: number;
    billDueDate: string;
    outstandingBalance: number;
    lastPaymentAmount: number;
    lastPaymentDate: string;
}

export interface ConsumptionPoint {
    id: string;
    label: string;
    current: number;
    previous: number;
}