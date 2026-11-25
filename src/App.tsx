import AppRoutes from "./app/routes";
import ThemeProvider from "./shared/context/ThemeProvider";

function App() {
    return (
        <ThemeProvider>
            <AppRoutes/>
        </ThemeProvider>
    )
}

export default App;
