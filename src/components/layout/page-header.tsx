"use client";

import type { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

function PageHeader({ title, description, action, className = "" }: PageHeaderProps) {
  return (
    <div className={`flex items-start justify-between mb-6 ${className}`}>
      <div>
        <h1 className="text-[26px] font-semibold text-[#212529] font-[family-name:var(--font-display)] tracking-[-0.8px]">
          {title}
        </h1>
        {description && <p className="text-[14px] text-[#6C757D] mt-1">{description}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

export { PageHeader };
export type { PageHeaderProps };
