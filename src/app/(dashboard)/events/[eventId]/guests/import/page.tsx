"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Upload, AlertTriangle, Check } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function GuestImportPage() {
  const params = useParams();
  const router = useRouter();
  const [step, setStep] = useState<"upload" | "preview" | "done">("upload");
  const [rows, setRows] = useState<{ full_name: string; email?: string; phone?: string; category?: string }[]>([]);
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState({ added: 0, skipped: 0 });

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target?.result as string;
      const lines = text.split("\n").filter(Boolean);
      const headers = lines[0].toLowerCase().split(",").map((h) => h.trim());
      const parsed = lines.slice(1).map((line) => {
        const vals = line.split(",").map((v) => v.trim());
        const row: Record<string, string> = {};
        headers.forEach((h, i) => { row[h] = vals[i] || ""; });
        return {
          full_name: row["name"] || row["full_name"] || "",
          email: row["email"] || "",
          phone: row["phone"] || row["phone number"] || "",
          category: row["category"] || "regular",
        };
      }).filter((r) => r.full_name);
      setRows(parsed);
      setStep("preview");
    };
    reader.readAsText(file);
  };

  const handleImport = async () => {
    setImporting(true);
    const supabase = createClient();
    let added = 0;
    let skipped = 0;

    for (const row of rows) {
      const { error } = await supabase.from("guests").insert({
        event_id: params.eventId,
        full_name: row.full_name,
        email: row.email || null,
        phone: row.phone || null,
        category: ["vip", "regular", "family", "friends", "corporate", "media", "other"].includes(row.category || "") ? row.category : "regular",
      });
      if (error?.message?.includes("duplicate")) skipped++;
      else if (!error) added++;
    }

    setResult({ added, skipped });
    setImporting(false);
    setStep("done");
  };

  return (
    <div className="max-w-lg mx-auto">
      <Link href={`/events/${params.eventId}/guests`} className="inline-flex items-center gap-1 text-[13px] text-[#6C757D] hover:text-[#4338CA] mb-4">
        <ArrowLeft size={14} /> Guests
      </Link>

      <h1 className="text-[26px] font-semibold text-[#212529] font-[family-name:var(--font-display)] tracking-[-0.8px] mb-6">Import Guests</h1>

      {step === "upload" && (
        <Card>
          <div className="border-[1px] border-dashed border-[#DEE2E6] rounded-[12px] p-8 text-center hover:border-[#ADB5BD] transition-colors cursor-pointer">
            <input type="file" accept=".csv,.tsv,.txt" onChange={handleFile} className="hidden" id="csv-input" />
            <label htmlFor="csv-input" className="cursor-pointer">
              <Upload size={32} className="mx-auto mb-3 text-[#ADB5BD]" />
              <p className="text-[14px] text-[#6C757D]">Upload CSV file with guest names</p>
              <p className="text-[11px] text-[#ADB5BD] mt-1">Supports: name, email, phone, category columns</p>
            </label>
          </div>
          <div className="mt-4">
            <p className="text-[12px] text-[#6C757D] font-medium mb-2">Or paste data:</p>
            <textarea
              className="w-full text-[13px] px-3 py-2 rounded-[8px] border border-[#DEE2E6] min-h-[120px] focus:outline-none focus:border-[#4338CA]"
              placeholder="Name, Email, Phone, Category&#10;John Doe, john@example.com, 080..., vip"
            />
          </div>
        </Card>
      )}

      {step === "preview" && (
        <Card>
          <h2 className="text-[16px] font-semibold text-[#212529] mb-2">Preview ({rows.length} guests)</h2>
          <p className="text-[12px] text-[#6C757D] mb-4">Review the parsed data before importing.</p>
          <div className="max-h-64 overflow-y-auto mb-4">
            {rows.map((row, i) => (
              <div key={i} className="flex items-center gap-3 py-2 border-b border-[#DEE2E6] last:border-0">
                <span className="text-[11px] text-[#ADB5BD] w-6">{i + 1}.</span>
                <span className="text-[13px] text-[#343A40] flex-1">{row.full_name}</span>
                {row.email && <span className="text-[11px] text-[#ADB5BD] hidden sm:inline">{row.email}</span>}
                <Badge variant="draft">{row.category || "regular"}</Badge>
              </div>
            ))}
          </div>
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setStep("upload")}>Back</Button>
            <Button variant="primary" onClick={handleImport} loading={importing}>Import {rows.length} Guests</Button>
          </div>
        </Card>
      )}

      {step === "done" && (
        <Card>
          <div className="text-center py-4">
            <div className="w-12 h-12 rounded-full bg-[#EAF7EF] flex items-center justify-center mx-auto mb-3">
              <Check size={24} className="text-[#22C55E]" />
            </div>
            <h2 className="text-[20px] font-semibold text-[#212529] font-[family-name:var(--font-display)]">Import Complete</h2>
            <div className="flex items-center justify-center gap-6 mt-4">
              <div className="text-center">
                <p className="text-[24px] font-bold text-[#22C55E]">{result.added}</p>
                <p className="text-[12px] text-[#6C757D]">Added</p>
              </div>
              {result.skipped > 0 && (
                <div className="text-center">
                  <p className="text-[24px] font-bold text-[#F59E0B]">{result.skipped}</p>
                  <p className="text-[12px] text-[#6C757D]">Skipped</p>
                </div>
              )}
            </div>
            <Button variant="primary" className="mt-6" onClick={() => router.push(`/events/${params.eventId}/guests`)}>
              View Guests
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
