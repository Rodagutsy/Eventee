"use client";

import type { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "elevated" | "tint";
  padding?: "sm" | "md" | "lg" | "none";
}

const variantClasses = {
  default: "bg-white border-[0.5px] border-[#DEE2E6]",
  elevated: "bg-white border-[0.5px] border-[#CED4DA]",
  tint: "bg-[#F8F9FA] border-[0.5px] border-[#DEE2E6]",
};

const paddingClasses = {
  sm: "p-3",
  md: "p-4",
  lg: "p-6",
  none: "",
};

function Card({ variant = "default", padding = "md", className = "", children, ...props }: CardProps) {
  return (
    <div className={`rounded-[12px] ${variantClasses[variant]} ${paddingClasses[padding]} ${className}`} {...props}>
      {children}
    </div>
  );
}

export { Card };
export type { CardProps };
