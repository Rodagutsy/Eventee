"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Search, Check, X, AlertTriangle, Wifi, WifiOff } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs } from "@/components/ui/tabs";
import type { Guest, GuestCategory } from "@/lib/types";
import { CATEGORY_COLORS } from "@/lib/constants";

export default function ScannerPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const eventId = params.eventId as string;
  const [guests, setGuests] = useState<Guest[]>([]);
  const [checkedInIds, setCheckedInIds] = useState<Set<string>>(new Set());
  const [stats, setStats] = useState({ total: 0, checked: 0 });
  const [searchQuery, setSearchQuery] = useState("");
  const [scanResult, setScanResult] = useState<{ type: "success" | "duplicate" | "invalid"; guest?: Guest } | null>(null);
  const [online, setOnline] = useState(true);
  const [walkInName, setWalkInName] = useState("");
  const [walkInCategory, setWalkInCategory] = useState<GuestCategory>("regular");

  const fetchData = useCallback(async () => {
    const supabase = createClient();
    const [guestsRes, checkinsRes] = await Promise.all([
      supabase.from("guests").select("*").eq("event_id", eventId).order("full_name"),
      supabase.from("checkins").select("guest_id").eq("event_id", eventId),
    ]);
    if (guestsRes.data) setGuests(guestsRes.data as Guest[]);
    if (checkinsRes.data) {
      const ids = new Set(checkinsRes.data.map((c) => c.guest_id));
      setCheckedInIds(ids);
      setStats({ total: guestsRes.data?.length || 0, checked: ids.size });
    }
  }, [eventId]);

  useEffect(() => {
    fetchData();
    setOnline(navigator.onLine);
    const h = () => setOnline(navigator.onLine);
    window.addEventListener("online", h);
    window.addEventListener("offline", h);
    return () => { window.removeEventListener("online", h); window.removeEventListener("offline", h); };
  }, [fetchData]);

  const handleCheckIn = async (guestId: string) => {
    const supabase = createClient();
    const { error } = await supabase.from("checkins").insert({ event_id: eventId, guest_id: guestId, method: "scan", synced: navigator.onLine });
    if (error && error.message && error.message.includes("duplicate")) {
      setScanResult({ type: "duplicate", guest: guests.find((g) => g.id === guestId) });
    } else {
      setScanResult({ type: "success", guest: guests.find((g) => g.id === guestId) });
      setCheckedInIds((prev) => new Set(prev).add(guestId));
      setStats((prev) => ({ ...prev, checked: prev.checked + 1 }));
    }
    setTimeout(() => setScanResult(null), 3000);
  };

  const handleWalkIn = async () => {
    if (!walkInName.trim()) return;
    const supabase = createClient();
    const { data } = await supabase.from("guests").insert({ event_id: eventId, full_name: walkInName.trim(), category: walkInCategory }).select().single();
    if (data) {
      setGuests((prev) => [...prev, data as Guest]);
      await handleCheckIn((data as Guest).id);
      setWalkInName("");
      setWalkInCategory("regular");
    }
  };

  const handleQR = () => {
    const guest = guests.find((g) => g.rsvp_status === "yes");
    if (guest) {
      handleCheckIn(guest.id);
    } else {
      setScanResult({ type: "invalid" });
      setTimeout(() => setScanResult(null), 3000);
    }
  };

  const filtered = guests.filter((g) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return g.full_name.toLowerCase().includes(q) || (g.email || "").toLowerCase().includes(q) || (g.phone || "").includes(q);
  });

  return (
    <div>
      <Link href="/home" className="inline-flex items-center gap-1 text-[13px] text-[#6C757D] hover:text-[#4338CA] mb-4"><ArrowLeft size={14} /> Home</Link>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-[26px] font-semibold text-[#212529] font-[family-name:var(--font-display)] tracking-[-0.8px]">Scanner</h1>
          <p className="text-[13px] text-[#6C757D]">Event check-in &amp; validation</p>
        </div>
        <span className={"inline-flex items-center gap-1 text-[12px] " + (online ? "text-[#22C55E]" : "text-[#F59E0B]")}>
          {online ? <Wifi size={14} /> : <WifiOff size={14} />}{online ? "Online" : "Offline"}
        </span>
      </div>
      <div className="grid grid-cols-3 gap-3 mb-6">
        <Card padding="sm"><p className="text-[12px] text-[#6C757D]">Total</p><p className="text-[24px] font-bold text-[#212529]">{stats.total}</p></Card>
        <Card padding="sm" variant="elevated"><p className="text-[12px] text-[#6C757D]">Checked</p><p className="text-[24px] font-bold text-[#22C55E]">{stats.checked}</p></Card>
        <Card padding="sm"><p className="text-[12px] text-[#6C757D]">Remaining</p><p className="text-[24px] font-bold text-[#4338CA]">{stats.total - stats.checked}</p></Card>
      </div>
      <Tabs tabs={[{ id: "scanner", label: "Scanner" }, { id: "search", label: "Search" }, { id: "walkin", label: "Walk-In" }]}>
        {(activeTab) => (
          <div className="mt-4">
            {activeTab === "scanner" && (
              <Card className="text-center py-12 px-6">
                <div className="w-32 h-32 mx-auto mb-4 rounded-[12px] bg-[#F1F3F5] border-2 border-dashed border-[#DEE2E6] flex items-center justify-center"><Search size={40} className="text-[#ADB5BD]" /></div>
                <p className="text-[14px] text-[#6C757D] mb-2">Camera QR Scanner</p>
                <p className="text-[12px] text-[#ADB5BD] mb-4">Requires camera permission</p>
                <Button variant="primary" onClick={handleQR}>Simulate Scan</Button>
              </Card>
            )}
            {activeTab === "search" && (
              <div>
                <div className="relative mb-4">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#ADB5BD]" />
                  <input className="w-full pl-9 pr-3 py-2 text-[14px] rounded-[8px] border border-[#DEE2E6] focus:outline-none focus:border-[#4338CA] focus:bg-[#EEF2FF]" placeholder="Search by name..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                </div>
                <div className="flex flex-col gap-2 max-h-[400px] overflow-y-auto">
                  {filtered.map((guest) => {
                    const checked = checkedInIds.has(guest.id);
                    return (
                      <div key={guest.id} className={"flex items-center justify-between p-3 rounded-[8px] border-[0.5px] " + (checked ? "bg-[#EAF7EF] border-[#BBE8CC]" : "bg-white border-[#DEE2E6]")}>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-semibold text-white" style={{ backgroundColor: CATEGORY_COLORS[guest.category] }}>{guest.full_name.charAt(0)}</div>
                          <div><p className="text-[13px] font-medium text-[#343A40]">{guest.full_name}</p><p className="text-[11px] text-[#ADB5BD]">{guest.email || guest.phone || "-"}</p></div>
                        </div>
                        {checked ? <Badge variant="checkedIn">Checked</Badge> : <Button variant="primary" size="sm" onClick={() => handleCheckIn(guest.id)}>Check In</Button>}
                      </div>
                    );
                  })}
                  {filtered.length === 0 && <p className="text-[13px] text-[#ADB5BD] text-center py-8">No guests found.</p>}
                </div>
              </div>
            )}
            {activeTab === "walkin" && (
              <Card>
                <h3 className="text-[15px] font-semibold text-[#212529] mb-4">Walk-In Guest</h3>
                <div className="flex flex-col gap-4">
                  <Input label="Full Name" placeholder="Guest name" value={walkInName} onChange={(e) => setWalkInName(e.target.value)} />
                  <select
                    className="w-full px-3 py-2 text-[14px] rounded-[8px] border-[0.5px] border-[#DEE2E6] bg-white focus:outline-none focus:border-[#4338CA]"
                    value={walkInCategory}
                    onChange={(e) => setWalkInCategory(e.target.value as GuestCategory)}
                  >
                    {["vip","regular","family","friends","corporate","media","other"].map((c) => (
                      <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                    ))}
                  </select>
                  <Button variant="primary" onClick={handleWalkIn} disabled={!walkInName.trim()}>Check In Walk-In</Button>
                </div>
              </Card>
            )}
          </div>
        )}
      </Tabs>
      {scanResult && (
        <div className={"fixed top-20 left-4 right-4 z-50 p-4 rounded-[12px] border-[0.5px] animate-[slideIn_300ms_ease-out] " + (scanResult.type === "success" ? "bg-[#EAF7EF] border-[#BBE8CC]" : scanResult.type === "duplicate" ? "bg-[#FEF3C7] border-[#FDE68A]" : "bg-[#FEE2E2] border-[#FECACA]")}>
          <div className="flex items-center gap-3">
            <div className={"w-8 h-8 rounded-full flex items-center justify-center " + (scanResult.type === "success" ? "bg-[#22C55E]" : scanResult.type === "duplicate" ? "bg-[#F59E0B]" : "bg-[#EF4444]")}>
              {scanResult.type === "success" ? <Check size={16} className="text-white" /> : scanResult.type === "duplicate" ? <AlertTriangle size={16} className="text-white" /> : <X size={16} className="text-white" />}
            </div>
            <div>
              <p className="text-[14px] font-semibold text-[#212529]">{scanResult.type === "success" ? "Check-In Confirmed" : scanResult.type === "duplicate" ? "Already Checked In" : "QR Not Recognized"}</p>
              {scanResult.guest && <p className="text-[13px] text-[#6C757D]">{scanResult.guest.full_name}</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
