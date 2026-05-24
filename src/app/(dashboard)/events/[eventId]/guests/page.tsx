"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Plus, Search, Download, Filter } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Modal } from "@/components/ui/modal";
import { Select } from "@/components/ui/select";
import type { Guest, GuestCategory } from "@/lib/types";
import { GUEST_CATEGORIES, RSVP_STATUSES, CATEGORY_COLORS, RSVP_STATUS_COLORS } from "@/lib/constants";

const categoryOptions = GUEST_CATEGORIES.map((c) => ({ value: c, label: c.charAt(0).toUpperCase() + c.slice(1) }));
const rsvpOptions = RSVP_STATUSES.map((c) => ({ value: c, label: c.charAt(0).toUpperCase() + c.slice(1) }));

export default function GuestListPage() {
  const params = useParams();
  const router = useRouter();
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newGuest, setNewGuest] = useState({ full_name: "", email: "", phone: "", category: "regular" as GuestCategory });
  const [adding, setAdding] = useState(false);

  const fetchGuests = () => {
    const supabase = createClient();
    supabase
      .from("guests")
      .select("*")
      .eq("event_id", params.eventId)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (data) setGuests(data as Guest[]);
        setLoading(false);
      });
  };

  useEffect(() => { fetchGuests(); }, [params.eventId]);

  const filtered = guests.filter(
    (g) =>
      g.full_name.toLowerCase().includes(search.toLowerCase()) ||
      g.email?.toLowerCase().includes(search.toLowerCase()) ||
      g.phone?.includes(search),
  );

  const handleAddGuest = async () => {
    if (!newGuest.full_name.trim()) return;
    setAdding(true);
    const supabase = createClient();
    await supabase.from("guests").insert({
      event_id: params.eventId,
      full_name: newGuest.full_name,
      email: newGuest.email || null,
      phone: newGuest.phone || null,
      category: newGuest.category,
    });
    setAdding(false);
    setShowAddModal(false);
    setNewGuest({ full_name: "", email: "", phone: "", category: "regular" });
    fetchGuests();
  };

  if (loading) {
    return <div className="flex flex-col gap-3">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-16 bg-[#F1F3F5] animate-pulse rounded-[8px]" />)}</div>;
  }

  return (
    <div>
      <Link href={`/events/${params.eventId}`} className="inline-flex items-center gap-1 text-[13px] text-[#6C757D] hover:text-[#4338CA] mb-4">
        <ArrowLeft size={14} /> Event
      </Link>

      <div className="flex items-center justify-between mb-4">
        <h1 className="text-[26px] font-semibold text-[#212529] font-[family-name:var(--font-display)] tracking-[-0.8px]">Guests</h1>
        <div className="flex items-center gap-2">
          <Link href={`/events/${params.eventId}/guests/import`}>
            <Button variant="secondary" size="sm"><Download size={14} /> Import</Button>
          </Link>
          <Button variant="primary" size="sm" onClick={() => setShowAddModal(true)}><Plus size={14} /> Add</Button>
        </div>
      </div>

      <div className="relative mb-4">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#ADB5BD]" />
        <input
          className="w-full pl-9 pr-3 py-2 text-[14px] rounded-[8px] border-[0.5px] border-[#DEE2E6] bg-white focus:outline-none focus:border-[#4338CA] focus:bg-[#EEF2FF] focus:shadow-[0_0_0_3px_rgba(67,56,202,0.12)] transition-all"
          placeholder="Search guests..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<Search size={40} />}
          heading={search ? "No matches" : "No guests yet"}
          body={search ? "Try a different search term." : "Add guests via CSV upload, manual entry, or share the registration link."}
          action={search ? undefined : { label: "Add guests", onClick: () => setShowAddModal(true) }}
        />
      ) : (
        <div className="flex flex-col gap-2">
          {filtered.map((guest) => (
            <Card key={guest.id} padding="sm" className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-semibold text-white"
                  style={{ backgroundColor: CATEGORY_COLORS[guest.category] || "#94A3B8" }}
                >
                  {guest.full_name.charAt(0)}
                </div>
                <div>
                  <p className="text-[13px] font-medium text-[#343A40]">{guest.full_name}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-[#ADB5BD]">{guest.email || guest.phone || "—"}</span>
                    <span className="inline-block w-1.5 h-1.5 rounded-full" style={{ backgroundColor: RSVP_STATUS_COLORS[guest.rsvp_status] }} />
                    <span className="text-[11px] capitalize" style={{ color: RSVP_STATUS_COLORS[guest.rsvp_status] }}>{guest.rsvp_status}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Badge variant={guest.category === "vip" ? "vip" : "draft"}>{guest.category}</Badge>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal open={showAddModal} onClose={() => setShowAddModal(false)} title="Add Guest">
        <div className="flex flex-col gap-4">
          <Input label="Full Name" value={newGuest.full_name} onChange={(e) => setNewGuest((p) => ({ ...p, full_name: e.target.value }))} required />
          <Input label="Email" type="email" value={newGuest.email} onChange={(e) => setNewGuest((p) => ({ ...p, email: e.target.value }))} />
          <Input label="Phone" value={newGuest.phone} onChange={(e) => setNewGuest((p) => ({ ...p, phone: e.target.value }))} />
          <Select label="Category" options={categoryOptions} value={newGuest.category} onChange={(e) => setNewGuest((p) => ({ ...p, category: e.target.value as GuestCategory }))} />
          <Button variant="primary" onClick={handleAddGuest} loading={adding}>Add Guest</Button>
        </div>
      </Modal>
    </div>
  );
}
