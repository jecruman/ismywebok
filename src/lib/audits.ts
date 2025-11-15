// src/lib/audits.ts
import { createAdminClient } from "./supabase";
import type { AuditReport } from "./audit-schema";

/**
 * Returns the latest audit for a URL if it's fresher than ttlMinutes.
 * Otherwise returns null.
 */
export async function getFreshAuditForUrl(
  url: string,
  ttlMinutes: number
): Promise<{ report: AuditReport; createdAt: Date } | null> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("audits")
    .select("*")
    .eq("url", url)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("Supabase getFreshAuditForUrl error:", error);
    return null;
  }

  if (!data) return null;

  const createdAt = new Date(data.created_at);
  const ageMs = Date.now() - createdAt.getTime();
  const ageMinutes = ageMs / 1000 / 60;

  if (ageMinutes > ttlMinutes) {
    return null;
  }

  // Map DB row → AuditReport shape
  const report: AuditReport = {
    url: data.url,
    score: data.score,
    summary_en: data.summary_en,
    summary_pl: data.summary_pl,
    metrics: data.metrics,
    topFindings: data.top_findings,
  };

  return { report, createdAt };
}
