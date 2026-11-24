import {
    LayoutDashboard,
    Receipt,
    Gauge,
    Bell,
    Settings,
    Zap
} from "lucide-react"
import { NavLink } from "react-router-dom";

const navItems = [
    { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { label: "Bills & Payments", path: "/bills", icon: Receipt },
    { label: "Meter Data", path: "/meter-data", icon: Gauge },
    { label: "Alerts", path: "/alerts", icon: Bell },
    { label: "Profile & Settings", path: "/profile", icon: Settings },
];

function Sidebar() {
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
                <span className="sidebar__section-title">MENU</span>

                {navItems.map(({label, path, icon:Icon}) => (
                    <NavLink
                        key={path}
                        to={path}
                        className={({isActive}) => `sidebar__link ${isActive ? "sidebar__link--active" : ""}`}
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