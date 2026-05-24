"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Home,
  Users,
  ScanLine,
  LayoutGrid,
  MessageSquare,
  ShoppingCart,
  BarChart3,
  Settings,
  Shield,
} from "lucide-react";
import { useEvent } from "@/lib/event-context";

interface SidebarProps {
  eventId?: string;
}

const topItems = [
  { href: "/home", label: "Dashboard", icon: Home },
  { href: "/guests", label: "Guests", icon: Users },
];

function scannerHref(eid?: string): string {
  return eid ? `/scanner/${eid}` : "#";
}

function eventItems(eventId: string) {
  return [
    { href: `/events/${eventId}/seating`, label: "Seating", icon: LayoutGrid },
    { href: `/events/${eventId}/messages`, label: "Messages", icon: MessageSquare },
    { href: `/events/${eventId}/commerce`, label: "Aso Ebi", icon: ShoppingCart },
    { href: `/events/${eventId}/commerce/orders`, label: "Orders", icon: ShoppingCart },
    { href: `/events/${eventId}/analytics`, label: "Reports", icon: BarChart3 },
  ];
}

function Sidebar({ eventId }: SidebarProps) {
  const pathname = usePathname();
  const { currentEvent } = useEvent();
  const eid = eventId || currentEvent?.id;
  const scanHref = scannerHref(eid);

  return (
    <aside className="hidden md:flex flex-col w-[220px] h-screen fixed left-0 top-16 bg-white border-r border-[#DEE2E6] overflow-y-auto">
      <nav className="flex flex-col gap-1 p-3 flex-1">
        {topItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-[8px] text-[13px] font-medium transition-colors ${
                isActive ? "bg-[#EEF2FF] text-[#4338CA]" : "text-[#495057] hover:bg-[#F1F3F5]"
              }`}
            >
              <Icon size={18} strokeWidth={2} />
              {item.label}
            </Link>
          );
        })}

        <Link
          href={scanHref}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-[8px] text-[13px] font-medium transition-colors ${
            pathname.startsWith("/scanner") ? "bg-[#EEF2FF] text-[#4338CA]" : "text-[#495057] hover:bg-[#F1F3F5]"
          } ${scanHref === "#" ? "pointer-events-none opacity-40" : ""}`}
        >
          <ScanLine size={18} strokeWidth={2} />
          Scanner
        </Link>

        {eid && (
          <>
            <div className="border-t border-[#DEE2E6] my-2" />
            {eventItems(eid).map((item) => {
              const Icon = item.icon;
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-[8px] text-[13px] font-medium transition-colors ${
                    isActive ? "bg-[#EEF2FF] text-[#4338CA]" : "text-[#495057] hover:bg-[#F1F3F5]"
                  }`}
                >
                  <Icon size={18} strokeWidth={2} />
                  {item.label}
                </Link>
              );
            })}
          </>
        )}
      </nav>

      <div className="p-3 border-t border-[#DEE2E6]">
        <Link
          href="/settings"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-[8px] text-[13px] font-medium transition-colors ${
            pathname === "/settings" ? "bg-[#EEF2FF] text-[#4338CA]" : "text-[#495057] hover:bg-[#F1F3F5]"
          }`}
        >
          <Settings size={18} strokeWidth={2} />
          Settings
        </Link>
        <Link
          href="/admin"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-[8px] text-[13px] font-medium transition-colors ${
            pathname === "/admin" ? "bg-[#EEF2FF] text-[#4338CA]" : "text-[#495057] hover:bg-[#F1F3F5]"
          }`}
        >
          <Shield size={18} strokeWidth={2} />
          Admin
        </Link>
      </div>
    </aside>
  );
}

export { Sidebar };
export type { SidebarProps };
