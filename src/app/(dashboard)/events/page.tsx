"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Calendar, Plus, MoreHorizontal } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import type { Event } from "@/lib/types";

const statusBadgeVariant: Record<string, "published" | "draft" | "warning" | "danger" | "info" | "success"> = {
  draft: "draft",
  published: "published",
  ongoing: "warning",
  completed: "success",
  cancelled: "danger",
};

export default function EventsPage() {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("events")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (data) setEvents(data as Event[]);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-24 bg-[#F1F3F5] animate-pulse rounded-[12px]" />
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[26px] font-semibold text-[#212529] font-[family-name:var(--font-display)] tracking-[-0.8px]">Events</h1>
          <p className="text-[14px] text-[#6C757D] mt-1">{events.length} event{events.length !== 1 ? "s" : ""}</p>
        </div>
        <Link href="/events/new">
          <Button variant="primary" icon={<Plus size={16} />}>Create Event</Button>
        </Link>
      </div>

      {events.length === 0 ? (
        <EmptyState
          icon={<Calendar size={40} />}
          heading="No events yet"
          body="Create your first event to start managing guests, seating, and check-in."
          action={{ label: "Create event", onClick: () => router.push("/events/new") }}
        />
      ) : (
        <div className="flex flex-col gap-3">
          {events.map((event) => (
            <Link key={event.id} href={`/events/${event.id}`}>
              <div className="bg-white border-[0.5px] border-[#DEE2E6] rounded-[12px] p-4 hover:border-[#CED4DA] transition-colors cursor-pointer">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-[16px] font-semibold text-[#212529]">{event.name}</h3>
                      <Badge variant={statusBadgeVariant[event.status]}>{event.status}</Badge>
                    </div>
                    {event.venue_name && (
                      <p className="text-[13px] text-[#6C757D]">{event.venue_name}</p>
                    )}
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-[12px] text-[#ADB5BD]">
                        {new Date(event.event_date).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}
                      </span>
                      <span className="text-[12px] text-[#ADB5BD]">{event.capacity} guests</span>
                    </div>
                  </div>
                  <Button variant="ghost" icon={<MoreHorizontal size={16} />} className="flex-shrink-0" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
