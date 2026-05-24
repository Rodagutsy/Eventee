"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Calendar, Users, CheckSquare, Settings, Plus, Send, LayoutGrid, ScanLine } from "lucide-react";
import { useEvent } from "@/lib/event-context";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";

export default function HomePage() {
  const router = useRouter();
  const { currentEvent, events, loading } = useEvent();
  const [metrics, setMetrics] = useState({ invited: 0, rsvp_yes: 0, checked_in: 0 });
  const [metricsLoading, setMetricsLoading] = useState(false);

  const { setCurrentEventId } = useEvent();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const eid = params.get("eventId");
    if (eid) setCurrentEventId(eid);
  }, [setCurrentEventId]);

  useEffect(() => {
    if (!currentEvent) return;
    setMetricsLoading(true);
    const supabase = createClient();
    const eid = currentEvent.id;
    Promise.all([
      supabase.from("guests").select("id", { count: "exact", head: true }).eq("event_id", eid).then((r) => r.count || 0),
      supabase.from("guests").select("id", { count: "exact", head: true }).eq("event_id", eid).eq("rsvp_status", "yes").then((r) => r.count || 0),
      supabase.from("checkins").select("id", { count: "exact", head: true }).eq("event_id", eid).then((r) => r.count || 0),
    ]).then(([invited, rsvp_yes, checked_in]) => {
      setMetrics({ invited, rsvp_yes, checked_in });
      setMetricsLoading(false);
    });
  }, [currentEvent]);

  if (loading) {
    return (
      <div className="flex flex-col gap-4">
        {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-24 bg-[#F1F3F5] animate-pulse rounded-[12px]" />)}
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <EmptyState
        icon={<Calendar size={48} />}
        heading="Welcome to EvenTee"
        body="Create your first event to start managing guests, seating, and check-in."
        action={{ label: "Create Event", onClick: () => router.push("/events/new") }}
      />
    );
  }

  if (!currentEvent) {
    return (
      <div>
        <h1 className="text-[26px] font-semibold text-[#212529] font-[family-name:var(--font-display)] tracking-[-0.8px] mb-2">Events</h1>
        <p className="text-[14px] text-[#6C757D] mb-4">Select an event to manage.</p>
        <div className="flex flex-col gap-3">
          {events.map((ev) => (
            <Link key={ev.id} href={`/home?eventId=${ev.id}`}>
              <Card className="hover:border-[#CED4DA] transition-colors cursor-pointer">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-[16px] font-semibold text-[#212529]">{ev.name}</h3>
                    <p className="text-[13px] text-[#6C757D]">{ev.venue_name || "—"}</p>
                  </div>
                  <Badge variant={ev.status === "draft" ? "draft" : ev.status === "published" ? "published" : "info"}>{ev.status}</Badge>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    );
  }

  const quickActions = [
    { label: "Add Guests", href: `/events/${currentEvent.id}/guests`, icon: Users, color: "text-[#4338CA]" },
    { label: "Send Invites", href: `/events/${currentEvent.id}/messages/compose`, icon: Send, color: "text-[#D4AF37]" },
    { label: "Seating", href: `/events/${currentEvent.id}/seating`, icon: LayoutGrid, color: "text-[#22C55E]" },
    { label: "Scanner", href: `/scanner/${currentEvent.id}`, icon: ScanLine, color: "text-[#F59E0B]" },
  ];

  const metricCards = [
    { label: "Invited", value: metrics.invited, icon: Users, color: "text-[#4338CA]" },
    { label: "RSVP Yes", value: metrics.rsvp_yes, icon: CheckSquare, color: "text-[#22C55E]" },
    { label: "Checked In", value: metrics.checked_in, icon: Calendar, color: "text-[#D4AF37]" },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <h1 className="text-[26px] font-semibold text-[#212529] font-[family-name:var(--font-display)] tracking-[-0.8px]">{currentEvent.name}</h1>
          <Badge variant={currentEvent.status === "draft" ? "draft" : currentEvent.status === "published" ? "published" : "info"}>{currentEvent.status}</Badge>
        </div>
        <select
          className="text-[13px] border-[0.5px] border-[#DEE2E6] rounded-[8px] px-2 py-1.5 bg-white focus:outline-none focus:border-[#4338CA]"
          value={currentEvent.id}
          onChange={(e) => {
            const url = e.target.value === currentEvent.id ? "/home" : `/home?eventId=${e.target.value}`;
            router.push(url);
          }}
        >
          {events.map((ev) => (
            <option key={ev.id} value={ev.id}>{ev.name}</option>
          ))}
        </select>
      </div>
      <div className="flex items-center gap-3 text-[13px] text-[#6C757D] mb-6">
        {currentEvent.venue_name && <span>{currentEvent.venue_name}</span>}
        <span>{new Date(currentEvent.event_date).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}</span>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        {metricCards.map((m) => {
          const Icon = m.icon;
          return (
            <Card key={m.label} padding="sm">
              <div className="flex items-center gap-2">
                <Icon size={16} className={m.color} />
                <span className="text-[12px] text-[#6C757D]">{m.label}</span>
              </div>
              <p className="text-[24px] font-bold text-[#212529] mt-1">{metricsLoading ? "—" : m.value}</p>
            </Card>
          );
        })}
      </div>

      <h2 className="text-[15px] font-semibold text-[#212529] mb-3">Quick Actions</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {quickActions.map((action) => {
          const Icon = action.icon;
          return (
            <Link key={action.label} href={action.href}>
              <Card padding="md" className="hover:border-[#CED4DA] transition-colors cursor-pointer text-center">
                <Icon size={20} className={`mx-auto mb-2 ${action.color}`} />
                <span className="text-[12px] font-medium text-[#343A40]">{action.label}</span>
              </Card>
            </Link>
          );
        })}
      </div>

      <Link href={`/events/${currentEvent.id}/settings`}>
        <Button variant="secondary" size="sm" className="w-full md:w-auto"><Settings size={14} /> Event Settings</Button>
      </Link>
    </div>
  );
}
