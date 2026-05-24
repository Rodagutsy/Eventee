"use client";

import Link from "next/link";
import { User, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

interface TopbarProps {
  user?: { email?: string; full_name?: string } | null;
}

function Topbar({ user }: TopbarProps) {
  const router = useRouter();

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-[#DEE2E6] z-40">
      <div className="flex items-center justify-between h-full px-4 md:px-6">
        <Link href="/events" className="flex items-center gap-2">
          <span className="text-[20px] font-bold text-[#4338CA] font-[family-name:var(--font-display)]">EvenTee</span>
        </Link>

        {user && (
          <div className="flex items-center gap-3">
            <span className="text-[13px] text-[#6C757D] hidden sm:block">
              {user.full_name || user.email}
            </span>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-1.5 px-3 py-2 text-[13px] text-[#6C757D] hover:text-[#EF4444] transition-colors rounded-[8px] hover:bg-[#F1F3F5] cursor-pointer"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

export { Topbar };
export type { TopbarProps };
