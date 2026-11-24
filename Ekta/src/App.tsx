import { useState } from "react";
import Button from "./shared/components/Button/Button";
import ConfirmDialog from "./shared/components/ConfirmDialog/ConfirmDialog";

function App() {
    const [isOpen, setIsOpen] = useState(false);

    const handleDelete = () => {
        alert("Action Confrimed!");
        setIsOpen(false);
    };

    return (
        <>
            <Button onClick={() => setIsOpen(true)}>Delete Record</Button>

            <ConfirmDialog
                isOpen={isOpen}
                title="Delete Record"
                message="Are you sure you want to delete this record? This action cannot be undone."
                confirmText="Delete"
                cancelText="Cancel"
                variant="danger"
                onConfirm={handleDelete}
                onCancel={() => setIsOpen(false)}
            />
        </>
    );
}

export default App;
