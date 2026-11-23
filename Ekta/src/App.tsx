import PageHeader from "./shared/components/PageHeader";


function App() {
    return (
        <div style={{padding : "24px"}}>
            <PageHeader 
            title="Dashboard"
            description = "Overview of your electricity  consumption and account "
            actions = {
                <>
                    <button>Export</button>
                    <button>Edit</button>
                </>
            }
            />
        </div>
    );
}

export default App;
