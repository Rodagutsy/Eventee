import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const signature = request.headers.get("x-paystack-signature");

    const secret = process.env.PAYSTACK_SECRET_KEY;
    if (!secret) {
      return NextResponse.json({ error: "Not configured" }, { status: 500 });
    }

    const hash = crypto.createHmac("sha512", secret).update(body).digest("hex");

    if (hash !== signature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const event = JSON.parse(body);

    if (event.event === "charge.success") {
      const reference = event.data.reference;
      const admin = createAdminClient();

      const { data: existing } = await admin
        .from("orders")
        .select("payment_status")
        .eq("payment_reference", reference)
        .single();

      if (existing?.payment_status === "paid") {
        return NextResponse.json({ status: "ok" });
      }

      await admin
        .from("orders")
        .update({
          payment_status: "paid",
          paystack_transaction_id: event.data.id.toString(),
          paid_at: new Date().toISOString(),
        })
        .eq("payment_reference", reference);
    }

    return NextResponse.json({ status: "ok" });
  } catch {
    return NextResponse.json({ status: "error" }, { status: 500 });
  }
}
