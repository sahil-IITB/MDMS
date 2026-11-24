import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import FormField from "../../../shared/components/FormField/FormField";
import Button from "../../../shared/components/Button/Button";
import './Login.css';
import { useTheme } from "../../../shared/context/useTheme";
import { Moon, Sun } from "lucide-react";

function Login(){
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const {theme, toggleTheme} = useTheme();

    const [errors, setErrors] = useState({
        email : "",
        password : "",
    });

    const [loginMessage, setLoginMessage] = useState("");

    const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const newErrors = {
            email : "",
            password : "",
        };

        if(!email.trim()) newErrors.email = "Email address is required";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = "Enter a valid email address";

        if(!password.trim()) newErrors.password = "Password is required";

        setErrors(newErrors);
        setLoginMessage("");

        if(newErrors.email || newErrors.password) return;

        // Temporary Login
        console.log("Login submitted : ", {
            email,
            rememberMe,
        });

        setLoginMessage("Login successful! Mock logging working");
    };

    return (
        <div className={`login-page login-page--${theme}`}>
            <Button
                type="button"
                variant="secondary"
                size="sm"
                className="login-theme-toggle"
                onClick={toggleTheme}
                aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            >
                {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
            </Button>
            <div className="login-card">
                {/* Branding */}
                <div className="login-brand">
                    <div className="login-brand__logo">E</div>
                    <h1>Ekta</h1>
                    <p>Meter Data Management System</p>
                </div>

                {/* Heading */}
                <div className="login-heading">
                    <h2>Welcome Back</h2>
                    <p>Sign-in to Access your account</p>
                </div>

                {/* Form */}
                <form className="login-form" onSubmit={handleLogin}>
                    <FormField 
                        label="Email Address"
                        name="email"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(value) => {
                            setEmail(value);
                            setErrors((prev) => ({...prev, email: ""}));
                        }}
                        error={errors.email}
                        required
                    />

                    <div className="login-password-field">
                        <FormField 
                            label="Password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            value={password}
                            onChange={(value) => {
                                setPassword(value);
                                setErrors((prev) => ({...prev, password: ""}));
                            }}
                            error={errors.password}
                            required
                        />

                        <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            className="login-password-toggle"
                            onClick={() => setShowPassword((prev) => !prev)}
                        >
                            {showPassword ? "Hide" : "Show"}
                        </Button>
                    </div>

                    {/* Options */}
                    <div className="login-form__options">
                        <label className="login-remember">
                            <input
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)} 
                            />
                            <span>Remember Me</span>
                        </label>

                        <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            className="login-forgot"
                            onClick={() => navigate("/forgot-password")}
                        >
                            Forgot password?
                        </Button>
                    </div>

                    {/* Mock Login Response */}
                    {loginMessage && (
                        <div className="login-success" role="status">
                            {loginMessage}
                        </div>
                    )}

                    {/* Submit */}
                    <Button type="submit" fullWidth size="lg">Sign In</Button>
                </form>

                <div className="login-footer">
                    <p>Secure access to your utility management portal</p>
                </div>
            </div>
        </div>
    );
}

export default Login;