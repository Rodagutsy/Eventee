import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  try {
    const { token, status } = await request.json();

    if (!token || !["yes", "no", "maybe"].includes(status)) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const admin = createAdminClient();
    const { data, error } = await admin
      .from("guests")
      .update({ rsvp_status: status, rsvp_responded_at: new Date().toISOString() })
      .eq("invite_token", token)
      .select()
      .single();

    if (error || !data) {
      return NextResponse.json({ error: "Invalid token" }, { status: 404 });
    }

    return NextResponse.json({ success: true, guest: data });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
