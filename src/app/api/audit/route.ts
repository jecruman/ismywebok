import { NextRequest } from "next/server";
import { z } from "zod";
import { runPageSpeedAudit } from "@/lib/psi";
import { createAdminClient } from "@/lib/supabase";
import { hashIp } from "@/lib/ip-hash";
import { getFreshAuditForUrl } from "@/lib/audits";
import type { AuditReport } from "@/lib/audit-schema";

const bodySchema = z.object({
  url: z.string().url(),
  forceRefresh: z.boolean().optional(),
});

const CACHE_TTL_MINUTES = 60; // easy to tweak later

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = bodySchema.parse(body);

    const url = parsed.url;
    const forceRefresh = parsed.forceRefresh ?? false;

    let report: AuditReport;
    let fromCache = false;
    let cachedAt: string | null = null;

    // 1) Try cache first (if not force-refresh)
    if (!forceRefresh) {
      const cached = await getFreshAuditForUrl(url, CACHE_TTL_MINUTES);
      if (cached) {
        report = cached.report;
        fromCache = true;
        cachedAt = cached.createdAt.toISOString();

        return new Response(
          JSON.stringify({
            ...report,
            from_cache: fromCache,
            cached_at: cachedAt,
          }),
          {
            status: 200,
            headers: { "Content-Type": "application/json" },
          }
        );
      }
    }

    // 2) No fresh cache or force refresh → run PSI
    report = await runPageSpeedAudit(url);
    fromCache = false;
    cachedAt = new Date().toISOString();

    // 3) Save to Supabase (non-blocking for user)
    try {
      const supabase = createAdminClient();

      const ip =
        req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
        // @ts-ignore
        (req as any).ip ||
        null;
      const ip_hash = hashIp(ip);

      const { error } = await supabase.from("audits").insert({
        url: report.url,
        score: report.score,
        summary_en: report.summary_en,
        summary_pl: report.summary_pl,
        metrics: report.metrics,
        top_findings: report.topFindings,
        ip_hash,
        // user_id: null // later when you add auth
      });

      if (error) {
        console.error("Supabase insert error (audits):", error);
      }
    } catch (dbErr) {
      console.error("Supabase client error:", dbErr);
    }

    // 4) Return fresh report
    return new Response(
      JSON.stringify({
        ...report,
        from_cache: fromCache,
        cached_at: cachedAt,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (err: any) {
    console.error("Audit error:", err);
    const message = err?.message || "Invalid request or audit failure";
    return new Response(JSON.stringify({ error: message }), { status: 400 });
  }
}
