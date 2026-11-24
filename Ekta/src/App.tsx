import Button from "./shared/components/Button/Button";

function App() {
    return (
        <div style={{display: "flex", gap:"12px", flexWrap: "wrap", padding: "20px"}}>
            <Button>Primary</Button>

            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="danger">Danger</Button>
            <Button size="sm">Small</Button>
            <Button size="lg">Large</Button>
            <Button disabled>Disabled</Button>
        </div>
    );
}

export default App;
