import { useState, type FormEvent } from "react";
import { Eye, EyeOff, Moon, Sun } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Button from "../../../shared/components/Button/Button";
import FormField from "../../../shared/components/FormField/FormField";
import PageHeader from "../../../shared/components/PageHeader";
import { useTheme } from "../../../shared/context/useTheme";
import "./ResetPassword.css";

function ResetPassword() {
    const navigate = useNavigate();
    const { theme, toggleTheme } = useTheme();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordError, setPasswordError] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");
    const [updated, setUpdated] = useState(false);

    const hasMinimumLength = password.length >= 8;
    const hasUpperAndLowerCase = /[a-z]/.test(password) && /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const nextPasswordError = !password
            ? "New password is required"
            : !hasMinimumLength || !hasUpperAndLowerCase || !hasNumber
                ? "Your password does not meet all the requirements"
                : "";
        const nextConfirmPasswordError = !confirmPassword
            ? "Please confirm your new password"
            : password !== confirmPassword
                ? "Passwords do not match"
                : "";

        setPasswordError(nextPasswordError);
        setConfirmPasswordError(nextConfirmPasswordError);

        if (!nextPasswordError && !nextConfirmPasswordError) {
            // Phase 1 screens do not save data or validate reset tokens.
            setUpdated(true);
        }
    };

    return (
        <main className={`reset-password-page reset-password-page--${theme}`}>
            <Button
                type="button"
                variant="secondary"
                size="sm"
                className="reset-password-theme-toggle"
                onClick={toggleTheme}
                aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            >
                {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
            </Button>

            <section className="reset-password-card" aria-live="polite">
                <div className="reset-password-brand" aria-label="Ekta Meter Data Management System">
                    <div className="reset-password-brand__logo" aria-hidden="true">E</div>
                    <span className="reset-password-brand__name">Ekta</span>
                    <span className="reset-password-brand__caption">Meter Data Management System</span>
                </div>

                {!updated ? (
                    <>
                        <PageHeader
                            title="Reset your password"
                            description="Choose a new password for your account."
                        />
                        <form className="reset-password-form" onSubmit={handleSubmit} noValidate>
                            <div className="reset-password-field">
                                <FormField
                                    label="New Password"
                                    name="new-password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter a new password"
                                    value={password}
                                    onChange={(value) => {
                                        setPassword(value);
                                        setPasswordError("");
                                    }}
                                    error={passwordError}
                                    required
                                />
                                <Button
                                    type="button"
                                    variant="secondary"
                                    size="sm"
                                    className="reset-password-visibility-toggle"
                                    onClick={() => setShowPassword((visible) => !visible)}
                                    aria-label={showPassword ? "Hide new password" : "Show new password"}
                                >
                                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                                </Button>
                            </div>

                            <ul className="reset-password-requirements" aria-label="Password requirements">
                                <li className={hasMinimumLength ? "is-met" : ""}>At least 8 characters</li>
                                <li className={hasUpperAndLowerCase ? "is-met" : ""}>Uppercase and lowercase letters</li>
                                <li className={hasNumber ? "is-met" : ""}>At least one number</li>
                            </ul>

                            <div className="reset-password-field">
                                <FormField
                                    label="Confirm New Password"
                                    name="confirm-password"
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="Re-enter your new password"
                                    value={confirmPassword}
                                    onChange={(value) => {
                                        setConfirmPassword(value);
                                        setConfirmPasswordError("");
                                    }}
                                    error={confirmPasswordError}
                                    required
                                />
                                <Button
                                    type="button"
                                    variant="secondary"
                                    size="sm"
                                    className="reset-password-visibility-toggle"
                                    onClick={() => setShowConfirmPassword((visible) => !visible)}
                                    aria-label={showConfirmPassword ? "Hide confirmation password" : "Show confirmation password"}
                                >
                                    {showConfirmPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                                </Button>
                            </div>

                            <Button type="submit" size="lg" fullWidth>Update Password</Button>
                        </form>
                    </>
                ) : (
                    <div className="reset-password-success">
                        <div className="reset-password-success__icon" aria-hidden="true">✓</div>
                        <PageHeader
                            title="Password updated"
                            description="Your password has been updated. You can now sign in with your new password."
                        />
                        <Button type="button" size="lg" fullWidth onClick={() => navigate("/login")}>
                            Back to Login
                        </Button>
                    </div>
                )}
            </section>
        </main>
    );
}

export default ResetPassword;
