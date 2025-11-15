import { AuditReport } from "./audit-schema";

const PSI_ENDPOINT = "https://www.googleapis.com/pagespeedonline/v5/runPagespeed";

type Strategy = "mobile" | "desktop";

async function fetchPsi(url: string, strategy: Strategy, apiKey: string) {
  const params = new URLSearchParams({
    url,
    strategy,
    key: apiKey,
    category: "performance",
  });

  const res = await fetch(`${PSI_ENDPOINT}?${params.toString()}`);

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`PSI error (${strategy}): ${res.status} ${text}`);
  }

  return res.json();
}

function extractMetrics(psiJson: any) {
  const lighthouse = psiJson.lighthouseResult;
  const audits = lighthouse?.audits ?? {};
  const categories = lighthouse?.categories ?? {};

  const perfScore =
    categories.performance?.score != null
      ? Math.round(categories.performance.score * 100)
      : null;

  const lcp = audits["largest-contentful-paint"]?.displayValue;
  const cls = audits["cumulative-layout-shift"]?.displayValue;
  const tbt = audits["total-blocking-time"]?.displayValue;
  const tti = audits["interactive"]?.displayValue;
  const fcp = audits["first-contentful-paint"]?.displayValue;

  return {
    perfScore,
    lcp,
    cls,
    tbt,
    tti,
    fcp,
  };
}

export async function runPageSpeedAudit(url: string): Promise<AuditReport> {
  const apiKey = process.env.GOOGLE_PSI_API_KEY;
  if (!apiKey) {
    throw new Error("Missing GOOGLE_PSI_API_KEY");
  }

  // Run both mobile & desktop – mobile is usually the main one for scoring
  const [mobile, desktop] = await Promise.all([
    fetchPsi(url, "mobile", apiKey),
    fetchPsi(url, "desktop", apiKey),
  ]);

  const mobileMetrics = extractMetrics(mobile);
  const desktopMetrics = extractMetrics(desktop);

  // Choose overall score from mobile (stricter)
  const score = mobileMetrics.perfScore ?? desktopMetrics.perfScore ?? 0;

const summary_en =
  score >= 80
    ? "Your website is performing well overall, with room for small improvements."
    : score >= 60
    ? "Your website is OK, but there are several performance issues worth fixing."
    : "Your website is currently slow or poorly optimized. Fixing key issues could significantly improve user experience and SEO.";

const summary_pl =
  score >= 80
    ? "Twoja strona działa ogólnie dobrze, wymaga jedynie drobnych poprawek."
    : score >= 60
    ? "Twoja strona jest w porządku, ale wymaga kilku istotnych usprawnień."
    : "Twoja strona działa obecnie wolno lub jest słabo zoptymalizowana. Poprawa kluczowych elementów może znacząco polepszyć doświadczenie użytkownika i SEO.";


  const metrics: Record<string, string | number> = {
    mobile_score: mobileMetrics.perfScore ?? "n/a",
    desktop_score: desktopMetrics.perfScore ?? "n/a",
    mobile_lcp: mobileMetrics.lcp ?? "n/a",
    mobile_cls: mobileMetrics.cls ?? "n/a",
    mobile_tbt: mobileMetrics.tbt ?? "n/a",
    mobile_tti: mobileMetrics.tti ?? "n/a",
    mobile_fcp: mobileMetrics.fcp ?? "n/a",
  };

  // Very simple, generic findings to start
  const topFindings = [
    {
      severity: score < 60 ? "HIGH" : score < 80 ? "MED" : "LOW",
      message_en:
        "Improve core performance metrics (LCP, FCP, TBT) by optimizing images and reducing JavaScript.",
      message_pl:
        "Popraw kluczowe metryki wydajności (LCP, FCP, TBT) optymalizując obrazy i zmniejszając ilość JavaScriptu.",
    },
    {
      severity: "MED",
      message_en:
        "Check the detailed PageSpeed report for unused JavaScript and CSS and remove or defer them.",
      message_pl:
        "Sprawdź szczegółowy raport PageSpeed pod kątem nieużywanego JavaScriptu i CSS, a następnie usuń lub odłóż ich ładowanie.",
    },
    {
      severity: "LOW",
      message_en:
        "Consider implementing caching (CDN, HTTP caching headers) for static assets.",
      message_pl:
        "Rozważ wdrożenie mechanizmów cache (CDN, nagłówki HTTP cache) dla zasobów statycznych.",
    },
  ];

  return {
    url,
    score,
    summary_en,
    summary_pl,
    metrics,
    topFindings,
  };
}
