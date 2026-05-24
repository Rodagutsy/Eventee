"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Save, Trash2 } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Event, EventSettings } from "@/lib/types";

export default function EventSettingsPage() {
  const params = useParams();
  const router = useRouter();
  const [event, setEvent] = useState<Event | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    name: "",
    venue_name: "",
    capacity: "",
    status: "",
    seating_enabled: false,
    commerce_enabled: false,
  });

  useEffect(() => {
    const supabase = createClient();
    supabase.from("events").select("*").eq("id", params.eventId).single().then(({ data }) => {
      if (data) {
        const ev = data as Event;
        setEvent(ev);
        setForm({
          name: ev.name,
          venue_name: ev.venue_name || "",
          capacity: String(ev.capacity),
          status: ev.status,
          seating_enabled: ev.settings.seating_enabled,
          commerce_enabled: ev.settings.commerce_enabled,
        });
      }
    });
  }, [params.eventId]);

  const handleSave = async () => {
    setSaving(true);
    const supabase = createClient();
    await supabase.from("events").update({
      name: form.name,
      venue_name: form.venue_name || null,
      capacity: parseInt(form.capacity),
      settings: {
        seating_enabled: form.seating_enabled,
        commerce_enabled: form.commerce_enabled,
        messaging_enabled: true,
      } as EventSettings,
    }).eq("id", params.eventId);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleStatusChange = async (status: string) => {
    const supabase = createClient();
    await supabase.from("events").update({ status }).eq("id", params.eventId);
    setForm((prev) => ({ ...prev, status }));
  };

  if (!event) return null;

  return (
    <div className="max-w-lg mx-auto">
      <Link href={`/events/${params.eventId}`} className="inline-flex items-center gap-1 text-[13px] text-[#6C757D] hover:text-[#4338CA] mb-4">
        <ArrowLeft size={14} /> Event
      </Link>

      <h1 className="text-[26px] font-semibold text-[#212529] font-[family-name:var(--font-display)] tracking-[-0.8px] mb-6">Settings</h1>

      <Card className="mb-6">
        <h2 className="text-[16px] font-semibold text-[#212529] mb-4">Event Details</h2>
        <div className="flex flex-col gap-4">
          <Input label="Event Name" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} />
          <Input label="Venue" value={form.venue_name} onChange={(e) => setForm((p) => ({ ...p, venue_name: e.target.value }))} />
          <Input label="Capacity" type="number" value={form.capacity} onChange={(e) => setForm((p) => ({ ...p, capacity: e.target.value }))} />
        </div>
      </Card>

      <Card className="mb-6">
        <h2 className="text-[16px] font-semibold text-[#212529] mb-4">Features</h2>
        <div className="flex flex-col gap-3">
          <label className="flex items-center gap-3 p-3 border border-[#DEE2E6] rounded-[8px] cursor-pointer">
            <input type="checkbox" checked={form.seating_enabled} onChange={(e) => setForm((p) => ({ ...p, seating_enabled: e.target.checked }))} className="w-4 h-4 accent-[#4338CA]" />
            <span className="text-[13px] text-[#343A40]">Seating layout</span>
          </label>
          <label className="flex items-center gap-3 p-3 border border-[#DEE2E6] rounded-[8px] cursor-pointer">
            <input type="checkbox" checked={form.commerce_enabled} onChange={(e) => setForm((p) => ({ ...p, commerce_enabled: e.target.checked }))} className="w-4 h-4 accent-[#4338CA]" />
            <span className="text-[13px] text-[#343A40]">Aso Ebi sales</span>
          </label>
        </div>
      </Card>

      <Card className="mb-6">
        <h2 className="text-[16px] font-semibold text-[#212529] mb-4">Event Status</h2>
        <div className="flex flex-wrap gap-2">
          {["draft", "published", "ongoing", "completed", "cancelled"].map((s) => (
            <button
              key={s}
              onClick={() => handleStatusChange(s)}
              className={`px-4 py-2 rounded-[8px] text-[13px] font-medium transition-colors cursor-pointer ${
                form.status === s ? "bg-[#4338CA] text-white" : "bg-[#F1F3F5] text-[#495057] hover:bg-[#E9ECEF]"
              }`}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </Card>

      <Button variant="primary" onClick={handleSave} loading={saving} icon={saved ? undefined : <Save size={16} />}>
        {saved ? "Saved!" : "Save Changes"}
      </Button>
    </div>
  );
}
