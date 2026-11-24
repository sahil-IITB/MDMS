import { Outlet } from "react-router-dom";
import './AppLayout.css';
import Sidebar from "../Sidebar/Sidebar";

function AppLayout(){
    return (
        <div className="app-layout">
            <Sidebar />

            <div className="app-layout__main">
                <header className="app-layout__header">
                    Header
                </header>

                <main className="app-layout__content">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default AppLayout;