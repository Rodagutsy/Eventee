"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Plus, Search, Download, Mail, Users } from "lucide-react";
import { useEvent } from "@/lib/event-context";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Modal } from "@/components/ui/modal";
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import type { Guest, GuestCategory } from "@/lib/types";
import { GUEST_CATEGORIES, CATEGORY_COLORS, RSVP_STATUS_COLORS } from "@/lib/constants";

const categoryOptions = GUEST_CATEGORIES.map((c) => ({ value: c, label: c.charAt(0).toUpperCase() + c.slice(1) }));

const filterTabs = ["All", "RSVP Yes", "Pending", "Declined", "Checked-In", "VIP"] as const;
type FilterTab = (typeof filterTabs)[number];

export default function GuestsPage() {
  const router = useRouter();
  const { currentEvent, events } = useEvent();
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterTab>("All");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newGuest, setNewGuest] = useState({ full_name: "", email: "", phone: "", category: "regular" as GuestCategory });
  const [adding, setAdding] = useState(false);

  const fetchGuests = useCallback(async () => {
    if (!currentEvent) return;
    const supabase = createClient();
    const { data } = await supabase
      .from("guests")
      .select("*")
      .eq("event_id", currentEvent.id)
      .order("created_at", { ascending: false });
    if (data) setGuests(data as Guest[]);
    setLoading(false);
  }, [currentEvent]);

  useEffect(() => { fetchGuests(); }, [fetchGuests]);

  const pendingRsvp = guests.filter((g) => g.rsvp_status === "pending").length;

  const filtered = guests.filter((g) => {
    const matchesSearch =
      g.full_name.toLowerCase().includes(search.toLowerCase()) ||
      (g.email || "").toLowerCase().includes(search.toLowerCase()) ||
      (g.phone || "").includes(search);
    if (!matchesSearch) return false;
    switch (activeFilter) {
      case "RSVP Yes": return g.rsvp_status === "yes";
      case "Pending": return g.rsvp_status === "pending";
      case "Declined": return g.rsvp_status === "no";
      case "Checked-In": return false; // Would need checkins table join
      case "VIP": return g.category === "vip";
      default: return true;
    }
  });

  const handleAddGuest = async () => {
    if (!newGuest.full_name.trim()) return;
    setAdding(true);
    const supabase = createClient();
    await supabase.from("guests").insert({
      event_id: currentEvent!.id,
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

  if (!currentEvent && !loading) {
    return (
      <EmptyState
        icon={<Users size={40} />}
        heading="No event selected"
        body="Select or create an event to manage guests."
        action={{ label: "View events", onClick: () => router.push("/home") }}
      />
    );
  }

  if (loading) {
    return <div className="flex flex-col gap-3">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-16 bg-[#F1F3F5] animate-pulse rounded-[8px]" />)}</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-[26px] font-semibold text-[#212529] font-[family-name:var(--font-display)] tracking-[-0.8px]">Guests</h1>
        <div className="flex items-center gap-2">
          <Link href={`/events/${currentEvent!.id}/guests/import`}>
            <Button variant="secondary" size="sm"><Download size={14} /> Import</Button>
          </Link>
          <Button variant="primary" size="sm" onClick={() => setShowAddModal(true)}><Plus size={14} /> Add</Button>
        </div>
      </div>

      <p className="text-[13px] text-[#6C757D] mb-4">
        {currentEvent!.name} &middot; {guests.length} guest{guests.length !== 1 ? "s" : ""}
        {pendingRsvp > 0 && ` · ${pendingRsvp} pending RSVP`}
      </p>

      <div className="flex gap-2 overflow-x-auto mb-4 pb-1">
        {filterTabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveFilter(tab)}
            className={`whitespace-nowrap px-3 py-1.5 rounded-[8px] text-[12px] font-medium transition-colors ${
              activeFilter === tab ? "bg-[#4338CA] text-white" : "bg-[#F1F3F5] text-[#6C757D] hover:bg-[#E9ECEF]"
            }`}
          >
            {tab}
          </button>
        ))}
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

      <div className="flex gap-2 mb-4">
        <Button variant="secondary" size="sm" icon={<Mail size={14} />}>Send Message</Button>
        <Button variant="secondary" size="sm" icon={<Download size={14} />}>Export</Button>
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
              <Badge variant={guest.category === "vip" ? "vip" : "draft"}>{guest.category}</Badge>
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
