import { Outlet } from "react-router-dom";
import Sidebar from "../Sidebar/Sidebar";
import Header from "../Header/Header";
import { useState } from "react";
import '../../theme/theme.css';
import './AppLayout.css';
import { useTheme } from "../../context/useTheme";

/**
 * AppLayout Component
 *
 * Provides the common layout structure for authenticated pages.
 * It includes the Sidebar, Header, and main content area.
 *
 * Features:
 * - Persistent sidebar navigation.
 * - Header with theme toggle and temporary role switcher.
 * - Outlet for rendering the active child route.
 *
 * Usage:
 * Used as a parent route element in routes.tsx.
 */

function AppLayout(){
    const {theme, toggleTheme} = useTheme();
    const [role, setRole] = useState("User");

    return (
        <div className={`app-layout app-layout--${theme}`}>
            <Sidebar />

            <div className="app-layout__main">
                <Header
                    theme={theme}
                    onToggleTheme={toggleTheme}
                    role={role}
                    onRoleChange={setRole}
                />

                <main className="app-layout__content">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default AppLayout;