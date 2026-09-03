"use client";

import { useState } from "react";

function FieldLabel({ htmlFor, label, required, srOnly }) {
  if (srOnly) {
    return (
      <label htmlFor={htmlFor} className="sr-only">
        {label}
      </label>
    );
  }
  return (
    <label htmlFor={htmlFor} className="field-label">
      {label}
      {required && <span className="ml-1 text-gold-bright">*</span>}
    </label>
  );
}

export function TextField({ label, srOnlyLabel = false, className = "", ...props }) {
  return (
    <div className={className}>
      <FieldLabel htmlFor={props.id} label={label} required={props.required} srOnly={srOnlyLabel} />
      <input {...props} className="field-input" />
    </div>
  );
}

export function SelectField({ label, srOnlyLabel = false, className = "", children, ...props }) {
  return (
    <div className={className}>
      <FieldLabel htmlFor={props.id} label={label} required={props.required} srOnly={srOnlyLabel} />
      <select {...props} className="field-input">
        {children}
      </select>
    </div>
  );
}

function EyeIcon({ open }) {
  return open ? (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
      />
    </svg>
  ) : (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
      />
    </svg>
  );
}

export function PasswordField({ label, srOnlyLabel = false, className = "", ...props }) {
  const [show, setShow] = useState(false);
  return (
    <div className={className}>
      <FieldLabel htmlFor={props.id} label={label} required={props.required} srOnly={srOnlyLabel} />
      <div className="relative">
        <input {...props} type={show ? "text" : "password"} className="field-input pr-12" />
        <button
          type="button"
          onClick={() => setShow((v) => !v)}
          aria-label={show ? "Hide password" : "Show password"}
          className="absolute inset-y-0 right-2 flex w-9 items-center justify-center text-ink-faint transition-colors hover:text-gold-ink"
        >
          <EyeIcon open={show} />
        </button>
      </div>
    </div>
  );
}
