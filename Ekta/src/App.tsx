import { useState } from "react";
import FormField from "./shared/components/FormField/FormField";



function App() {
    const [email, setEmail] = useState("");
    return (
        <div style={{maxWidth: "400px", padding: "24px"}}>
            <FormField 
                label="Email Address"
                name="Email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={setEmail}
                helperText="Enter your registered email address"
                required
            />
        </div>
    );
}

export default App;
