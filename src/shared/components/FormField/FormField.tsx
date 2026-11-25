import "./FormField.css";

/**
 * FormField Component
 *
 * A reusable form field component for displaying labeled input fields
 * with support for placeholders, required indicators, helper text,
 * validation errors, and disabled states.
 *
 * Props:
 * - label: The label displayed above the input (required).
 * - name: The unique name and identifier of the input (required).
 * - type: The input type such as text, email, password, etc. (optional, defaults to "text").
 * - placeholder: Placeholder text displayed inside the input (optional).
 * - value: The current value of the input (required).
 * - onChange: Callback function triggered when the input value changes (required).
 * - error: Validation error message displayed below the input (optional).
 * - helperText: Supporting information displayed below the input (optional).
 * - required: Indicates whether the input is mandatory (optional, defaults to false).
 * - disabled: Disables the input field (optional, defaults to false).
 *
 * Usage:
 *
 * <FormField
 *   label="Email Address"
 *   name="email"
 *   type="email"
 *   placeholder="Enter your email"
 *   value={email}
 *   onChange={setEmail}
 *   helperText="Enter your registered email address"
 *   required
 * />
 *
 * This component is used to maintain consistent form field styling
 * and behavior across different forms in the application.
 */

interface FormFieldProps{
    label : string;
    name : string;
    type? : string;
    placeholder? : string;
    value : string;
    onChange : (value: string) => void;
    error? : string;
    helperText? : string;
    required? : boolean;
    disabled? : boolean;
}

function FormField({
    label,
    name,
    type="text",
    placeholder,
    value,
    onChange,
    error,
    helperText,
    required=false,
    disabled=false,
} : FormFieldProps ){
    return(
        <div className="form-field">
            <label className="form-field__label" htmlFor={name}>
                {label}
                {required && <span className="form-field__required">*</span>}
            </label>

            <input 
                id={name}
                name={name}
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                required={required}
                disabled={disabled}
                className={`form-field__input ${error ? "form-field__input--error" : ""}`}
            />

            {error ? (
                <p className="form-field__error">{error}</p>
            ) : helperText ? (
                <p className="form-field__helper">{helperText}</p>
            ) : null}
        </div>
    );
}

export default FormField;