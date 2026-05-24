"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Plus, Package } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { Tabs } from "@/components/ui/tabs";
import type { AsoEbiProduct, Order } from "@/lib/types";
import { formatNGN, formatDate } from "@/lib/utils/formatting";

export default function CommercePage() {
  const params = useParams();
  const router = useRouter();
  const [products, setProducts] = useState<AsoEbiProduct[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    const eventId = params.eventId as string;
    Promise.all([
      supabase.from("aso_ebi_products").select("*").eq("event_id", eventId).order("created_at", { ascending: false }),
      supabase.from("orders").select("*, aso_ebi_products(name)").eq("event_id", eventId).order("created_at", { ascending: false }),
    ]).then(([pr, or]) => {
      if (pr.data) setProducts(pr.data as AsoEbiProduct[]);
      if (or.data) setOrders(or.data as unknown as Order[]);
      setLoading(false);
    });
  }, [params.eventId]);

  if (loading) return <div className="flex flex-col gap-3">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-20 bg-[#F1F3F5] animate-pulse rounded-[12px]" />)}</div>;

  return (
    <div>
      <Link href={"/events/" + params.eventId} className="inline-flex items-center gap-1 text-[13px] text-[#6C757D] hover:text-[#4338CA] mb-4"><ArrowLeft size={14} /> Event</Link>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-[26px] font-semibold text-[#212529] font-[family-name:var(--font-display)] tracking-[-0.8px]">Aso Ebi Store</h1>
        <Link href={"/events/" + params.eventId + "/commerce/products/new"}><Button variant="primary" size="sm" icon={<Plus size={14} />}>Add Product</Button></Link>
      </div>
      <Tabs tabs={[{ id: "products", label: "Products", badge: products.length }, { id: "orders", label: "Orders", badge: orders.length }]}>
        {(activeTab) => (
          <>
            {activeTab === "products" && (
              <div className="mt-4">
                {products.length === 0 ? (
                  <EmptyState icon={<Package size={40} />} heading="No products yet" body="Add Aso Ebi products for guests to purchase." action={{ label: "Add product", onClick: () => router.push("/events/" + params.eventId + "/commerce/products/new") }} />
                ) : (
                  <div className="grid sm:grid-cols-2 gap-3">
                    {products.map((p) => (
                      <Card key={p.id} padding="md">
                        <div className="flex gap-3">
                          {p.image_urls?.[0] && <img src={p.image_urls[0]} alt={p.name} className="w-16 h-16 rounded-[8px] object-cover" />}
                          <div className="flex-1">
                            <h3 className="text-[14px] font-semibold text-[#212529]">{p.name}</h3>
                            {p.fabric_type && <p className="text-[12px] text-[#6C757D]">{p.fabric_type}</p>}
                            <p className="text-[16px] font-bold text-[#4338CA] mt-1">{formatNGN(p.price)}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant={p.is_active ? "published" : "draft"}>{p.is_active ? "Active" : "Inactive"}</Badge>
                              <span className="text-[11px] text-[#ADB5BD]">{p.available_sizes?.length || 0} sizes</span>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}
            {activeTab === "orders" && (
              <div className="mt-4">
                {orders.length === 0 ? (
                  <EmptyState icon={<Package size={40} />} heading="No orders yet" body="Orders will appear here when guests make purchases." />
                ) : (
                  <div className="flex flex-col gap-2">
                    {orders.map((order) => (
                      <Link key={order.id} href={"/events/" + params.eventId + "/commerce/orders/" + order.id}>
                        <Card padding="sm" className="flex items-center justify-between hover:border-[#CED4DA] cursor-pointer">
                          <div>
                            <p className="text-[13px] font-medium text-[#343A40]">Order #{order.id.slice(0, 8)}</p>
                            <p className="text-[12px] text-[#6C757D]">{formatDate(order.created_at)}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-[13px] font-semibold text-[#212529]">{formatNGN(order.total_amount)}</p>
                            <Badge variant={order.payment_status === "paid" ? "success" : order.payment_status === "failed" ? "danger" : "warning"}>{order.payment_status}</Badge>
                          </div>
                        </Card>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </Tabs>
    </div>
  );
}
