import { useState } from "react";
import Modal from "./shared/components/Modal/Modal"

function App() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return(
        <div>
            <button onClick={() => setIsModalOpen(true)}>Open Modal</button>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="User Details"
            >
                <p>This is Modal Content</p>
                <p>You Can put forms, text, or other components here</p>

                <button onClick={() => setIsModalOpen(false)}>Close</button>
            </Modal>
        </div>
    );
}

export default App;
