import {
    LayoutDashboard,
    Receipt,
    Gauge,
    Bell,
    Settings,
    Zap,
    Users,
    BarChart3,
    ClipboardList,
    MapPinned,
} from "lucide-react"
import { NavLink, useLocation } from "react-router-dom";
import './Sidebar.css';

/**
 * Sidebar Component
 *
 * Provides the primary navigation for the MDMS application.
 * Displays the application branding and links to the main pages.
 *
 * Features:
 * - Navigation using React Router NavLink.
 * - Automatic active route highlighting.
 * - Icons for each navigation item.
 *
 * Usage:
 * Render inside AppLayout to provide navigation across the application.
 */



const userNavItems = [
    { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { label: "Bills & Payments", path: "/user/bills", icon: Receipt },
    { label: "Meter Data", path: "/user/meter-data", icon: Gauge },
    { label: "Alerts", path: "/user/alerts", icon: Bell },
    { label: "Profile & Settings", path: "/profile", icon: Settings },
];

const zoneNavItems = [
    { label: "Zone dashboard", path: "/zone/dashboard", icon: LayoutDashboard },
    { label: "Meter management", path: "/zone/meters", icon: Gauge },
    { label: "User management", path: "/zone/users", icon: Users },
    { label: "Reports & analytics", path: "/zone/reports", icon: BarChart3 },
    { label: "Alerts", path: "/zone/alerts", icon: Bell },
    { label: "Zone settings", path: "/zone/settings", icon: Settings },
];

const enterpriseNavItems = [
    { label: "Enterprise dashboard", path: "/enterprise/dashboard", icon: LayoutDashboard },
    { label: "Zone management", path: "/enterprise/zones", icon: MapPinned },
    { label: "Meter management", path: "/enterprise/meters", icon: Gauge },
    { label: "User management", path: "/enterprise/users", icon: Users },
    { label: "Reports & analytics", path: "/enterprise/reports", icon: BarChart3 },
    { label: "Alerts", path: "/enterprise/alerts", icon: Bell },
    { label: "Audit logs", path: "/enterprise/audit-logs", icon: ClipboardList },
    { label: "Settings", path: "/enterprise/settings", icon: Settings },
];

function Sidebar() {
    const { pathname } = useLocation();
    const isZone = pathname.startsWith("/zone");
    const isEnterprise = pathname.startsWith("/enterprise");
    const navItems = isZone ? zoneNavItems : isEnterprise ? enterpriseNavItems : userNavItems;
    const sectionTitle = isZone ? "ZONE ADMIN" : isEnterprise ? "ENTERPRISE" : "MENU";

    return (
        <aside className="sidebar">
            {/* Application Branding */}
            <div className="sidebar__brand">
                <div className="sidebar__brand-icon">
                    <Zap size={22} />
                </div>

                <div className="sidebar__brand-info">
                    <h1>MDMS</h1>
                    <span>Meter Data Management</span>
                </div>
            </div>

            {/* Navigation */}
            <nav className="sidebar__nav">
                <span className="sidebar__section-title">{sectionTitle}</span>

                {navItems.map(({label, path, icon:Icon}) => (
                    <NavLink
                        key={path}
                        to={path}
                        end={path === "/dashboard" || path.endsWith("/dashboard")}
                        className={({isActive}) => `sidebar__link ${isActive || (path === "/zone/meters" && pathname.startsWith("/zone/meters/")) ? "sidebar__link--active" : ""}`}
                    >
                        <Icon size={20} />
                        <span>{label}</span>
                    </NavLink>
                ))}
            </nav>
        </aside>
    );
}

export default Sidebar;
