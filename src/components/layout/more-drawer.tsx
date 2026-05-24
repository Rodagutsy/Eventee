"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  Settings,
  MessageSquare,
  ShoppingCart,
  Truck,
  BarChart3,
  Download,
  Shield,
  LogOut,
  FileText,
  X,
  Package,
} from "lucide-react";
import { useEvent } from "@/lib/event-context";

interface MoreDrawerProps {
  open: boolean;
  onClose: () => void;
}

const menuSections = [
  {
    heading: "Event Management",
    items: [
      { label: "Seating", icon: LayoutGrid, href: (eid: string) => `/events/${eid}/seating` },
      { label: "Event Settings", icon: Settings, href: (eid: string) => `/events/${eid}/settings` },
    ],
  },
  {
    heading: "Communication",
    items: [
      { label: "Messages", icon: MessageSquare, href: (eid: string) => `/events/${eid}/messages` },
      { label: "Templates", icon: FileText, href: (eid: string) => `/events/${eid}/messages/templates` },
    ],
  },
  {
    heading: "Commerce",
    items: [
      { label: "Aso Ebi Products", icon: Package, href: (eid: string) => `/events/${eid}/commerce` },
      { label: "Orders", icon: ShoppingCart, href: (eid: string) => `/events/${eid}/commerce/orders` },
      { label: "Delivery Tracking", icon: Truck, href: (eid: string) => `/events/${eid}/logistics` },
    ],
  },
  {
    heading: "Reporting",
    items: [
      { label: "Event Reports", icon: BarChart3, href: (eid: string) => `/events/${eid}/analytics` },
      { label: "Export Data", icon: Download, href: (eid: string) => `/events/${eid}/analytics?export=true` },
    ],
  },
  {
    heading: "Security",
    items: [
      { label: "Generate Security Link", icon: Shield, href: (eid: string) => `/events/${eid}/settings?tab=security` },
      { label: "Revoke Security Access", icon: Shield, href: (eid: string) => `/events/${eid}/settings?tab=security` },
    ],
  },
];

export function MoreDrawer({ open, onClose }: MoreDrawerProps) {
  const pathname = usePathname();
  const { currentEvent, events } = useEvent();

  const currentEid = currentEvent?.id || events[0]?.id;

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-[60]" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 w-[300px] max-w-[85vw] bg-white z-[70] shadow-xl flex flex-col animate-[slideIn_200ms_ease-out]">
        <div className="flex items-center justify-between px-4 py-4 border-b border-[#DEE2E6]">
          <h2 className="text-[16px] font-semibold text-[#212529] font-[family-name:var(--font-display)]">Menu</h2>
          <button onClick={onClose} className="p-1.5 rounded-[8px] hover:bg-[#F1F3F5] transition-colors">
            <X size={18} className="text-[#6C757D]" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {menuSections.map((section) => (
            <div key={section.heading} className="px-4 py-3 border-b border-[#DEE2E6] last:border-b-0">
              <h3 className="text-[11px] font-semibold uppercase tracking-[0.5px] text-[#ADB5BD] mb-2">{section.heading}</h3>
              <div className="flex flex-col gap-0.5">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const href = currentEid ? item.href(currentEid) : "#";
                  const isActive = href !== "#" && pathname.startsWith(href.split("?")[0]);
                  return (
                    <Link
                      key={item.label}
                      href={href}
                      onClick={onClose}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-[8px] text-[13px] font-medium transition-colors ${
                        isActive ? "bg-[#EEF2FF] text-[#4338CA]" : "text-[#495057] hover:bg-[#F1F3F5]"
                      } ${href === "#" ? "pointer-events-none opacity-40" : ""}`}
                    >
                      <Icon size={18} strokeWidth={2} />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        <div className="border-t border-[#DEE2E6] px-4 py-3">
          <Link
            href="/settings"
            onClick={onClose}
            className="flex items-center gap-3 px-3 py-2.5 rounded-[8px] text-[13px] font-medium text-[#495057] hover:bg-[#F1F3F5] transition-colors"
          >
            <Settings size={18} strokeWidth={2} />
            Settings
          </Link>
          <Link
            href="/login"
            onClick={onClose}
            className="flex items-center gap-3 px-3 py-2.5 rounded-[8px] text-[13px] font-medium text-[#EF4444] hover:bg-[#FEF2F2] transition-colors"
          >
            <LogOut size={18} strokeWidth={2} />
            Logout
          </Link>
        </div>
      </div>
    </>
  );
}
