"use client";

import { forwardRef, type InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className = "", id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-[12px] font-medium text-[#343A40] tracking-[0.2px]">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`w-full text-[14px] px-3 py-[9px] rounded-[8px] border-[0.5px] bg-white transition-all duration-150 focus:outline-none placeholder:text-[#ADB5BD] disabled:opacity-50 disabled:cursor-not-allowed ${
            error
              ? "border-[#EF4444] bg-[#FEE2E2] focus:border-[#EF4444] focus:shadow-[0_0_0_3px_rgba(239,68,68,0.10)]"
              : "border-[#DEE2E6] focus:border-[#4338CA] focus:bg-[#EEF2FF] focus:shadow-[0_0_0_3px_rgba(67,56,202,0.12)]"
          } ${className}`}
          {...props}
        />
        {error && <span className="text-[12px] text-[#EF4444]">{error}</span>}
        {helperText && !error && <span className="text-[12px] text-[#6C757D]">{helperText}</span>}
      </div>
    );
  },
);

Input.displayName = "Input";
export { Input };
export type { InputProps };
