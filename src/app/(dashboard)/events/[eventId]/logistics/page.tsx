"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Truck } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { Select } from "@/components/ui/select";
import type { DeliveryOrder } from "@/lib/types";
import { formatDate } from "@/lib/utils/formatting";

const statusColors: Record<string, "warning" | "info" | "success" | "danger"> = {
  pending_pickup: "warning",
  in_transit: "info",
  delivered: "success",
  failed_delivery: "danger",
};

export default function LogisticsPage() {
  const params = useParams();
  const [deliveries, setDeliveries] = useState<DeliveryOrder[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = () => {
    const supabase = createClient();
    supabase.from("delivery_orders").select("*").eq("event_id", params.eventId).order("created_at", { ascending: false }).then(({ data }) => {
      if (data) setDeliveries(data as DeliveryOrder[]);
      setLoading(false);
    });
  };

  useEffect(() => { fetchData(); }, [params.eventId]);

  const updateStatus = async (id: string, status: string) => {
    const supabase = createClient();
    await supabase.from("delivery_orders").update({ status, status_updated_at: new Date().toISOString(), delivered_at: status === "delivered" ? new Date().toISOString() : null }).eq("id", id);
    fetchData();
  };

  if (loading) return <div className="flex flex-col gap-3">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-16 bg-[#F1F3F5] animate-pulse rounded-[8px]" />)}</div>;

  return (
    <div>
      <Link href={"/events/" + params.eventId} className="inline-flex items-center gap-1 text-[13px] text-[#6C757D] hover:text-[#4338CA] mb-4"><ArrowLeft size={14} /> Event</Link>
      <h1 className="text-[26px] font-semibold text-[#212529] font-[family-name:var(--font-display)] tracking-[-0.8px] mb-6">Logistics</h1>
      {deliveries.length === 0 ? (
        <EmptyState icon={<Truck size={40} />} heading="No deliveries yet" body="Delivery records will appear here when guests place Aso Ebi orders." />
      ) : (
        <div className="flex flex-col gap-2">
          {deliveries.map((d) => (
            <Card key={d.id} padding="sm">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[13px] font-medium text-[#343A40]">Delivery #{d.id.slice(0, 8)}</span>
                    <Badge variant={statusColors[d.status]}>{d.status.replace("_", " ")}</Badge>
                  </div>
                  <p className="text-[11px] text-[#6C757D] mt-1">{d.delivery_address}</p>
                  <p className="text-[11px] text-[#ADB5BD]">{d.delivery_phone} - {formatDate(d.created_at)}</p>
                </div>
                <Select
                  options={[{ value: "pending_pickup", label: "Pending Pickup" }, { value: "in_transit", label: "In Transit" }, { value: "delivered", label: "Delivered" }, { value: "failed_delivery", label: "Failed" }]}
                  value={d.status}
                  onChange={(e) => updateStatus(d.id, e.target.value)}
                  className="w-36"
                />
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
