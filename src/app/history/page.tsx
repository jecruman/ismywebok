// src/app/history/page.tsx
import Container from '@/components/Container';
import Section from '@/components/Section';
import { createAdminClient } from '@/lib/supabase';

type SearchParams = {
  url?: string;
};

type AuditRow = {
  id: string;
  created_at: string;
  url: string;
  score: number;
  summary_en: string;
  summary_pl: string;
  metrics: Record<string, string | number>;
  top_findings: {
    severity: 'HIGH' | 'MED' | 'LOW';
    message_en: string;
    message_pl: string;
  }[];
};

async function getHistory(url: string): Promise<AuditRow[]> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('audits')
    .select('*')
    .eq('url', url)
    .order('created_at', { ascending: false })
    .limit(10); // <- limit visible history here (future: unlock more with account)

  if (error) {
    console.error('Supabase history error:', error);
    return [];
  }

  return (data as AuditRow[]) ?? [];
}

// Build SVG sparkline points from score history
function buildSparklinePoints(audits: AuditRow[]): string {
  if (!audits.length) return '';

  // We want oldest on the left, newest on the right
  const data = [...audits].reverse();
  const scores = data.map((a) => a.score);
  const min = Math.min(...scores);
  const max = Math.max(...scores);

  const width = 160;
  const height = 40;
  const paddingX = 4;
  const paddingY = 4;
  const range = Math.max(max - min, 1);
  const innerWidth = width - paddingX * 2;
  const innerHeight = height - paddingY * 2;

  const stepX =
    data.length === 1 ? 0 : innerWidth / Math.max(data.length - 1, 1);

  const points = data
    .map((row, idx) => {
      const norm = (row.score - min) / range;
      const x = paddingX + idx * stepX;
      const y = height - paddingY - norm * innerHeight;
      return `${x},${y}`;
    })
    .join(' ');

  return points;
}

export default async function HistoryPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const rawUrl = searchParams.url?.trim();
  const url = rawUrl && rawUrl.length > 0 ? rawUrl : null;

  let audits: AuditRow[] = [];
  if (url) {
    audits = await getHistory(url);
  }

  const hasHistory = url && audits.length > 0;
  const sparkPoints = hasHistory ? buildSparklinePoints(audits) : '';

  const newestScore = hasHistory ? audits[0].score : null;
  const oldestScore =
    hasHistory && audits.length > 1
      ? audits[audits.length - 1].score
      : newestScore;

  const totalChange =
    newestScore != null && oldestScore != null
      ? newestScore - oldestScore
      : null;

  return (
    <>
      {/* Simple header with brand + back link */}
      <header className="border-b bg-white/80 backdrop-blur">
        <Container className="flex items-center justify-between py-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand-green text-xs font-bold text-white">
              OK
            </div>
            <span className="text-sm font-semibold tracking-tight">
              IsMyWebOk
            </span>
          </div>
          <a
            href="/"
            className="text-xs font-medium text-brand-green hover:underline"
          >
            ← Back to main check
          </a>
        </Container>
      </header>

      <Section className="py-14">
        <Container>
          <h1 className="text-2xl font-semibold tracking-tight">
            Audit history
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Enter a URL to see recent audits stored for that website. Later,
            signed-in users will unlock full history, charts and PDF reports.
          </p>

          <form
            method="get"
            className="mt-6 flex max-w-xl flex-col gap-3 sm:flex-row"
          >
            <input
              name="url"
              defaultValue={url ?? ''}
              placeholder="https://your-site.com"
              className="flex-1 rounded-xl border px-4 py-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-green"
            />
            <button
              type="submit"
              className="rounded-xl bg-brand-green px-5 py-3 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-600"
            >
              Show history
            </button>
          </form>

          {!url && (
            <p className="mt-6 text-sm text-gray-500">
              Start by entering the exact URL you audited on the main page.
            </p>
          )}

          {url && audits.length === 0 && (
            <p className="mt-6 text-sm text-gray-500">
              No audits found yet for{' '}
              <span className="font-mono text-gray-700">{url}</span>. Run a
              check on the homepage first.
            </p>
          )}

          {/* Sparkline + summary */}
          {hasHistory && (
            <div className="mt-8 rounded-2xl border bg-white p-4 shadow-sm">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Score trend
                  </p>
                  <p className="mt-1 text-sm text-gray-700">
                    Latest score:{' '}
                    <span className="font-semibold">{newestScore}</span>
                    {totalChange !== null && totalChange !== 0 && (
                      <span
                        className={`ml-2 text-xs font-semibold ${
                          totalChange > 0
                            ? 'text-green-600'
                            : 'text-red-600'
                        }`}
                      >
                        {totalChange > 0 ? '↑' : '↓'}{' '}
                        {Math.abs(totalChange)} total vs oldest
                      </span>
                    )}
                  </p>
                  <p className="mt-1 text-[11px] text-gray-500">
                    Based on the last {audits.length} audits stored for this
                    URL.
                  </p>
                </div>
                {sparkPoints && (
                  <div className="flex h-20 items-center sm:justify-end">
                    <svg
                      width={160}
                      height={40}
                      viewBox="0 0 160 40"
                      className="text-brand-green"
                    >
                      <polyline
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        points={sparkPoints}
                      />
                    </svg>
                  </div>
                )}
              </div>
              <p className="mt-2 text-[11px] text-gray-500">
                Only the last {audits.length} audits are shown here. In the
                future, creating an account will unlock full history and more
                detailed charts.
              </p>
            </div>
          )}

          {/* Table with per-row arrows */}
          {url && audits.length > 0 && (
            <div className="mt-8">
              <div className="mb-2 text-xs text-gray-500">
                Showing up to {audits.length} most recent audits for{' '}
                <span className="font-mono text-gray-700">{url}</span>.
              </div>

              <div className="overflow-x-auto rounded-2xl border bg-white shadow-sm">
                <table className="min-w-full text-left text-xs">
                  <thead className="border-b bg-gray-50 text-[11px] uppercase tracking-wide text-gray-500">
                    <tr>
                      <th className="px-4 py-3">Date</th>
                      <th className="px-4 py-3">Score</th>
                      <th className="px-4 py-3">Mobile</th>
                      <th className="px-4 py-3">Desktop</th>
                      <th className="px-4 py-3">LCP (mobile)</th>
                      <th className="px-4 py-3">CLS (mobile)</th>
                      <th className="px-4 py-3">Top issue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {audits.map((row, idx) => {
                      const m = row.metrics || {};
                      const mobileScore = m['mobile_score'] ?? 'n/a';
                      const desktopScore = m['desktop_score'] ?? 'n/a';
                      const lcp = m['mobile_lcp'] ?? 'n/a';
                      const cls = m['mobile_cls'] ?? 'n/a';

                      const topIssue = row.top_findings?.[0];

                      const previous = audits[idx + 1];
                      let diff: number | null = null;
                      if (previous) {
                        diff = row.score - previous.score;
                      }

                      return (
                        <tr key={row.id} className="border-b last:border-b-0">
                          <td className="px-4 py-3 align-top text-[11px] text-gray-600">
                            {new Date(row.created_at).toLocaleString()}
                          </td>
                          <td className="px-4 py-3 align-top text-sm font-semibold text-gray-900">
                            {row.score}
                            {diff !== null && diff !== 0 && (
                              <span
                                className={`ml-1 text-[11px] ${
                                  diff > 0
                                    ? 'text-green-600'
                                    : 'text-red-600'
                                }`}
                              >
                                {diff > 0 ? '↑' : '↓'} {Math.abs(diff)}
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3 align-top text-xs text-gray-700">
                            {mobileScore}
                          </td>
                          <td className="px-4 py-3 align-top text-xs text-gray-700">
                            {desktopScore}
                          </td>
                          <td className="px-4 py-3 align-top text-xs text-gray-700">
                            {lcp}
                          </td>
                          <td className="px-4 py-3 align-top text-xs text-gray-700">
                            {cls}
                          </td>
                          <td className="px-4 py-3 align-top text-xs text-gray-700">
                            {topIssue
                              ? `${topIssue.severity}: ${topIssue.message_en}`
                              : '—'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <p className="mt-3 text-[11px] text-gray-500">
                Later, signed-in users will be able to see full history, export
                reports and set up automatic weekly audits.
              </p>
            </div>
          )}
        </Container>
      </Section>
    </>
  );
}
