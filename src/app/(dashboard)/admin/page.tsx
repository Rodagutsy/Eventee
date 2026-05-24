"use client";

import { useEffect, useState } from "react";
import { Shield, Calendar, Users, DollarSign, Activity } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Card } from "@/components/ui/card";

export default function AdminPage() {
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({ events: 0, users: 0, orders: 0, checkins: 0 });

  useEffect(() => {
    const supabase = createClient();
    Promise.all([
      supabase.from("events").select("id", { count: "exact", head: true }),
      supabase.from("profiles").select("id", { count: "exact", head: true }),
      supabase.from("orders").select("id", { count: "exact", head: true }),
      supabase.from("checkins").select("id", { count: "exact", head: true }),
    ]).then(([e, u, o, c]) => {
      setMetrics({ events: e.count || 0, users: u.count || 0, orders: o.count || 0, checkins: c.count || 0 });
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="grid grid-cols-2 gap-3">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-24 bg-[#F1F3F5] animate-pulse rounded-[12px]" />)}</div>;

  return (
    <div>
      <h1 className="text-[26px] font-semibold text-[#212529] font-[family-name:var(--font-display)] tracking-[-0.8px] mb-2">Admin</h1>
      <p className="text-[14px] text-[#6C757D] mb-6">Platform overview and monitoring.</p>
      <div className="grid grid-cols-2 gap-3">
        <Card padding="md"><div className="flex items-center gap-2 mb-1"><Calendar size={16} className="text-[#4338CA]" /><span className="text-[12px] text-[#6C757D]">Events</span></div><p className="text-[28px] font-bold text-[#212529]">{metrics.events}</p></Card>
        <Card padding="md"><div className="flex items-center gap-2 mb-1"><Users size={16} className="text-[#D4AF37]" /><span className="text-[12px] text-[#6C757D]">Users</span></div><p className="text-[28px] font-bold text-[#D4AF37]">{metrics.users}</p></Card>
        <Card padding="md"><div className="flex items-center gap-2 mb-1"><DollarSign size={16} className="text-[#22C55E]" /><span className="text-[12px] text-[#6C757D]">Orders</span></div><p className="text-[28px] font-bold text-[#22C55E]">{metrics.orders}</p></Card>
        <Card padding="md"><div className="flex items-center gap-2 mb-1"><Activity size={16} className="text-[#4338CA]" /><span className="text-[12px] text-[#6C757D]">Check-Ins</span></div><p className="text-[28px] font-bold text-[#4338CA]">{metrics.checkins}</p></Card>
      </div>
    </div>
  );
}
