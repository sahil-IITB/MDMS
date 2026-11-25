
import API from "../../../services/http";

export const getDailyConsumption = () => API.get("/dailyData");

export const getWeeklyConsumption = () => API.get("/weeklyData");

export const getMonthlyConsumption = () => API.get("/monthlyData");
