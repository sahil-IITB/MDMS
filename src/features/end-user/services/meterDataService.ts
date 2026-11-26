import API from "../../../services/http";
import type { MeterReadingsQuery, PaginatedMeterReadingsResponse } from "../types/meterReading";

const READINGS_PER_PAGE = 10;
const END_USER_ID = "2";

export function getMeterReadings({ page, startDate, endDate }: MeterReadingsQuery) {
    return API.get<PaginatedMeterReadingsResponse>("/meterReadings", {
        params: {
            userId: END_USER_ID,
            "date:gte": startDate,
            "date:lte": endDate,
            _page: page,
            _per_page: READINGS_PER_PAGE,
            _sort: "-date",
        },
    });
}
