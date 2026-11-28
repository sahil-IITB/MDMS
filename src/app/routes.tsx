import { Navigate, Route, Routes } from "react-router-dom";
import AppLayout from "../shared/layout/AppLayout/AppLayout";
import Login from "../features/auth/pages/Login";
import ForgotPassword from "../features/auth/pages/ForgotPassword";
import ResetPassword from "../features/auth/pages/ResetPassword";
import Dashboard from "../features/end-user/pages/Dashboard";
import BillsPayments from "../features/end-user/pages/BillsPayments";
import BillDetails from "../features/end-user/pages/BillDetails";
import MeterData from "../features/end-user/pages/MeterData";
import Alerts from "../features/end-user/pages/Alerts";
import ProfileSettings from "../features/end-user/pages/ProfileSettings";
import {
    ZoneAlerts,
    ZoneDashboard,
    ZoneMeterDetails,
    ZoneMeters,
    ZoneReports,
    ZoneSettings,
    ZoneUsers,
} from "../features/zone/pages/ZoneAdminPages";

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
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/user/dashboard" element={<Dashboard />} />
                <Route path="/user/bills" element={<BillsPayments />} />
                <Route path="/user/bills/:billId" element={<BillDetails />} />
                <Route path="/user/meter-data" element={<MeterData />} />
                <Route path="/user/alerts" element={<Alerts />} />
                <Route path="/profile" element={<ProfileSettings />} />
            </Route>

            {/* ================= ZONE ADMIN MODULE ================= */}
            <Route element={<AppLayout />}>
                <Route path="/zone" element={<Navigate to="/zone/dashboard" replace />} />
                <Route path="/zone/dashboard" element={<ZoneDashboard />} />
                <Route path="/zone/meters" element={<ZoneMeters />} />
                <Route path="/zone/meters/:meterId" element={<ZoneMeterDetails />} />
                <Route path="/zone/users" element={<ZoneUsers />} />
                <Route path="/zone/reports" element={<ZoneReports />} />
                <Route path="/zone/alerts" element={<ZoneAlerts />} />
                <Route path="/zone/settings" element={<ZoneSettings />} />
            </Route>

            {/* ================= ENTERPRISE MODULE ================= */}
            <Route element={<AppLayout />}>
                <Route path="/enterprise" element={<Navigate to="/enterprise/dashboard" replace />} />
                <Route path="/enterprise/dashboard" element={<PlaceholderPage title="Enterprise Dashboard" />} />
                <Route path="/enterprise/zones" element={<PlaceholderPage title="Zone Management" />} />
                <Route path="/enterprise/zones/:zoneId" element={<PlaceholderPage title="Zone Details" />} />
                <Route path="/enterprise/meters" element={<PlaceholderPage title="Enterprise Meter Management" />} />
                <Route path="/enterprise/users" element={<PlaceholderPage title="Enterprise User & Role Management" />} />
                <Route path="/enterprise/reports" element={<PlaceholderPage title="Enterprise Reports & Analytics" />} />
                <Route path="/enterprise/alerts" element={<PlaceholderPage title="Enterprise Alerts" />} />
                <Route path="/enterprise/audit-logs" element={<PlaceholderPage title="Audit Logs" />} />
                <Route path="/enterprise/settings" element={<PlaceholderPage title="Enterprise Settings & Configuration" />} />
            </Route>

            {/* ================= DEFAULT ROUTES ================= */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<PlaceholderPage title="404 - Page Not Found" />} />
        </Routes>
    );
}

export default AppRoutes;
