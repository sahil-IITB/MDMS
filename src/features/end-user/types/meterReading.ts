export interface MeterReading {
    id: string;
    userId: string;
    meterNumber: string;
    date: string;
    reading: number;
    difference: number;
    notes: string;
}

export interface MeterReadingsQuery {
    page: number;
    startDate: string;
    endDate: string;
}

export interface PaginatedMeterReadingsResponse {
    first: number;
    prev: number | null;
    next: number | null;
    last: number;
    pages: number;
    items: number;
    data: MeterReading[];
}
