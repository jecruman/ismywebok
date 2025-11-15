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
    .limit(10);

  if (error) {
    console.error('Supabase history error:', error);
    return [];
  }

  return (data as AuditRow[]) ?? [];
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
            Enter a URL to see recent audits stored for that website. In the
            future, logged-in users will be able to see full history and trends.
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

          {url && audits.length > 0 && (
            <div className="mt-8">
              <div className="mb-2 text-xs text-gray-500">
                Showing last {audits.length} audits for{' '}
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
                    {audits.map((row) => {
                      const m = row.metrics || {};
                      const mobileScore = m['mobile_score'] ?? 'n/a';
                      const desktopScore = m['desktop_score'] ?? 'n/a';
                      const lcp = m['mobile_lcp'] ?? 'n/a';
                      const cls = m['mobile_cls'] ?? 'n/a';

                      const topIssue = row.top_findings?.[0];

                      return (
                        <tr key={row.id} className="border-b last:border-b-0">
                          <td className="px-4 py-3 align-top text-[11px] text-gray-600">
                            {new Date(row.created_at).toLocaleString()}
                          </td>
                          <td className="px-4 py-3 align-top text-sm font-semibold text-gray-900">
                            {row.score}
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
                Later: sign-in will unlock full history, charts and PDF reports.
              </p>
            </div>
          )}
        </Container>
      </Section>
    </>
  );
}
