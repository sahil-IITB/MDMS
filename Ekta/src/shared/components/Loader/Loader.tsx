import "./Loader.css";

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