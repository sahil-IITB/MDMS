import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Moon, Sun } from "lucide-react";
import Button from "../../../shared/components/Button/Button";
import FormField from "../../../shared/components/FormField/FormField";
import PageHeader from "../../../shared/components/PageHeader";
import { useTheme } from "../../../shared/context/useTheme";
import "./ForgotPassword.css";

function ForgotPassword() {
    const navigate = useNavigate();
    const { theme, toggleTheme } = useTheme();
    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [resendMessage, setResendMessage] = useState("");

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const normalizedEmail = email.trim();
        if (!normalizedEmail) {
            setEmailError("Email address is required");
            return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
            setEmailError("Enter a valid email address");
            return;
        }

        setEmail(normalizedEmail);
        setEmailError("");
        setSubmitted(true);
        setResendMessage("");
    };

    const handleResend = () => {
        // Phase 1 has no email service; this keeps the screen flow interactive.
        setResendMessage("If an account exists for this email, a reset link has been sent.");
    };

    return (
        <main className={`forgot-password-page forgot-password-page--${theme}`}>
            <Button
                type="button"
                variant="secondary"
                size="sm"
                className="forgot-password-theme-toggle"
                onClick={toggleTheme}
                aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            >
                {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
            </Button>
            <section className="forgot-password-card" aria-live="polite">
                <div className="forgot-password-brand" aria-label="Ekta Meter Data Management System">
                    <div className="forgot-password-brand__logo" aria-hidden="true">E</div>
                    <span className="forgot-password-brand__name">Ekta</span>
                    <span className="forgot-password-brand__caption">Meter Data Management System</span>
                </div>

                {!submitted ? (
                    <>
                        <PageHeader
                            title="Forgot password?"
                            description="Enter the email address associated with your account and we’ll help you reset your password."
                        />
                        <form className="forgot-password-form" onSubmit={handleSubmit} noValidate>
                            <FormField
                                label="Email Address"
                                name="email"
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(value) => {
                                    setEmail(value);
                                    setEmailError("");
                                }}
                                error={emailError}
                                required
                            />
                            <Button type="submit" size="lg" fullWidth>Send reset link</Button>
                        </form>
                    </>
                ) : (
                    <div className="forgot-password-confirmation">
                        <div className="forgot-password-confirmation__icon" aria-hidden="true">✉</div>
                        <PageHeader
                            title="Check your email"
                            description={`If an account exists for ${email}, you’ll receive instructions to reset your password.`}
                        />
                        <p className="forgot-password-confirmation__hint">
                            Didn’t receive the email? Check your spam folder or resend the link.
                        </p>
                        {resendMessage && <p className="forgot-password-message" role="status">{resendMessage}</p>}
                        <Button type="button" size="lg" fullWidth onClick={handleResend}>Resend reset link</Button>
                    </div>
                )}

                <div className="forgot-password-footer">
                    <Button type="button" variant="secondary" onClick={() => navigate("/login")}>
                        Back to Login
                    </Button>
                </div>
            </section>
        </main>
    );
}

export default ForgotPassword;
