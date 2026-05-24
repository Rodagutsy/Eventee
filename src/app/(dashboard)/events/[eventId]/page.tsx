"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Calendar, Users, CheckSquare, Settings, ArrowLeft, Plus, Send } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { Event } from "@/lib/types";

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [event, setEvent] = useState<Event | null>(null);
  const [metrics, setMetrics] = useState({ invited: 0, rsvp_yes: 0, checked_in: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    const eventId = params.eventId as string;

    supabase.from("events").select("*").eq("id", eventId).single().then(({ data }) => {
      if (data) setEvent(data as Event);
    });

    Promise.all([
      supabase.from("guests").select("id", { count: "exact", head: true }).eq("event_id", eventId).then(({ count }) => count || 0),
      supabase.from("guests").select("id", { count: "exact", head: true }).eq("event_id", eventId).eq("rsvp_status", "yes").then(({ count }) => count || 0),
      supabase.from("checkins").select("id", { count: "exact", head: true }).eq("event_id", eventId).then(({ count }) => count || 0),
    ]).then(([invited, rsvp_yes, checked_in]) => {
      setMetrics({ invited, rsvp_yes, checked_in });
      setLoading(false);
    });
  }, [params.eventId]);

  if (loading) {
    return (
      <div className="flex flex-col gap-4">
        {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-24 bg-[#F1F3F5] animate-pulse rounded-[12px]" />)}
      </div>
    );
  }

  if (!event) return <div className="text-[14px] text-[#6C757D]">Event not found.</div>;

  const quickActions = [
    { label: "Add Guests", href: `/events/${event.id}/guests`, icon: Users, color: "text-[#4338CA]" },
    { label: "Send Invites", href: `/events/${event.id}/messages/compose`, icon: Send, color: "text-[#D4AF37]" },
    { label: "Check-In", href: `/events/${event.id}/checkin`, icon: CheckSquare, color: "text-[#22C55E]" },
    { label: "Settings", href: `/events/${event.id}/settings`, icon: Settings, color: "text-[#6C757D]" },
  ];

  const metricCards = [
    { label: "Invited", value: metrics.invited, icon: Users, color: "text-[#4338CA]" },
    { label: "RSVP Yes", value: metrics.rsvp_yes, icon: CheckSquare, color: "text-[#22C55E]" },
    { label: "Checked In", value: metrics.checked_in, icon: Calendar, color: "text-[#D4AF37]" },
  ];

  return (
    <div>
      <Link href="/home" className="inline-flex items-center gap-1 text-[13px] text-[#6C757D] hover:text-[#4338CA] mb-4">
        <ArrowLeft size={14} /> Dashboard
      </Link>

      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-[26px] font-semibold text-[#212529] font-[family-name:var(--font-display)] tracking-[-0.8px]">{event.name}</h1>
            <Badge variant={event.status === "draft" ? "draft" : event.status === "published" ? "published" : "info"}>{event.status}</Badge>
          </div>
          {event.venue_name && <p className="text-[14px] text-[#6C757D] mt-1">{event.venue_name}</p>}
          <p className="text-[13px] text-[#ADB5BD] mt-1">
            {new Date(event.event_date).toLocaleDateString("en-NG", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
          </p>
        </div>
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
              <p className="text-[24px] font-bold text-[#212529] mt-1">{m.value}</p>
            </Card>
          );
        })}
      </div>

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
    </div>
  );
}
