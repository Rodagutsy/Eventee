"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Order, Guest, AsoEbiProduct } from "@/lib/types";
import { formatNGN, formatDateTime } from "@/lib/utils/formatting";

export default function OrderDetailPage() {
  const params = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [guest, setGuest] = useState<Guest | null>(null);
  const [product, setProduct] = useState<AsoEbiProduct | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase.from("orders").select("*").eq("id", params.orderId).single().then(async ({ data }) => {
      if (data) {
        const o = data as Order;
        setOrder(o);
        const [gr, pr] = await Promise.all([
          supabase.from("guests").select("*").eq("id", o.guest_id).single(),
          supabase.from("aso_ebi_products").select("*").eq("id", o.product_id).single(),
        ]);
        if (gr.data) setGuest(gr.data as Guest);
        if (pr.data) setProduct(pr.data as AsoEbiProduct);
      }
      setLoading(false);
    });
  }, [params.orderId]);

  if (loading) return <div className="h-32 bg-[#F1F3F5] animate-pulse rounded-[12px]" />;
  if (!order) return <div className="text-[14px] text-[#6C757D]">Order not found.</div>;

  return (
    <div className="max-w-lg mx-auto">
      <Link href={"/events/" + params.eventId + "/commerce"} className="inline-flex items-center gap-1 text-[13px] text-[#6C757D] hover:text-[#4338CA] mb-4"><ArrowLeft size={14} /> Orders</Link>
      <h1 className="text-[26px] font-semibold text-[#212529] font-[family-name:var(--font-display)] tracking-[-0.8px] mb-6">Order #{order.id.slice(0, 8)}</h1>
      <Card className="mb-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[15px] font-semibold text-[#212529]">Payment</h2>
          <Badge variant={order.payment_status === "paid" ? "success" : order.payment_status === "failed" ? "danger" : "warning"}>{order.payment_status}</Badge>
        </div>
        <div className="flex flex-col gap-2 text-[13px]">
          <div className="flex justify-between"><span className="text-[#6C757D]">Amount</span><span className="font-semibold text-[#212529]">{formatNGN(order.total_amount)}</span></div>
          {order.payment_reference && <div className="flex justify-between"><span className="text-[#6C757D]">Reference</span><span className="text-[#343A40]">{order.payment_reference}</span></div>}
          {order.paid_at && <div className="flex justify-between"><span className="text-[#6C757D]">Paid At</span><span className="text-[#343A40]">{formatDateTime(order.paid_at)}</span></div>}
        </div>
      </Card>
      {guest && (
        <Card className="mb-4">
          <h2 className="text-[15px] font-semibold text-[#212529] mb-3">Guest</h2>
          <p className="text-[13px] font-medium text-[#343A40]">{guest.full_name}</p>
          {guest.email && <p className="text-[13px] text-[#6C757D]">{guest.email}</p>}
          {guest.phone && <p className="text-[13px] text-[#6C757D]">{guest.phone}</p>}
        </Card>
      )}
      {product && (
        <Card>
          <h2 className="text-[15px] font-semibold text-[#212529] mb-3">Product</h2>
          <p className="text-[13px] font-medium text-[#343A40]">{product.name}</p>
          {product.fabric_type && <p className="text-[13px] text-[#6C757D]">{product.fabric_type}</p>}
        </Card>
      )}
    </div>
  );
}
