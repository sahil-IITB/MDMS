import Skeleton from "./shared/components/Loader/Skeleton";
function App() {
    return (
        <div className="dashboard-card">
            <Skeleton variant="text" width="40%" height="14px" />

            <Skeleton variant="text" width="60%" height="28px" />

            <Skeleton variant="text" width="80%" height="12px" />
        </div>
    );
}

export default App;
