import type { CSSProperties } from "react";

/**
 * Skeleton Component
 *
 * A reusable placeholder component displayed while content is loading.
 * Mimics the shape and layout of actual content to provide a better
 * loading experience and reduce perceived waiting time.
 *
 * Supports text, circular, and rectangular variants with configurable
 * dimensions, border radius, and custom CSS classes.
 *
 * Props:
 * - variant: Defines the placeholder shape ("text", "circular", or "rectangular").
 * - width: Sets the skeleton width (string or number).
 * - height: Sets the skeleton height (string or number).
 * - borderRadius: Customizes the corner radius (optional).
 * - className: Additional CSS class for custom styling (optional).
 *
 * Usage:
 *
 * <Skeleton variant="text" width="70%" height="16px" />
 *
 * <Skeleton variant="circular" width={48} height={48} />
 *
 * <Skeleton variant="rectangular" width="100%" height="120px" />
 */


interface SkeletonProps{
    variant? : "text" | "circular" | "rectangular";
    width? : string | number;
    height? : string | number;
    borderRadius? : string;
    className? : string;
}

function Skeleton({
    variant="rectangular",
    width="100%",
    height="16px",
    borderRadius,
    className="",
} : SkeletonProps) {
    const style : CSSProperties = {
        width,
        height,
        borderRadius: borderRadius ?? (variant === "circular" ? "50%" : variant === "text" ? "4px" : "8px"),
    };

    return (
        <div
            className={`skeleton skeleton--${variant} ${className}`.trim()}
            style={style}
            aria-hidden="true"
        />
    );
}

export default Skeleton;