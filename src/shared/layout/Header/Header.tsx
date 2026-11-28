import { useLocation, useNavigate } from "react-router-dom";
import Button from "../../components/Button/Button";
import { Moon, Sun, UserRound } from "lucide-react";
import './Header.css'

/**
 * Header Component
 *
 * Displays the top header of the MDMS application.
 *
 * Features:
 * - Displays the current page title based on the route.
 * - Provides a light/dark theme toggle.
 * - Provides a temporary role switcher for development.
 * - Displays the current user information.
 *
 * Props:
 * - theme: Current application theme.
 * - onToggleTheme: Callback to switch between light and dark themes.
 * - role: Currently selected development role.
 * - onRoleChange: Callback when the development role changes.
 *
 * Usage:
 * Render inside AppLayout above the main page content.
 */

interface HeaderProps{
    theme : "light" | "dark";
    onToggleTheme : () => void;
    role : string;
}

const pageTitles : Record<string, string> = {
    "/dashboard": "Dashboard",
    "/user/dashboard": "Dashboard",
    "/user/bills": "Bills & Payments",
    "/user/meter-data": "Meter Data",
    "/user/alerts": "Alerts & Notifications",
    "/profile": "Profile & Settings",
    "/zone/dashboard": "Zone dashboard",
    "/zone/meters": "Meter management",
    "/zone/users": "User management",
    "/zone/reports": "Reports & analytics",
    "/zone/alerts": "Zone alerts",
    "/zone/settings": "Zone settings",
    "/enterprise/dashboard": "Enterprise dashboard",
};

function Header({
    theme,
    onToggleTheme,
    role,
}: HeaderProps) {
    const location = useLocation();
    const navigate = useNavigate();

    const pageTitle = pageTitles[location.pathname]
        ?? (location.pathname.startsWith("/user/bills/") ? "Bill Details"
            : location.pathname.startsWith("/zone/meters/") ? "Meter details"
            : location.pathname.startsWith("/enterprise/") ? "Enterprise" : "MDMS");

    return (
        <header className="header">
            {/* Current Page */}
            <div className="header__page">
                <h2>{pageTitle}</h2>
            </div>

            {/* Header Actions */}
            <div className="header__actions">
                {/* Temporary Role Switcher */}
                <div className="header__role">
                    <label htmlFor="header-role">Role</label>

                    <select
                        id="header-role"
                        value={role}
                        onChange={(event) => {
                            const nextRole = event.target.value;
                            navigate(nextRole === "Zone Admin" ? "/zone/dashboard" : nextRole === "Enterprise Admin" ? "/enterprise/dashboard" : "/dashboard");
                        }}
                    >
                        <option value="Consumer">Consumer</option>
                        <option value="Zone Admin">Zone Admin</option>
                        <option value="Enterprise Admin">Enterprise Admin</option>
                    </select>
                </div>

                {/* Theme Toggle */}
                <Button
                    variant="outline"
                    size="sm"
                    onClick={onToggleTheme}
                    aria-label={`Switch to ${theme === 'light' ? "dark" : "light"} mode`}
                    title="Toggle Theme"
                >
                    {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                </Button>

                {/* User Profile */}
                <div className="header__user">
                    <div className="header__avatar">
                        <UserRound size={18} />
                    </div>

                    <div className="header__user-info">
                        <span className="header__user-name">MDMS User</span>
                        <span className="header__user-role">{role}</span>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header;
