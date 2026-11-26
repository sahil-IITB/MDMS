import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { Bell, Check, Eye, EyeOff, LockKeyhole, UserRound } from "lucide-react";
import Button from "../../../shared/components/Button/Button";
import EmptyState from "../../../shared/components/EmptyState/EmptyState";
import FormField from "../../../shared/components/FormField/FormField";
import Loader from "../../../shared/components/Loader/Loader";
import PageHeader from "../../../shared/components/PageHeader";
import { getCurrentUserProfile } from "../services/profileService";
import type { NotificationPreferences, UserProfile } from "../types/profile";
import "./ProfileSettings.css";

type ProfileTab = "profile" | "security" | "notifications";
type LoadState =
    | { status: "loading" }
    | { status: "success"; profile: UserProfile }
    | { status: "error"; message: string };

const TAB_INFO: Record<ProfileTab, { label: string; icon: ReactNode }> = {
    profile: { label: "Profile", icon: <UserRound size={17} /> },
    security: { label: "Security", icon: <LockKeyhole size={17} /> },
    notifications: { label: "Notifications", icon: <Bell size={17} /> },
};

function ProfileSettings() {
    const [activeTab, setActiveTab] = useState<ProfileTab>("profile");
    const [loadAttempt, setLoadAttempt] = useState(0);
    const [loadState, setLoadState] = useState<LoadState>({ status: "loading" });
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [profileErrors, setProfileErrors] = useState({ name: "", email: "", phone: "" });
    const [profileMessage, setProfileMessage] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPasswords, setShowPasswords] = useState(false);
    const [securityErrors, setSecurityErrors] = useState({ current: "", next: "", confirm: "" });
    const [securityMessage, setSecurityMessage] = useState("");
    const [preferences, setPreferences] = useState<NotificationPreferences>({ email: true, sms: false });
    const [notificationMessage, setNotificationMessage] = useState("");

    useEffect(() => {
        let isCurrent = true;

        getCurrentUserProfile()
            .then((response) => {
                if (!isCurrent) return;
                const profile = response.data;
                setLoadState({ status: "success", profile });
                setName(profile.name);
                setEmail(profile.email);
                setPhone(profile.phone);
                setPreferences(profile.notificationPreferences);
            })
            .catch(() => {
                if (isCurrent) {
                    setLoadState({
                        status: "error",
                        message: "Your profile could not be loaded. Check your connection and try again.",
                    });
                }
            });

        return () => {
            isCurrent = false;
        };
    }, [loadAttempt]);

    const handleProfileSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const nextErrors = { name: "", email: "", phone: "" };
        const normalizedEmail = email.trim();
        const normalizedPhone = phone.trim();

        if (!name.trim()) nextErrors.name = "Name is required";
        if (!normalizedEmail) nextErrors.email = "Email address is required";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
            nextErrors.email = "Enter a valid email address";
        }
        if (!normalizedPhone) nextErrors.phone = "Phone number is required";
        else if (!/^[+\d][\d\s()-]{7,17}$/.test(normalizedPhone)) {
            nextErrors.phone = "Enter a valid phone number";
        }

        setProfileErrors(nextErrors);
        setProfileMessage("");

        if (!nextErrors.name && !nextErrors.email && !nextErrors.phone) {
            setProfileMessage("Details are valid. Profile changes are not saved in Phase 1.");
        }
    };

    const handleSecuritySubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const nextErrors = { current: "", next: "", confirm: "" };

        if (!currentPassword) nextErrors.current = "Current password is required";
        if (!newPassword) nextErrors.next = "New password is required";
        else if (newPassword.length < 8 || !/[a-z]/.test(newPassword) || !/[A-Z]/.test(newPassword) || !/\d/.test(newPassword)) {
            nextErrors.next = "Use at least 8 characters with uppercase, lowercase, and a number";
        } else if (newPassword === currentPassword) {
            nextErrors.next = "Choose a password different from your current one";
        }
        if (!confirmPassword) nextErrors.confirm = "Please confirm your new password";
        else if (newPassword !== confirmPassword) nextErrors.confirm = "Passwords do not match";

        setSecurityErrors(nextErrors);
        setSecurityMessage("");

        if (!nextErrors.current && !nextErrors.next && !nextErrors.confirm) {
            setSecurityMessage("Password meets the requirements. Password changes are not saved in Phase 1.");
        }
    };

    const handlePreferenceChange = (key: keyof NotificationPreferences, value: boolean) => {
        setPreferences((current) => ({ ...current, [key]: value }));
        setNotificationMessage("Preference updated for this session. Changes are not saved in Phase 1.");
    };

    return (
        <div className="profile-settings-page">
            <PageHeader
                title="Profile & Settings"
                description="Manage your personal details, account security, and notification preferences."
            />

            {loadState.status === "loading" ? (
                <div className="profile-settings-loading"><Loader size="lg" /></div>
            ) : loadState.status === "error" ? (
                <EmptyState
                    title="Profile unavailable"
                    description={loadState.message}
                    icon={<UserRound size={26} />}
                    action={<Button onClick={() => setLoadAttempt((attempt) => attempt + 1)}>Try again</Button>}
                />
            ) : (
                <section className="profile-settings-panel" aria-label="Profile settings">
                    <div className="profile-settings-tabs" role="tablist" aria-label="Profile settings sections">
                        {(Object.keys(TAB_INFO) as ProfileTab[]).map((tab) => (
                            <button
                                className={`profile-settings-tabs__tab${activeTab === tab ? " profile-settings-tabs__tab--active" : ""}`}
                                id={`profile-tab-${tab}`}
                                key={tab}
                                type="button"
                                role="tab"
                                aria-selected={activeTab === tab}
                                aria-controls={`profile-panel-${tab}`}
                                onClick={() => setActiveTab(tab)}
                            >
                                {TAB_INFO[tab].icon}
                                {TAB_INFO[tab].label}
                            </button>
                        ))}
                    </div>

                    <div
                        className="profile-settings-content"
                        id={`profile-panel-${activeTab}`}
                        role="tabpanel"
                        aria-labelledby={`profile-tab-${activeTab}`}
                        tabIndex={0}
                    >
                        {activeTab === "profile" ? (
                            <form className="profile-settings-form" onSubmit={handleProfileSubmit} noValidate>
                                <div className="profile-settings-section-heading">
                                    <div className="profile-settings-section-heading__icon"><UserRound size={18} /></div>
                                    <div>
                                        <h2>Personal information</h2>
                                        <p>Keep your contact details up to date.</p>
                                    </div>
                                </div>
                                <div className="profile-settings-fields">
                                    <FormField
                                        label="Full name"
                                        name="profile-name"
                                        value={name}
                                        onChange={(value) => {
                                            setName(value);
                                            setProfileErrors((errors) => ({ ...errors, name: "" }));
                                        }}
                                        error={profileErrors.name}
                                        required
                                    />
                                    <FormField
                                        label="Email address"
                                        name="profile-email"
                                        type="email"
                                        value={email}
                                        onChange={(value) => {
                                            setEmail(value);
                                            setProfileErrors((errors) => ({ ...errors, email: "" }));
                                        }}
                                        error={profileErrors.email}
                                        required
                                    />
                                    <FormField
                                        label="Phone number"
                                        name="profile-phone"
                                        type="tel"
                                        value={phone}
                                        onChange={(value) => {
                                            setPhone(value);
                                            setProfileErrors((errors) => ({ ...errors, phone: "" }));
                                        }}
                                        error={profileErrors.phone}
                                        required
                                    />
                                </div>
                                {profileMessage && <p className="profile-settings-message" role="status"><Check size={16} />{profileMessage}</p>}
                                <div className="profile-settings-actions">
                                    <Button type="submit">Save changes</Button>
                                </div>
                            </form>
                        ) : null}

                        {activeTab === "security" ? (
                            <form className="profile-settings-form" onSubmit={handleSecuritySubmit} noValidate>
                                <div className="profile-settings-section-heading">
                                    <div className="profile-settings-section-heading__icon"><LockKeyhole size={18} /></div>
                                    <div>
                                        <h2>Security</h2>
                                        <p>Choose a strong password to protect your account.</p>
                                    </div>
                                </div>
                                <div className="profile-settings-fields profile-settings-fields--single">
                                    <FormField
                                        label="Current password"
                                        name="current-password"
                                        type={showPasswords ? "text" : "password"}
                                        value={currentPassword}
                                        onChange={(value) => {
                                            setCurrentPassword(value);
                                            setSecurityErrors((errors) => ({ ...errors, current: "" }));
                                        }}
                                        error={securityErrors.current}
                                        required
                                    />
                                    <FormField
                                        label="New password"
                                        name="new-password-settings"
                                        type={showPasswords ? "text" : "password"}
                                        value={newPassword}
                                        onChange={(value) => {
                                            setNewPassword(value);
                                            setSecurityErrors((errors) => ({ ...errors, next: "" }));
                                        }}
                                        error={securityErrors.next}
                                        helperText="At least 8 characters, including uppercase, lowercase, and a number."
                                        required
                                    />
                                    <FormField
                                        label="Confirm new password"
                                        name="confirm-password-settings"
                                        type={showPasswords ? "text" : "password"}
                                        value={confirmPassword}
                                        onChange={(value) => {
                                            setConfirmPassword(value);
                                            setSecurityErrors((errors) => ({ ...errors, confirm: "" }));
                                        }}
                                        error={securityErrors.confirm}
                                        required
                                    />
                                </div>
                                <Button
                                    type="button"
                                    variant="secondary"
                                    size="sm"
                                    className="profile-password-visibility"
                                    onClick={() => setShowPasswords((visible) => !visible)}
                                >
                                    {showPasswords ? <EyeOff size={16} /> : <Eye size={16} />}
                                    {showPasswords ? "Hide passwords" : "Show passwords"}
                                </Button>
                                {securityMessage && <p className="profile-settings-message" role="status"><Check size={16} />{securityMessage}</p>}
                                <div className="profile-settings-actions">
                                    <Button type="submit">Update password</Button>
                                </div>
                            </form>
                        ) : null}

                        {activeTab === "notifications" ? (
                            <div className="profile-settings-form">
                                <div className="profile-settings-section-heading">
                                    <div className="profile-settings-section-heading__icon"><Bell size={18} /></div>
                                    <div>
                                        <h2>Notification preferences</h2>
                                        <p>Choose how you’d like to receive account updates.</p>
                                    </div>
                                </div>
                                <div className="notification-preferences">
                                    <label className="notification-preference" htmlFor="notification-email">
                                        <span className="notification-preference__copy">
                                            <strong>Email notifications</strong>
                                            <small>Bill reminders, payment receipts, and important account updates.</small>
                                        </span>
                                        <input
                                            id="notification-email"
                                            type="checkbox"
                                            role="switch"
                                            checked={preferences.email}
                                            onChange={(event) => handlePreferenceChange("email", event.target.checked)}
                                        />
                                    </label>
                                    <label className="notification-preference" htmlFor="notification-sms">
                                        <span className="notification-preference__copy">
                                            <strong>SMS notifications</strong>
                                            <small>Time-sensitive reminders and service announcements by text.</small>
                                        </span>
                                        <input
                                            id="notification-sms"
                                            type="checkbox"
                                            role="switch"
                                            checked={preferences.sms}
                                            onChange={(event) => handlePreferenceChange("sms", event.target.checked)}
                                        />
                                    </label>
                                </div>
                                {notificationMessage && <p className="profile-settings-message" role="status"><Check size={16} />{notificationMessage}</p>}
                            </div>
                        ) : null}
                    </div>
                </section>
            )}
        </div>
    );
}

export default ProfileSettings;
