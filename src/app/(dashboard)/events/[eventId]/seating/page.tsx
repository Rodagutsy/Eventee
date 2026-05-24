"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Plus, Wand2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Modal } from "@/components/ui/modal";
import { EmptyState } from "@/components/ui/empty-state";
import type { Table, Guest, SeatAssignment } from "@/lib/types";
import { CATEGORY_COLORS } from "@/lib/constants";

export default function SeatingPage() {
  const params = useParams();
  const [tables, setTables] = useState<Table[]>([]);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [assignments, setAssignments] = useState<SeatAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddTable, setShowAddTable] = useState(false);
  const [newTable, setNewTable] = useState<{ label: string; capacity: string; shape: "round" | "rectangle" | "long" }>({ label: "", capacity: "10", shape: "round" });

  const fetchData = async () => {
    const supabase = createClient();
    const eventId = params.eventId as string;
    const [tablesRes, guestsRes, assignmentsRes] = await Promise.all([
      supabase.from("tables").select("*").eq("event_id", eventId).order("table_number"),
      supabase.from("guests").select("*").eq("event_id", eventId).eq("rsvp_status", "yes"),
      supabase.from("seat_assignments").select("*, tables!inner(event_id)").eq("tables.event_id", eventId),
    ]);
    if (tablesRes.data) setTables(tablesRes.data as Table[]);
    if (guestsRes.data) setGuests(guestsRes.data as Guest[]);
    if (assignmentsRes.data) setAssignments(assignmentsRes.data as SeatAssignment[]);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, [params.eventId]);

  const assignedGuestIds = new Set(assignments.map((a) => a.guest_id));
  const unassignedGuests = guests.filter((g) => !assignedGuestIds.has(g.id));

  const getGuestForTable = (tableId: string) => {
    return assignments.filter((a) => a.table_id === tableId).map((a) => guests.find((g) => g.id === a.guest_id)).filter(Boolean) as Guest[];
  };

  const handleAddTable = async () => {
    const supabase = createClient();
    const maxNum = tables.length > 0 ? Math.max(...tables.map((t) => t.table_number)) : 0;
    await supabase.from("tables").insert({ event_id: params.eventId, table_number: maxNum + 1, label: newTable.label || "Table " + (maxNum + 1), capacity: parseInt(newTable.capacity), shape: newTable.shape });
    setShowAddTable(false);
    setNewTable({ label: "", capacity: "10", shape: "round" });
    fetchData();
  };

  const handleAutoAssign = async () => {
    const supabase = createClient();
    const sorted = [...unassignedGuests].sort((a, b) => {
      const priority = { vip: 0, family: 1, corporate: 2, friends: 3, regular: 4, media: 5, other: 6 };
      return (priority[a.category] || 99) - (priority[b.category] || 99);
    });
    const toCreate: { table_id: string; guest_id: string; assigned_by: "auto" }[] = [];
    const availableTables = [...tables].sort((a, b) => a.capacity - b.capacity);
    for (const guest of sorted) {
      const table = availableTables.find((t) => toCreate.filter((a) => a.table_id === t.id).length < t.capacity);
      if (table) toCreate.push({ table_id: table.id, guest_id: guest.id, assigned_by: "auto" });
    }
    if (toCreate.length > 0) { await supabase.from("seat_assignments").insert(toCreate); fetchData(); }
  };

  if (loading) return <div className="flex flex-col gap-3">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-20 bg-[#F1F3F5] animate-pulse rounded-[12px]" />)}</div>;

  return (
    <div>
      <Link href={"/events/" + params.eventId} className="inline-flex items-center gap-1 text-[13px] text-[#6C757D] hover:text-[#4338CA] mb-4"><ArrowLeft size={14} /> Event</Link>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-[26px] font-semibold text-[#212529] font-[family-name:var(--font-display)] tracking-[-0.8px]">Seating</h1>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" icon={<Wand2 size={14} />} onClick={handleAutoAssign} disabled={unassignedGuests.length === 0 || tables.length === 0}>Auto Arrange</Button>
          <Button variant="primary" size="sm" onClick={() => setShowAddTable(true)} icon={<Plus size={14} />}>Add Table</Button>
        </div>
      </div>
      {tables.length === 0 ? (
        <EmptyState icon={<Plus size={40} />} heading="No tables yet" body="Add tables to create your event seating layout." action={{ label: "Add table", onClick: () => setShowAddTable(true) }} />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {tables.map((table) => {
            const seated = getGuestForTable(table.id);
            return (
              <Card key={table.id} variant={seated.length >= table.capacity ? "elevated" : "default"} padding="md">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-[15px] font-semibold text-[#212529]">{table.label || "Table " + table.table_number}</h3>
                  <span className="text-[11px] text-[#6C757D]">{seated.length}/{table.capacity}</span>
                </div>
                <div className="w-full h-1.5 bg-[#E9ECEF] rounded-full mb-3">
                  <div className="h-full rounded-full" style={{ width: (seated.length / table.capacity) * 100 + "%", backgroundColor: seated.length >= table.capacity ? "#22C55E" : "#4338CA" }} />
                </div>
                {seated.length > 0 ? seated.map((g) => {
                  const a = assignments.find((as) => as.guest_id === g.id);
                  return (
                    <div key={g.id} className="flex items-center justify-between py-1.5 px-2 rounded-[6px] bg-[#F8F9FA] mb-1">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: CATEGORY_COLORS[g.category] }} />
                        <span className="text-[12px] text-[#343A40]">{g.full_name}</span>
                      </div>
                      <button onClick={async () => { if (a) { await createClient().from("seat_assignments").delete().eq("id", a.id); fetchData(); } }} className="text-[10px] text-[#EF4444] hover:underline cursor-pointer">Remove</button>
                    </div>
                  );
                }) : <p className="text-[12px] text-[#ADB5BD]">Empty</p>}
              </Card>
            );
          })}
        </div>
      )}
      <Modal open={showAddTable} onClose={() => setShowAddTable(false)} title="Add Table">
        <div className="flex flex-col gap-4">
          <Input label="Table Label" placeholder="e.g. Head Table" value={newTable.label} onChange={(e) => setNewTable((p) => ({ ...p, label: e.target.value }))} />
          <Input label="Capacity" type="number" value={newTable.capacity} onChange={(e) => setNewTable((p) => ({ ...p, capacity: e.target.value }))} />
          <Select label="Shape" options={[{ value: "round", label: "Round" }, { value: "rectangle", label: "Rectangle" }, { value: "long", label: "Long" }]} value={newTable.shape} onChange={(e) => setNewTable((p) => ({ ...p, shape: e.target.value as "round" | "rectangle" | "long" }))} />
          <Button variant="primary" onClick={handleAddTable}>Add Table</Button>
        </div>
      </Modal>
    </div>
  );
}
