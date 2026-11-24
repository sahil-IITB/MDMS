import Modal from "../Modal/Modal";
import Button from "../Button/Button";
import "./ConfirmDialog.css";

interface ConfirmDialogProps{
    isOpen : boolean;
    title : string;
    message : string;
    onConfirm : () => void;
    onCancel : () => void;
    confirmText? : string;
    cancelText? : string;
    variant? : "primary" | "danger"
}

function ConfirmDialog({
    isOpen,
    title,
    message,
    onConfirm,
    onCancel,
    confirmText="Confirm",
    cancelText="Cancel",
    variant="primary",
} : ConfirmDialogProps) {
    return (
        <Modal isOpen={isOpen} onClose={onCancel} title={title}>
            <div className="confirm-dialog">
                <p className="confirm-dialog__message">{message}</p>

                <div className="confirm-dialog__actions">
                    <Button variant="secondary" onClick={onCancel}>{cancelText}</Button>

                    <Button 
                        variant="primary"
                        className={`confirm-dialog__confirm confirm-dialog__confirm--${variant}`}
                        onClick={onConfirm}
                        >
                        {confirmText}
                    </Button>
                </div>
            </div>
        </Modal>
    );
}

export default ConfirmDialog;