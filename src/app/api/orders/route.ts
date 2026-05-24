import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  try {
    const { token, productId, size, quantity } = await request.json();

    if (!token || !productId || !quantity) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const admin = createAdminClient();

    const { data: guest, error: guestError } = await admin
      .from("guests")
      .select("id, event_id")
      .eq("invite_token", token)
      .single();

    if (guestError || !guest) {
      return NextResponse.json({ error: "Invalid token" }, { status: 404 });
    }

    const { data: product, error: productError } = await admin
      .from("aso_ebi_products")
      .select("id, price, event_id")
      .eq("id", productId)
      .single();

    if (productError || !product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const totalAmount = product.price * quantity;

    const { data: order, error: orderError } = await admin
      .from("orders")
      .insert({
        event_id: product.event_id,
        guest_id: guest.id,
        product_id: product.id,
        quantity,
        size: size || null,
        total_amount: totalAmount,
        payment_status: "pending",
      })
      .select()
      .single();

    if (orderError) {
      return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
    }

    return NextResponse.json({ success: true, order });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
