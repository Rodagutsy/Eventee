import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  try {
    const { reference, orderId } = await request.json();

    if (!reference || !orderId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const paystackSecret = process.env.PAYSTACK_SECRET_KEY;
    if (!paystackSecret) {
      return NextResponse.json({ error: "Paystack not configured" }, { status: 500 });
    }

    const verifyRes = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: { Authorization: `Bearer ${paystackSecret}` },
    });

    const verifyData = await verifyRes.json();

    if (!verifyData.status || verifyData.data.status !== "success") {
      return NextResponse.json({ error: "Payment verification failed" }, { status: 400 });
    }

    const admin = createAdminClient();

    const { data: existing } = await admin
      .from("orders")
      .select("payment_status")
      .eq("id", orderId)
      .single();

    if (existing?.payment_status === "paid") {
      return NextResponse.json({ success: true, message: "Already verified" });
    }

    await admin
      .from("orders")
      .update({
        payment_status: "paid",
        payment_reference: reference,
        paystack_transaction_id: verifyData.data.id.toString(),
        paid_at: new Date().toISOString(),
      })
      .eq("id", orderId);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
