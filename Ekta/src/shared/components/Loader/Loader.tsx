import "./Loader.css";

/**
 * Loader Component
 *
 * A reusable loading spinner used to indicate that an operation
 * or data-fetching process is currently in progress.
 *
 * Supports configurable sizes, color, and custom CSS classes
 * to fit different parts of the application.
 *
 * Props:
 * - size: Controls the spinner size ("sm", "md", or "lg").
 * - color: Sets the spinner color (optional).
 * - className: Additional CSS class for custom styling (optional).
 *
 * Usage:
 *
 * <Loader size="md" color="var(--primary)" />
 *
 * <Loader size="sm" />
 *
 * <Loader size="lg" className="custom-loader" />
 */


interface LoaderProps{
    size? : "sm" | "md" | "lg";
    color? : string;
    className? : string;
}

function Loader({
    size="md",
    color="currentColor",
    className="",
} : LoaderProps) {
    return (
        <div
            className={`loader ${className}`.trim()}
            role="status"
            aria-label="Loading">
                <span
                    className={`loader__spinner loader__spinner--${size}`}
                    style={{color}}
                    aria-hidden="true" 
                />
        </div>
    );
}

export default Loader;