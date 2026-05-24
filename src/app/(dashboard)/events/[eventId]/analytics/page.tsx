"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, BarChart3, Users, CheckSquare, DollarSign } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";

export default function AnalyticsPage() {
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    total: 0, rsvp_yes: 0, rsvp_no: 0, rsvp_maybe: 0, rsvp_pending: 0,
    checked_in: 0, revenue: 0, orders_count: 0,
  });

  useEffect(() => {
    const supabase = createClient();
    const eventId = params.eventId as string;
    Promise.all([
      supabase.from("guests").select("id", { count: "exact", head: true }).eq("event_id", eventId),
      supabase.from("guests").select("id", { count: "exact", head: true }).eq("event_id", eventId).eq("rsvp_status", "yes"),
      supabase.from("guests").select("id", { count: "exact", head: true }).eq("event_id", eventId).eq("rsvp_status", "no"),
      supabase.from("guests").select("id", { count: "exact", head: true }).eq("event_id", eventId).eq("rsvp_status", "maybe"),
      supabase.from("guests").select("id", { count: "exact", head: true }).eq("event_id", eventId).eq("rsvp_status", "pending"),
      supabase.from("checkins").select("id", { count: "exact", head: true }).eq("event_id", eventId),
      supabase.from("orders").select("total_amount").eq("event_id", eventId).eq("payment_status", "paid"),
      supabase.from("orders").select("id", { count: "exact", head: true }).eq("event_id", eventId),
    ]).then(([t, y, n, m, p, ci, rev, oc]) => {
      setData({
        total: t.count || 0, rsvp_yes: y.count || 0, rsvp_no: n.count || 0, rsvp_maybe: m.count || 0, rsvp_pending: p.count || 0,
        checked_in: ci.count || 0, revenue: (rev.data as { total_amount: number }[] || []).reduce((s, r) => s + r.total_amount, 0), orders_count: oc.count || 0,
      });
      setLoading(false);
    });
  }, [params.eventId]);

  if (loading) return <div className="grid grid-cols-2 gap-3">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-24 bg-[#F1F3F5] animate-pulse rounded-[12px]" />)}</div>;

  return (
    <div>
      <Link href={"/events/" + params.eventId} className="inline-flex items-center gap-1 text-[13px] text-[#6C757D] hover:text-[#4338CA] mb-4"><ArrowLeft size={14} /> Event</Link>
      <h1 className="text-[26px] font-semibold text-[#212529] font-[family-name:var(--font-display)] tracking-[-0.8px] mb-6">Analytics</h1>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <Card padding="md"><div className="flex items-center gap-2 mb-1"><Users size={16} className="text-[#4338CA]" /><span className="text-[12px] text-[#6C757D]">Total Guests</span></div><p className="text-[28px] font-bold text-[#212529]">{data.total}</p></Card>
        <Card padding="md"><div className="flex items-center gap-2 mb-1"><CheckSquare size={16} className="text-[#22C55E]" /><span className="text-[12px] text-[#6C757D]">RSVP Yes</span></div><p className="text-[28px] font-bold text-[#22C55E]">{data.rsvp_yes}</p></Card>
        <Card padding="md"><div className="flex items-center gap-2 mb-1"><BarChart3 size={16} className="text-[#D4AF37]" /><span className="text-[12px] text-[#6C757D]">Checked In</span></div><p className="text-[28px] font-bold text-[#D4AF37]">{data.checked_in}</p></Card>
        <Card padding="md"><div className="flex items-center gap-2 mb-1"><DollarSign size={16} className="text-[#22C55E]" /><span className="text-[12px] text-[#6C757D]">Revenue</span></div><p className="text-[28px] font-bold text-[#212529]">NGN {Math.round(data.revenue / 100).toLocaleString()}</p></Card>
      </div>

      <Card padding="md" className="mb-4">
        <h3 className="text-[15px] font-semibold text-[#212529] mb-3">RSVP Breakdown</h3>
        <div className="space-y-2">
          {[{ label: "Yes", value: data.rsvp_yes, color: "#22C55E" }, { label: "No", value: data.rsvp_no, color: "#EF4444" }, { label: "Maybe", value: data.rsvp_maybe, color: "#F59E0B" }, { label: "Pending", value: data.rsvp_pending, color: "#ADB5BD" }].map((item) => (
            <div key={item.label}>
              <div className="flex justify-between text-[12px] mb-1"><span className="text-[#6C757D]">{item.label}</span><span className="text-[#343A40] font-medium">{item.value}</span></div>
              <div className="w-full h-2 bg-[#E9ECEF] rounded-full"><div className="h-full rounded-full" style={{ width: data.total > 0 ? (item.value / data.total) * 100 + "%" : "0%", backgroundColor: item.color }} /></div>
            </div>
          ))}
        </div>
      </Card>

      {data.orders_count > 0 && (
        <Card padding="md">
          <h3 className="text-[15px] font-semibold text-[#212529] mb-2">Aso Ebi Sales</h3>
          <p className="text-[13px] text-[#6C757D]">{data.orders_count} orders placed</p>
        </Card>
      )}
    </div>
  );
}
