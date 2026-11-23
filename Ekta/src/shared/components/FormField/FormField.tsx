import "./FormField.css";

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