"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

export default function NewProductPage() {
  const params = useParams();
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: "", fabric_type: "", price: "", available_sizes: "", order_deadline: "", stock_quantity: "" });

  const handleSave = async () => {
    setSaving(true);
    const supabase = createClient();
    await supabase.from("aso_ebi_products").insert({
      event_id: params.eventId, name: form.name, fabric_type: form.fabric_type || null,
      price: parseInt(form.price) * 100,
      available_sizes: form.available_sizes.split(",").map((s) => s.trim()).filter(Boolean),
      order_deadline: form.order_deadline ? form.order_deadline + "T23:59:59" : null,
      stock_quantity: form.stock_quantity ? parseInt(form.stock_quantity) : null,
    });
    setSaving(false);
    router.push("/events/" + params.eventId + "/commerce");
  };

  return (
    <div className="max-w-lg mx-auto">
      <Link href={"/events/" + params.eventId + "/commerce"} className="inline-flex items-center gap-1 text-[13px] text-[#6C757D] hover:text-[#4338CA] mb-4"><ArrowLeft size={14} /> Store</Link>
      <h1 className="text-[26px] font-semibold text-[#212529] font-[family-name:var(--font-display)] tracking-[-0.8px] mb-6">Add Product</h1>
      <Card>
        <div className="flex flex-col gap-4">
          <Input label="Product Name" placeholder="e.g. Ankara George" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} required />
          <Input label="Fabric Type" placeholder="e.g. Lace, Ankara" value={form.fabric_type} onChange={(e) => setForm((p) => ({ ...p, fabric_type: e.target.value }))} />
          <Input label="Price (NGN)" type="number" placeholder="e.g. 15000" value={form.price} onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))} required />
          <Input label="Sizes (comma-separated)" placeholder="e.g. S, M, L, XL" value={form.available_sizes} onChange={(e) => setForm((p) => ({ ...p, available_sizes: e.target.value }))} />
          <Input label="Order Deadline" type="date" value={form.order_deadline} onChange={(e) => setForm((p) => ({ ...p, order_deadline: e.target.value }))} />
          <Input label="Stock Quantity (optional)" type="number" value={form.stock_quantity} onChange={(e) => setForm((p) => ({ ...p, stock_quantity: e.target.value }))} />
          <Button variant="primary" onClick={handleSave} loading={saving} disabled={!form.name || !form.price} icon={<Save size={16} />}>Save Product</Button>
        </div>
      </Card>
    </div>
  );
}
