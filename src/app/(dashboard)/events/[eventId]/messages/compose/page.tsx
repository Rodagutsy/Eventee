"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Send } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Select } from "@/components/ui/select";

export default function ComposeMessagePage() {
  const params = useParams();
  const router = useRouter();
  const [sending, setSending] = useState(false);
  const [form, setForm] = useState({
    channel: "email",
    subject: "",
    body: "",
    segment_rsvp: "",
    segment_category: "",
  });

  const handleSend = async () => {
    setSending(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const filter: Record<string, string[]> = {};
    if (form.segment_rsvp) filter.rsvp_status = [form.segment_rsvp];
    if (form.segment_category) filter.category = [form.segment_category];

    await supabase.from("messages").insert({
      event_id: params.eventId,
      sender_id: user.id,
      subject: form.subject || null,
      body: form.body,
      channel: form.channel,
      segment_filter: Object.keys(filter).length > 0 ? filter : null,
      status: "draft",
    });

    setSending(false);
    router.push("/events/" + params.eventId + "/messages");
  };

  return (
    <div className="max-w-lg mx-auto">
      <Link href={"/events/" + params.eventId + "/messages"} className="inline-flex items-center gap-1 text-[13px] text-[#6C757D] hover:text-[#4338CA] mb-4"><ArrowLeft size={14} /> Messages</Link>
      <h1 className="text-[26px] font-semibold text-[#212529] font-[family-name:var(--font-display)] tracking-[-0.8px] mb-6">Compose Message</h1>
      <Card>
        <div className="flex flex-col gap-4">
          <Select label="Channel" options={[{ value: "email", label: "Email" }, { value: "sms", label: "SMS" }, { value: "whatsapp", label: "WhatsApp" }]} value={form.channel} onChange={(e) => setForm((p) => ({ ...p, channel: e.target.value }))} />
          <Input label="Subject" placeholder="Message subject" value={form.subject} onChange={(e) => setForm((p) => ({ ...p, subject: e.target.value }))} />
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-medium text-[#343A40] tracking-[0.2px]">Message Body</label>
            <textarea className="w-full text-[14px] px-3 py-[9px] rounded-[8px] border border-[#DEE2E6] bg-white focus:outline-none focus:border-[#4338CA] focus:bg-[#EEF2FF] min-h-[150px] resize-y" placeholder="Write your message..." value={form.body} onChange={(e) => setForm((p) => ({ ...p, body: e.target.value }))} required rows={5} />
          </div>
          <Select label="Filter by RSVP (optional)" options={[{ value: "", label: "All guests" }, { value: "pending", label: "Pending" }, { value: "yes", label: "Confirmed" }, { value: "no", label: "Declined" }, { value: "maybe", label: "Maybe" }]} value={form.segment_rsvp} onChange={(e) => setForm((p) => ({ ...p, segment_rsvp: e.target.value }))} />
          <Select label="Filter by Category (optional)" options={[{ value: "", label: "All categories" }, { value: "vip", label: "VIP" }, { value: "family", label: "Family" }, { value: "friends", label: "Friends" }, { value: "corporate", label: "Corporate" }, { value: "media", label: "Media" }, { value: "regular", label: "Regular" }]} value={form.segment_category} onChange={(e) => setForm((p) => ({ ...p, segment_category: e.target.value }))} />
          <Button variant="primary" onClick={handleSend} loading={sending} disabled={!form.body.trim()} icon={<Send size={16} />}>Save & Send</Button>
        </div>
      </Card>
    </div>
  );
}
