"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import Link from "next/link";

const eventTypes = [
  { value: "wedding", label: "Wedding" },
  { value: "birthday", label: "Birthday" },
  { value: "corporate", label: "Corporate Event" },
  { value: "concert", label: "Concert" },
  { value: "party", label: "Party" },
  { value: "other", label: "Other" },
];

export default function CreateEventPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    event_type: "",
    event_date: "",
    event_time: "",
    venue_name: "",
    capacity: "100",
    seating_enabled: false,
    commerce_enabled: false,
  });

  const update = (key: string, value: string | boolean) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleCreate = async () => {
    setLoading(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const eventDate = `${form.event_date}T${form.event_time}:00`;

    const { data, error } = await supabase
      .from("events")
      .insert({
        organizer_id: user.id,
        name: form.name,
        venue_name: form.venue_name,
        event_date: eventDate,
        capacity: parseInt(form.capacity),
        status: "draft",
        settings: {
          seating_enabled: form.seating_enabled,
          commerce_enabled: form.commerce_enabled,
          messaging_enabled: true,
        },
      })
      .select()
      .single();

    setLoading(false);
    if (!error && data) {
      router.push(`/events/${data.id}`);
    }
  };

  return (
    <div className="max-w-lg mx-auto">
      <Link href="/events" className="inline-flex items-center gap-1 text-[13px] text-[#6C757D] hover:text-[#4338CA] mb-6">
        <ArrowLeft size={14} /> Back to events
      </Link>

      <div className="flex items-center gap-2 mb-8">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-2 flex-1">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-semibold ${
              s <= step ? "bg-[#4338CA] text-white" : "bg-[#F1F3F5] text-[#ADB5BD]"
            }`}>
              {s < step ? <Check size={14} /> : s}
            </div>
            {s < 3 && <div className={`flex-1 h-[2px] ${s < step ? "bg-[#4338CA]" : "bg-[#DEE2E6]"}`} />}
          </div>
        ))}
      </div>

      {step === 1 && (
        <Card>
          <h2 className="text-[20px] font-semibold text-[#212529] font-[family-name:var(--font-display)] mb-4">Basic Details</h2>
          <div className="flex flex-col gap-4">
            <Input label="Event Name" placeholder="e.g. Bola & Tunde Wedding" value={form.name} onChange={(e) => update("name", e.target.value)} required />
            <Select label="Event Type" options={eventTypes} placeholder="Select type" value={form.event_type} onChange={(e) => update("event_type", e.target.value)} />
            <div className="grid grid-cols-2 gap-3">
              <Input label="Date" type="date" value={form.event_date} onChange={(e) => update("event_date", e.target.value)} required />
              <Input label="Time" type="time" value={form.event_time} onChange={(e) => update("event_time", e.target.value)} required />
            </div>
            <Input label="Venue" placeholder="Event venue name" value={form.venue_name} onChange={(e) => update("venue_name", e.target.value)} />
            <Button variant="primary" onClick={() => setStep(2)} disabled={!form.name || !form.event_date || !form.event_time} icon={<ArrowRight size={16} className="ml-auto" />}>
              Next
            </Button>
          </div>
        </Card>
      )}

      {step === 2 && (
        <Card>
          <h2 className="text-[20px] font-semibold text-[#212529] font-[family-name:var(--font-display)] mb-4">Capacity & Features</h2>
          <div className="flex flex-col gap-4">
            <Input label="Expected Guests" type="number" value={form.capacity} onChange={(e) => update("capacity", e.target.value)} />

            <div className="flex flex-col gap-2">
              <label className="text-[12px] font-medium text-[#343A40] tracking-[0.2px]">Features</label>
              <label className="flex items-center gap-3 p-3 border border-[#DEE2E6] rounded-[8px] cursor-pointer hover:bg-[#F8F9FA]">
                <input type="checkbox" checked={form.seating_enabled} onChange={(e) => update("seating_enabled", e.target.checked)} className="w-4 h-4 accent-[#4338CA]" />
                <span className="text-[13px] text-[#343A40]">Enable seating layout (tables & seats)</span>
              </label>
              <label className="flex items-center gap-3 p-3 border border-[#DEE2E6] rounded-[8px] cursor-pointer hover:bg-[#F8F9FA]">
                <input type="checkbox" checked={form.commerce_enabled} onChange={(e) => update("commerce_enabled", e.target.checked)} className="w-4 h-4 accent-[#4338CA]" />
                <span className="text-[13px] text-[#343A40]">Enable Aso Ebi sales</span>
              </label>
            </div>

            <div className="flex gap-3">
              <Button variant="secondary" onClick={() => setStep(1)}>Back</Button>
              <Button variant="primary" onClick={() => setStep(3)} className="flex-1" icon={<ArrowRight size={16} className="ml-auto" />}>
                Next
              </Button>
            </div>
          </div>
        </Card>
      )}

      {step === 3 && (
        <Card>
          <h2 className="text-[20px] font-semibold text-[#212529] font-[family-name:var(--font-display)] mb-2">Ready to Create</h2>
          <p className="text-[14px] text-[#6C757D] mb-6">Review and create your event.</p>
          <div className="bg-[#F8F9FA] rounded-[8px] p-4 mb-6 flex flex-col gap-2">
            <div className="flex justify-between text-[13px]"><span className="text-[#6C757D]">Name</span><span className="text-[#343A40] font-medium">{form.name}</span></div>
            <div className="flex justify-between text-[13px]"><span className="text-[#6C757D]">Date</span><span className="text-[#343A40] font-medium">{form.event_date} at {form.event_time}</span></div>
            <div className="flex justify-between text-[13px]"><span className="text-[#6C757D]">Venue</span><span className="text-[#343A40] font-medium">{form.venue_name || "—"}</span></div>
            <div className="flex justify-between text-[13px]"><span className="text-[#6C757D]">Capacity</span><span className="text-[#343A40] font-medium">{form.capacity}</span></div>
            <div className="flex justify-between text-[13px]"><span className="text-[#6C757D]">Seating</span><span className="text-[#343A40] font-medium">{form.seating_enabled ? "Enabled" : "Disabled"}</span></div>
            <div className="flex justify-between text-[13px]"><span className="text-[#6C757D]">Aso Ebi</span><span className="text-[#343A40] font-medium">{form.commerce_enabled ? "Enabled" : "Disabled"}</span></div>
          </div>
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setStep(2)}>Back</Button>
            <Button variant="primary" onClick={handleCreate} loading={loading} className="flex-1">
              Create Event
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
