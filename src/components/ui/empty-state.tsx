"use client";

import type { ReactNode } from "react";
import { Button } from "./button";

interface EmptyStateProps {
  icon: ReactNode;
  heading: string;
  body: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

function EmptyState({ icon, heading, body, action, className = "" }: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center py-16 px-6 text-center ${className}`}>
      <div className="text-[#ADB5BD] mb-4">{icon}</div>
      <h3 className="text-[20px] font-semibold text-[#343A40] font-[family-name:var(--font-display)] mb-2">
        {heading}
      </h3>
      <p className="text-[16px] text-[#6C757D] max-w-sm mb-6 leading-[1.7]">
        {body}
      </p>
      {action && (
        <Button variant="primary" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  );
}

export { EmptyState };
export type { EmptyStateProps };
