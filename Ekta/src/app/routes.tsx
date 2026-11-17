
import { createBrowserRouter } from "react-router";
import Dashboard from "../features/end-user/pages/Dashboard";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Dashboard />,
    },
]);

export default router;
