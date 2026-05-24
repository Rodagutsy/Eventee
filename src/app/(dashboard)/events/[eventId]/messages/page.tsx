"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Plus, MessageSquare } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import type { Message } from "@/lib/types";
import { formatDate } from "@/lib/utils/formatting";

export default function MessagesPage() {
  const params = useParams();
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase.from("messages").select("*").eq("event_id", params.eventId).order("created_at", { ascending: false }).then(({ data }) => {
      if (data) setMessages(data as Message[]);
      setLoading(false);
    });
  }, [params.eventId]);

  if (loading) return <div className="flex flex-col gap-3">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-16 bg-[#F1F3F5] animate-pulse rounded-[8px]" />)}</div>;

  return (
    <div>
      <Link href={"/events/" + params.eventId} className="inline-flex items-center gap-1 text-[13px] text-[#6C757D] hover:text-[#4338CA] mb-4"><ArrowLeft size={14} /> Event</Link>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-[26px] font-semibold text-[#212529] font-[family-name:var(--font-display)] tracking-[-0.8px]">Messages</h1>
        <Link href={"/events/" + params.eventId + "/messages/compose"}><Button variant="primary" size="sm" icon={<Plus size={14} />}>Compose</Button></Link>
      </div>
      {messages.length === 0 ? (
        <EmptyState icon={<MessageSquare size={40} />} heading="No messages yet" body="Send invitations, reminders, and announcements." action={{ label: "Compose message", onClick: () => router.push("/events/" + params.eventId + "/messages/compose") }} />
      ) : (
        <div className="flex flex-col gap-2">
          {messages.map((msg) => (
            <Card key={msg.id} padding="sm">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[13px] font-medium text-[#343A40]">{msg.subject || "(No subject)"}</span>
                    <Badge variant={msg.status === "sent" ? "success" : msg.status === "draft" ? "draft" : msg.status === "failed" ? "danger" : "warning"}>{msg.status}</Badge>
                  </div>
                  <p className="text-[11px] text-[#6C757D] mt-1">{msg.channel} - {formatDate(msg.created_at)} - {msg.recipient_count} recipients</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
