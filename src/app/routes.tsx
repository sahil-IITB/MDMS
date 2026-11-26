import { Navigate, Route, Routes } from "react-router-dom";
import AppLayout from "../shared/layout/AppLayout/AppLayout";
import Login from "../features/auth/pages/Login";
import ForgotPassword from "../features/auth/pages/ForgotPassword";
import ResetPassword from "../features/auth/pages/ResetPassword";

function PlaceholderPage({title}: {title:string}) {
    return (
        <div style={{padding : "24px"}}>
            <h1>{title}</h1>
            <p>Page is under development</p>
        </div>
    );
}

function AppRoutes() {
    return (
        <Routes>
            {/*================= AUTHENTICATION =================*/}
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
        
            {/*================= END-USER MODULE =================*/}
            <Route element={<AppLayout />}>
                <Route path="/dashboard" element={<PlaceholderPage title="End-user Dashboard" />} />
                <Route path="/bills" element={<PlaceholderPage title="Bills & Payments" />} />
                <Route path="/bills/:billId" element={<PlaceholderPage title="Bill Details" />} />
                <Route path="/meter-data" element={<PlaceholderPage title="Meter Data" />} />
                <Route path="/alerts" element={<PlaceholderPage title="End-User Alerts" />} />
                <Route path="/profile" element={<PlaceholderPage title="Profile & Settings" />} />
            </Route>

            {/* ================= ZONE ADMIN MODULE ================= */}
            <Route path="/zone" element={<Navigate to="/zone/dashboard" replace />} />
            <Route path="/zone/dashboard" element={<PlaceholderPage title="Zone Dashboard" />} />
            <Route path="/zone/meters" element={<PlaceholderPage title="Zone Meter Management" />} />
            <Route path="/zone/meters/:meterId" element={<PlaceholderPage title="Zone Meter Details" />} />
            <Route path="/zone/users" element={<PlaceholderPage title="Zone User Management" />} />
            <Route path="/zone/reports" element={<PlaceholderPage title="Zone Reports & Analytics" />} />
            <Route path="/zone/alerts" element={<PlaceholderPage title="Zone Alerts" />} />
            <Route path="/zone/settings" element={<PlaceholderPage title="Zone Settings" />} />

            {/* ================= ENTERPRISE MODULE ================= */}
            <Route path="/enterprise" element={<Navigate to={"/enterprise/dashboard"}/>} />
            <Route path="/enterprise/dashboard" element={<PlaceholderPage title="Enterprise Dashboard" />} />
            <Route path="/enterprise/zones" element={<PlaceholderPage title="Zone Management" />} />
            <Route path="/enterprise/zones/:zoneId" element={<PlaceholderPage title="Zone Details" />} />
            <Route path="/enterprise/meters" element={<PlaceholderPage title="Enterprise Meter Management" />} />
            <Route path="/enterprise/users" element={<PlaceholderPage title="Enterprise User & Role Management" />} />
            <Route path="/enterprise/reports" element={<PlaceholderPage title="Enterprise Reports & Analytics" />} />
            <Route path="/enterprise/alerts" element={<PlaceholderPage title="Enterprise Alerts" />} />
            <Route path="/enterprise/audit-logs" element={<PlaceholderPage title="Audit Logs" />} />
            <Route path="/enterprise/settings" element={<PlaceholderPage title="Enterprise Settings & Configuration" />} />

            {/* ================= DEFAULT ROUTES ================= */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<PlaceholderPage title="404 - Page Not Found" />} />
        </Routes>
    );
}

export default AppRoutes;
