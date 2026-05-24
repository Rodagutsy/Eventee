"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function SettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-[26px] font-semibold text-[#212529] font-[family-name:var(--font-display)] tracking-[-0.8px] mb-6">Settings</h1>
      <Card className="mb-4">
        <h2 className="text-[15px] font-semibold text-[#212529] mb-4">Account</h2>
        <p className="text-[13px] text-[#6C757D] mb-4">Manage your account settings and preferences.</p>
        <Button variant="danger" onClick={handleSignOut}>Sign Out</Button>
      </Card>
    </div>
  );
}
