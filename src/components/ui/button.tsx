"use client";

import { forwardRef, type ButtonHTMLAttributes } from "react";
import { Loader2 } from "lucide-react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: React.ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-[#4338CA] text-white border-none hover:bg-[#3730A3] active:bg-[#312E81] disabled:opacity-40 disabled:cursor-not-allowed",
  secondary:
    "bg-transparent text-[#343A40] border-[0.5px] border-[#DEE2E6] hover:bg-[#F1F3F5] disabled:opacity-40 disabled:cursor-not-allowed",
  ghost:
    "bg-transparent text-[#4338CA] border-none disabled:opacity-40 disabled:cursor-not-allowed",
  danger:
    "bg-transparent text-[#EF4444] border-[0.5px] border-[#FECACA] disabled:opacity-40 disabled:cursor-not-allowed",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "text-[12px] px-3 py-[5px] rounded-[6px]",
  md: "text-[13px] px-4 py-2 rounded-[8px]",
  lg: "text-[15px] px-6 py-3 rounded-[10px]",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", loading, icon, children, className = "", disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={`inline-flex items-center justify-center gap-2 font-medium transition-all duration-150 focus-visible:outline-2 focus-visible:outline-[#4338CA] focus-visible:outline-offset-2 cursor-pointer ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
        {...props}
      >
        {loading ? <Loader2 className="animate-spin" size={size === "sm" ? 14 : size === "lg" ? 20 : 16} /> : icon}
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";
export { Button };
export type { ButtonProps, ButtonVariant, ButtonSize };
