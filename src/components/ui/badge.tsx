"use client";

import type { ReactNode } from "react";

type BadgeVariant =
  | "published"
  | "saved"
  | "draft"
  | "checkedIn"
  | "duplicate"
  | "invalid"
  | "vip"
  | "success"
  | "warning"
  | "danger"
  | "pending"
  | "info";

interface BadgeProps {
  variant?: BadgeVariant;
  children: ReactNode;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  published: "bg-[#EEF2FF] text-[#312E81]",
  saved: "bg-[#EAF7EF] text-[#166534]",
  draft: "bg-[#F1F3F5] text-[#495057]",
  checkedIn: "bg-[#EAF7EF] text-[#166534]",
  duplicate: "bg-[#FEF3C7] text-[#92400E]",
  invalid: "bg-[#FEE2E2] text-[#991B1B]",
  vip: "bg-[#FDF6E3] text-[#8B6914]",
  success: "bg-[#EAF7EF] text-[#166534]",
  warning: "bg-[#FEF3C7] text-[#92400E]",
  danger: "bg-[#FEE2E2] text-[#991B1B]",
  pending: "bg-[#F1F3F5] text-[#6C757D]",
  info: "bg-[#EEF2FF] text-[#312E81]",
};

function Badge({ variant = "draft", children, className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center text-[11px] font-semibold px-2 py-[3px] rounded-full ${variantClasses[variant]} ${className}`}
    >
      {children}
    </span>
  );
}

export { Badge };
export type { BadgeVariant };
