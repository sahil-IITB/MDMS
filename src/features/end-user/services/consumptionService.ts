import API from "../../../services/http";

import type { TimeRange } from "../../../shared/components/ChartCard/TimeRangeToggle";
import type { ConsumptionPoint, DashboardSummary } from "../types/consumption";

const CONSUMPTION_ENDPOINTS: Record<TimeRange, string> = {
  Day: "/dayConsumption",
  Week: "/weekConsumption",
  Month: "/monthConsumption",
  Year: "/yearConsumption",
};

export const getDashboardSummary = () =>
  API.get<DashboardSummary>("/dashboardSummary/1");

export const getConsumption = (range: TimeRange) =>
  API.get<ConsumptionPoint[]>(CONSUMPTION_ENDPOINTS[range]);

export const getDailyConsumption = () => API.get("/dailyData");

export const getWeeklyConsumption = () => API.get("/weeklyData");

export const getMonthlyConsumption = () => API.get("/monthlyData");
