import type { ButtonHTMLAttributes } from "react";
import "./Button.css";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant? : "primary" | "secondary" | "outline" | "danger";
    size? : "sm" | "md" | "lg"; 
    fullWidth? : boolean;
}

function Button({
    children,
    variant="primary",
    size="md",
    fullWidth=false,
    type="button",
    className="",
    ...props
} : ButtonProps) {
    return (
        <button
            type={type}
            className={`btn btn-${variant} btn-${size} ${fullWidth ? "btn-full-width" : ""} ${className}`} {...props}>{children}</button>
    );
}

export default Button;