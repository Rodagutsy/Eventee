"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Home, Users, ScanLine, Menu } from "lucide-react";
import { MoreDrawer } from "@/components/layout/more-drawer";

const navItems = [
  { href: "/home", label: "Home", icon: Home },
  { href: "/guests", label: "Guests", icon: Users },
  { label: "Scan", icon: ScanLine, action: true },
  { label: "More", icon: Menu, drawer: true },
];

function MobileNav() {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#DEE2E6] z-50 md:hidden">
        <div className="flex items-center justify-around h-16">
          {navItems.map((item) => {
            const Icon = item.icon;
            if (item.drawer) {
              return (
                <button
                  key={item.label}
                  onClick={() => setDrawerOpen(true)}
                  className="flex flex-col items-center gap-0.5 px-3 py-1 rounded-[8px] transition-colors text-[#6C757D]"
                >
                  <Icon size={20} strokeWidth={2} />
                  <span className="text-[10px] font-medium">{item.label}</span>
                </button>
              );
            }
            if (item.action) {
              return (
                <Link
                  key={item.label}
                  href="/scanner"
                  className="flex flex-col items-center gap-0.5 px-3 py-1 rounded-[8px] transition-colors text-[#6C757D]"
                >
                  <Icon size={20} strokeWidth={2} />
                  <span className="text-[10px] font-medium">{item.label}</span>
                </Link>
              );
            }
            const active = isActive(item.href!);
            return (
              <Link
                key={item.label}
                href={item.href!}
                className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-[8px] transition-colors ${
                  active ? "text-[#4338CA]" : "text-[#6C757D]"
                }`}
              >
                <Icon size={20} strokeWidth={2} />
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
      <MoreDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}

export { MobileNav };
