'use client';

import { useState } from 'react';
import { z } from 'zod';
import Container from '@/components/Container';
import Section from '@/components/Section';
import ScoreBadge from '@/components/ScoreBadge';
import SiteHeader from '@/components/SiteHeader';
import FeatureGrid from '@/components/FeatureGrid';
import StepsSection from '@/components/StepsSection';
import FaqSection from '@/components/FaqSection';
import SiteFooter from '@/components/SiteFooter';

const schema = z.object({ url: z.string().url() });

export default function HomePage() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const parse = schema.safeParse({ url });
    if (!parse.success) {
      setError('Please enter a valid URL (e.g. https://example.com)');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/audit', {
        method: 'POST',
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to audit');
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
      setResult(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <SiteHeader />

      {/* HERO */}
      <Section className="py-14 sm:py-20">
        <Container className="flex flex-col gap-10 md:flex-row md:items-center">
          <div className="md:w-1/2">
            <span className="inline-flex items-center rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-emerald-700">
              ✅ Check if your website is OK in 30 seconds
            </span>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
              Is your website <span className="text-brand-green">really</span>{' '}
              OK?
            </h1>
            <p className="mt-3 text-lg text-gray-600">
              IsMyWebOk runs a real performance audit using Google PageSpeed
              Insights and shows you a clear health score and things to fix.
            </p>

            <form
              onSubmit={onSubmit}
              className="mt-6 flex max-w-xl flex-col gap-3 sm:flex-row"
            >
              <input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://your-site.com"
                className="flex-1 rounded-xl border px-4 py-3 text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-green"
              />
              <button
                type="submit"
                disabled={loading}
                className="rounded-xl bg-brand-green px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-600 disabled:opacity-60"
              >
                {loading ? 'Checking…' : 'Run free check'}
              </button>
            </form>

            {error && (
              <p className="mt-3 text-sm text-red-600">
                {error}
              </p>
            )}

            <p className="mt-3 text-xs text-gray-500">
              Powered by Google PageSpeed Insights. No login required for a
              quick check.
            </p>
          </div>

          {/* LIVE RESULT CARD */}
          <div className="md:w-1/2">
            <div className="rounded-2xl border bg-white/70 p-5 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-sm font-semibold text-gray-800">
                    Live website health preview
                  </h2>
                  <p className="text-xs text-gray-500">
                    Run a check to see your own score.
                  </p>
                </div>
                <ScoreBadge score={result?.score ?? 72} />
              </div>

              <div className="mt-4 rounded-xl bg-gray-50 p-4 text-sm text-gray-700">
                <p className="font-medium">
                  {result
                    ? 'Latest audit'
                    : 'Example: https://vercel.com (sample data)'}
                </p>
                <p className="mt-1 text-gray-600">
                  {result
                    ? result.summary
                    : 'Your website is generally OK but could be faster on mobile and has a few SEO content gaps.'}
                </p>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                <MetricTile
                  label="Mobile score"
                  value={
                    result?.metrics?.mobile_score !== undefined
                      ? result.metrics.mobile_score
                      : 64
                  }
                />
                <MetricTile
                  label="Desktop score"
                  value={
                    result?.metrics?.desktop_score !== undefined
                      ? result.metrics.desktop_score
                      : 89
                  }
                />
                <MetricTile
                  label="LCP (mobile)"
                  value={
                    result?.metrics?.mobile_lcp !== undefined
                      ? result.metrics.mobile_lcp
                      : '3.8 s'
                  }
                />
                <MetricTile
                  label="CLS (mobile)"
                  value={
                    result?.metrics?.mobile_cls !== undefined
                      ? result.metrics.mobile_cls
                      : '0.12'
                  }
                />
              </div>

              {result?.topFindings && (
                <div className="mt-4 border-t pt-3">
                  <p className="text-xs font-semibold text-gray-700">
                    Top issues to fix
                  </p>
                  <ul className="mt-1 list-disc space-y-1 pl-5 text-xs text-gray-600">
                    {result.topFindings.map((f: any, idx: number) => (
                      <li key={idx}>
                        <span className="font-medium">{f.severity}:</span>{' '}
                        {f.message}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </Container>
      </Section>

      {/* FEATURES */}
      <FeatureGrid />

      {/* HOW IT WORKS */}
      <StepsSection />

      {/* FAQ */}
      <FaqSection />

      {/* FOOTER */}
      <SiteFooter />
    </>
  );
}

function MetricTile({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg bg-white p-3 shadow-sm">
      <p className="text-[11px] text-gray-500">{label}</p>
      <p className="mt-1 text-sm font-semibold text-gray-800">{value}</p>
    </div>
  );
}
