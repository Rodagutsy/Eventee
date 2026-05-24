"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { EventProvider } from "@/lib/event-context";
import { Topbar } from "@/components/layout/topbar";
import { Sidebar } from "@/components/layout/sidebar";
import { MobileNav } from "@/components/layout/mobile-nav";
import type { Profile } from "@/lib/types";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data: { user: authUser } }) => {
      if (!authUser) {
        router.push("/login");
        return;
      }
      supabase
        .from("profiles")
        .select("*")
        .eq("id", authUser.id)
        .single()
        .then(({ data }) => {
          if (data) setUser(data as Profile);
          setLoading(false);
        });
    });
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F9FA]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#EEF2FF] border-t-[#4338CA] rounded-full animate-spin" />
          <p className="text-[13px] text-[#6C757D]">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <EventProvider>
      <div className="min-h-screen bg-[#F8F9FA]">
        <Topbar user={user ? { email: user.id, full_name: user.full_name } : null} />
        <Sidebar />
        <main className="pt-16 pb-20 md:pb-6 md:pl-[220px]">
          <div className="px-4 md:px-6 py-6 max-w-6xl mx-auto">
            {children}
          </div>
        </main>
        <MobileNav />
      </div>
    </EventProvider>
  );
}
