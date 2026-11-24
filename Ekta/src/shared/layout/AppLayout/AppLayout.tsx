import { Outlet } from "react-router-dom";
import './AppLayout.css';

function AppLayout(){
    return (
        <div className="app-layout">
            <aside className="app-layout__sidebar">
                SideBar
            </aside>

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