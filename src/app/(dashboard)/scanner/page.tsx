"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useEvent } from "@/lib/event-context";

export default function ScannerRootPage() {
  const router = useRouter();
  const { currentEvent, loading } = useEvent();

  useEffect(() => {
    if (!loading) {
      if (currentEvent) {
        router.replace(`/scanner/${currentEvent.id}`);
      } else {
        router.replace("/home");
      }
    }
  }, [loading, currentEvent, router]);

  return (
    <div className="flex items-center justify-center py-12">
      <div className="w-8 h-8 border-2 border-[#EEF2FF] border-t-[#4338CA] rounded-full animate-spin" />
    </div>
  );
}
