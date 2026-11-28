
export interface DailyData {
    id: string;
    date: string;
    units: number;
}
<<<<<<< HEAD
=======

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
>>>>>>> 1daf4dd8f4a7b10bb7b08e7f1b5d0105416a1e3c
