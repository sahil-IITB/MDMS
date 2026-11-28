
import { useEffect, useState } from "react";
import { getDailyConsumption } from "../services/consumptionService";
import type { DailyData } from "../types/consumption";

function Dashboard() {
    const [data, setData] = useState<DailyData[]>([]);

    useEffect(() => {
        getDailyConsumption()
            .then((res) => setData(res.data))
            .catch((err) => console.error(err));
    }, []);

    return (
        <div>
            <h2>Daily Consumption</h2>

            {data.map((item) => (
                <p key={item.id}>
                    {item.date}: {item.units} units
                </p>
            ))}
        </div>
    );
}

export default Dashboard;
