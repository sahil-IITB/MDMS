import { useEffect, type ReactNode } from "react";
import "./Modal.css";

/**
 * Modal Component
 *
 * A reusable modal dialog for displaying content above the current page.
 * Useful for forms, details, editing records, and other popup content.
 *
 * Props:
 * - isOpen: Controls whether the modal is visible (required).
 * - onClose: Callback triggered when the modal is closed (required).
 * - title: Heading displayed in the modal header (required).
 * - children: Content rendered inside the modal (required).
 * - width: Custom width of the modal (optional; defaults to 500px).
 *
 * Features:
 * - Conditional rendering based on isOpen.
 * - Close button in the header.
 * - Closes when clicking the backdrop.
 * - Closes when pressing Escape.
 * - Clicks inside the modal do not close it.
 *
 * Usage:
 *
 * <Modal
 *   isOpen={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   title="Add User"
 * >
 *   <p>Modal content goes here.</p>
 * </Modal>
 */


interface ModalProps{
    isOpen : boolean;
    onClose : () => void;
    title : string;
    children : ReactNode;
    width? : string;
}

function Modal({
    isOpen,
    onClose,
    title,
    children,
    width = "500px",
    } : ModalProps
) {
    useEffect(() => {
        if(!isOpen) return;

        const handleEscape = (event: KeyboardEvent) => {
            if(event.key === "Escape") {
                onClose();
            }
        };

        window.addEventListener("keydown", handleEscape);

        return () => {
            window.removeEventListener("keydown", handleEscape)
        };
    }, [isOpen, onClose]);

    if(!isOpen) return null

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div 
                className="modal-container"
                style={{width}}
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-title"
                onClick={(event) => event.stopPropagation()}
            >
                <div className="modal-header">
                    <h2 id="modal-title">{title}</h2>

                    <button
                        className="modal-close"
                        type="button"
                        onClick={onClose}
                        aria-label="Close Modal"
                    >
                        &times;
                    </button>
                </div>

                <div className="modal-content">
                    {children}
                </div>
            </div>
        </div>
    );
}

export default Modal;