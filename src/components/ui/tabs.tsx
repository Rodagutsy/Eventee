"use client";

import { useState, type ReactNode } from "react";

interface Tab {
  id: string;
  label: string;
  badge?: number;
}

interface TabsProps {
  tabs: Tab[];
  activeTab?: string;
  onChange?: (tabId: string) => void;
  children?: (activeTab: string) => ReactNode;
  className?: string;
}

function Tabs({ tabs, activeTab: controlledActive, onChange, children, className = "" }: TabsProps) {
  const [internalActive, setInternalActive] = useState(tabs[0]?.id || "");
  const activeTab = controlledActive ?? internalActive;

  const handleChange = (tabId: string) => {
    if (!controlledActive) setInternalActive(tabId);
    onChange?.(tabId);
  };

  return (
    <div className={className}>
      <div className="flex border-b border-[#DEE2E6] overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleChange(tab.id)}
            className={`px-4 py-3 text-[12px] font-medium whitespace-nowrap transition-colors duration-200 cursor-pointer ${
              activeTab === tab.id
                ? "text-[#4338CA] border-b-2 border-[#4338CA]"
                : "text-[#6C757D] hover:text-[#343A40]"
            }`}
          >
            {tab.label}
            {tab.badge !== undefined && (
              <span className="ml-2 px-1.5 py-0.5 text-[10px] font-semibold rounded-full bg-[#EEF2FF] text-[#4338CA]">
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>
      {children?.(activeTab)}
    </div>
  );
}

export { Tabs };
export type { Tab, TabsProps };
