import { NextRequest } from "next/server";
import { z } from "zod";
import { runPageSpeedAudit } from "@/lib/psi";
import { createAdminClient } from "@/lib/supabase";
import { hashIp } from "@/lib/ip-hash";

const bodySchema = z.object({ url: z.string().url() });

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = bodySchema.parse(body);

    // 1) Run PSI audit (this already builds bilingual report)
    const report = await runPageSpeedAudit(parsed.url);

    // 2) Try to save to Supabase (non-blocking for the user)
    try {
      const supabase = createAdminClient();

      // Get IP (Vercel specific: x-forwarded-for or req.ip)
      const ip =
        req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
        // @ts-ignore - NextRequest has ip in edge/runtime sometimes
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

    // 3) Return the report to the client
    return new Response(JSON.stringify(report), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    console.error("Audit error:", err);
    const message = err?.message || "Invalid request or audit failure";
    return new Response(JSON.stringify({ error: message }), { status: 400 });
  }
}
