"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Calendar, MapPin, Check, Copy, ShoppingCart, Minus, Plus } from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select } from "@/components/ui/select";
import type { Guest, Event, AsoEbiProduct } from "@/lib/types";
import { formatDate, formatNGN } from "@/lib/utils/formatting";

export default function InvitePage() {
  const params = useParams();
  const [guest, setGuest] = useState<Guest | null>(null);
  const [event, setEvent] = useState<Event | null>(null);
  const [products, setProducts] = useState<AsoEbiProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [rsvpStatus, setRsvpStatus] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [orderQty, setOrderQty] = useState<Record<string, number>>({});
  const [orderSize, setOrderSize] = useState<Record<string, string>>({});

  useEffect(() => {
    const admin = createAdminClient();
    admin.from("guests").select("*, events(*)").eq("invite_token", params.token).single().then(({ data }) => {
      if (data) {
        const g = data as Guest & { events: Event };
        setGuest(g);
        setEvent(g.events);
        setRsvpStatus(g.rsvp_status);

        if (g.events.settings?.commerce_enabled) {
          admin.from("aso_ebi_products").select("*").eq("event_id", g.events.id).eq("is_active", true).then(({ data: prods }) => {
            if (prods) setProducts(prods as AsoEbiProduct[]);
          });
        }
      }
      setLoading(false);
    });
  }, [params.token]);

  const handleRSVP = async (status: string) => {
    setSubmitting(true);
    const admin = createAdminClient();
    await admin.from("guests").update({ rsvp_status: status, rsvp_responded_at: new Date().toISOString() }).eq("invite_token", params.token);
    setRsvpStatus(status);
    setSubmitting(false);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#F8F9FA]"><div className="w-8 h-8 border-2 border-[#EEF2FF] border-t-[#4338CA] rounded-full animate-spin" /></div>;
  if (!event || !guest) return <div className="min-h-screen flex items-center justify-center text-[14px] text-[#6C757D]">Invalid invite link.</div>;

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-16">
      <div className="bg-white border-b border-[#DEE2E6] px-4 py-4">
        <span className="text-[20px] font-bold text-[#4338CA] font-[family-name:var(--font-display)]">EvenTee</span>
      </div>

      <div className="max-w-md mx-auto px-4 py-6">
        <Card padding="lg" className="mb-6 text-center">
          <h1 className="text-[24px] font-bold text-[#212529] font-[family-name:var(--font-display)] mb-2">{event.name}</h1>
          <div className="flex items-center justify-center gap-1 text-[13px] text-[#6C757D] mb-1"><Calendar size={14} /> {formatDate(event.event_date)}</div>
          {event.venue_name && <div className="flex items-center justify-center gap-1 text-[13px] text-[#6C757D]"><MapPin size={14} /> {event.venue_name}</div>}
        </Card>

        <Card padding="lg" className="mb-6">
          <h2 className="text-[18px] font-semibold text-[#212529] font-[family-name:var(--font-display)] mb-4">Your RSVP</h2>
          <div className="flex gap-2">
            {["yes", "no", "maybe"].map((s) => (
              <Button key={s} variant={rsvpStatus === s ? "primary" : "secondary"} size="md" onClick={() => handleRSVP(s)} loading={submitting} className={rsvpStatus === s ? "flex-1" : "flex-1"} disabled={rsvpStatus !== "pending" && rsvpStatus !== s}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </Button>
            ))}
          </div>
          {rsvpStatus === "yes" && (
            <div className="mt-4 p-4 bg-[#EAF7EF] border border-[#BBE8CC] rounded-[12px] text-center">
              <Check size={24} className="mx-auto mb-2 text-[#22C55E]" />
              <p className="text-[16px] font-semibold text-[#166534]">Attendance Confirmed!</p>
              <p className="text-[12px] text-[#166534] mt-1">Your QR pass is ready. Save a screenshot for event day.</p>
            </div>
          )}
        </Card>

        {rsvpStatus === "yes" && (
          <Card padding="lg" className="mb-6 text-center">
            <h2 className="text-[18px] font-semibold text-[#212529] font-[family-name:var(--font-display)] mb-4">Your QR Pass</h2>
            <div className="w-48 h-48 mx-auto mb-4 bg-white border-2 border-[#DEE2E6] rounded-[12px] flex items-center justify-center">
              <div className="text-center">
                <div className="w-32 h-32 mx-auto bg-[#F1F3F5] flex items-center justify-center">
                  <span className="text-[10px] text-[#ADB5BD]">QR Code</span>
                </div>
              </div>
            </div>
            <p className="text-[14px] font-medium text-[#343A40]">{guest.full_name}</p>
            <Button variant="secondary" size="sm" className="mt-3" icon={copied ? <Check size={14} /> : <Copy size={14} />} onClick={copyLink}>
              {copied ? "Copied!" : "Copy Invite Link"}
            </Button>
          </Card>
        )}

        {products.length > 0 && (
          <Card padding="lg">
            <h2 className="text-[18px] font-semibold text-[#212529] font-[family-name:var(--font-display)] mb-4">Aso Ebi Available</h2>
            <div className="flex flex-col gap-4">
              {products.map((p) => (
                <div key={p.id} className="p-4 border border-[#DEE2E6] rounded-[12px]">
                  <div className="flex gap-3">
                    {p.image_urls?.[0] && <img src={p.image_urls[0]} alt={p.name} className="w-20 h-20 rounded-[8px] object-cover" />}
                    <div className="flex-1">
                      <h3 className="text-[14px] font-semibold text-[#212529]">{p.name}</h3>
                      {p.fabric_type && <p className="text-[12px] text-[#6C757D]">{p.fabric_type}</p>}
                      <p className="text-[18px] font-bold text-[#4338CA] mt-1">{formatNGN(p.price)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 mt-3">
                    <Select options={(p.available_sizes || []).map((s) => ({ value: s, label: s }))} placeholder="Size" value={orderSize[p.id] || ""} onChange={(e) => setOrderSize((prev) => ({ ...prev, [p.id]: e.target.value }))} className="flex-1" />
                    <div className="flex items-center gap-2">
                      <button onClick={() => setOrderQty((prev) => ({ ...prev, [p.id]: Math.max(1, (prev[p.id] || 1) - 1) }))} className="w-8 h-8 rounded-full border border-[#DEE2E6] flex items-center justify-center hover:bg-[#F1F3F5] cursor-pointer"><Minus size={14} /></button>
                      <span className="w-6 text-center text-[14px] font-medium">{orderQty[p.id] || 1}</span>
                      <button onClick={() => setOrderQty((prev) => ({ ...prev, [p.id]: (prev[p.id] || 1) + 1 }))} className="w-8 h-8 rounded-full border border-[#DEE2E6] flex items-center justify-center hover:bg-[#F1F3F5] cursor-pointer"><Plus size={14} /></button>
                    </div>
                    <Button variant="primary" size="sm" icon={<ShoppingCart size={14} />}>Buy</Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
