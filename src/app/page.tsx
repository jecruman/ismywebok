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
import type { Lang } from '@/lib/lang';

const schema = z.object({ url: z.string().url() });

export default function HomePage() {
  const [lang, setLang] = useState<Lang>('en');
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const parse = schema.safeParse({ url });
    if (!parse.success) {
      setError(
        lang === 'en'
          ? 'Please enter a valid URL (e.g. https://example.com)'
          : 'Podaj poprawny adres URL (np. https://twoja-strona.pl)'
      );
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

  const heroTitle =
    lang === 'en'
      ? 'Is your website really OK?'
      : 'Czy Twoja strona naprawdę jest OK?';

  const heroSubtitle =
    lang === 'en'
      ? 'IsMyWebOk runs a real performance audit using Google PageSpeed Insights and shows you a clear health score and things to fix.'
      : 'IsMyWebOk wykonuje prawdziwy audyt wydajności z użyciem Google PageSpeed Insights i pokazuje prosty wynik oraz listę najważniejszych poprawek.';

  const heroTagline =
    lang === 'en'
      ? 'Check if your website is OK in 30 seconds'
      : 'Sprawdź, czy Twoja strona jest OK w 30 sekund';

  const ctaText = lang === 'en' ? 'Run free check' : 'Wykonaj darmowy test';

  const urlPlaceholder =
    lang === 'en' ? 'https://your-site.com' : 'https://twoja-strona.pl';

  const poweredText =
    lang === 'en'
      ? 'Powered by Google PageSpeed Insights. No login required for a quick check.'
      : 'Korzysta z Google PageSpeed Insights. Szybki test bez logowania.';

  const previewTitle =
    lang === 'en'
      ? 'Live website health preview'
      : 'Podgląd wyniku zdrowia strony';

  const previewSubtitle =
    lang === 'en'
      ? 'Run a check to see your own score.'
      : 'Uruchom test, aby zobaczyć swój wynik.';

  const previewExampleLabel =
    lang === 'en'
      ? 'Example: https://vercel.com (sample data)'
      : 'Przykład: https://vercel.com (dane przykładowe)';

  const previewExampleText =
    lang === 'en'
      ? 'Your website is generally OK but could be faster on mobile and has a few SEO content gaps.'
      : 'Twoja strona jest ogólnie OK, ale mogłaby działać szybciej na telefonach i ma kilka braków SEO.';

  const topIssuesLabel =
    lang === 'en' ? 'Top issues to fix' : 'Najważniejsze problemy do poprawy';

  return (
    <>
      <SiteHeader lang={lang} onChangeLang={setLang} />

      {/* HERO */}
      <Section className="py-14 sm:py-20">
        <Container className="flex flex-col gap-10 md:flex-row md:items-center">
          <div className="md:w-1/2">
            <span className="inline-flex items-center rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-emerald-700">
              ✅ {heroTagline}
            </span>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
              {heroTitle}{' '}
              <span className="text-brand-green">
                {lang === 'en' ? '' : ''}
              </span>
            </h1>
            <p className="mt-3 text-lg text-gray-600">{heroSubtitle}</p>

            <form
              onSubmit={onSubmit}
              className="mt-6 flex max-w-xl flex-col gap-3 sm:flex-row"
            >
              <input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder={urlPlaceholder}
                className="flex-1 rounded-xl border px-4 py-3 text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-green"
              />
              <button
                type="submit"
                disabled={loading}
                className="rounded-xl bg-brand-green px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-600 disabled:opacity-60"
              >
                {loading ? (lang === 'en' ? 'Checking…' : 'Sprawdzanie…') : ctaText}
              </button>
            </form>

            {error && (
              <p className="mt-3 text-sm text-red-600">
                {error}
              </p>
            )}

            <p className="mt-3 text-xs text-gray-500">{poweredText}</p>
          </div>

          {/* LIVE RESULT CARD */}
          <div className="md:w-1/2">
            <div className="rounded-2xl border bg-white/70 p-5 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-sm font-semibold text-gray-800">
                    {previewTitle}
                  </h2>
                  <p className="text-xs text-gray-500">
                    {previewSubtitle}
                  </p>
                </div>
                <ScoreBadge score={result?.score ?? 72} />
              </div>

              <div className="mt-4 rounded-xl bg-gray-50 p-4 text-sm text-gray-700">
                <p className="font-medium">
                  {result ? (
                    <>
                      {lang === 'en' ? 'Latest audit' : 'Ostatni audyt'}
                      {result.from_cache && result.cached_at && (
                        <span className="ml-1 text-xs text-gray-500">
                          (
                          {lang === 'en'
                            ? `cached at ${new Date(result.cached_at).toLocaleString()}`
                            : `zapisane ${new Date(result.cached_at).toLocaleString()}`}
                          )
                        </span>
                      )}
                    </>
                  ) : (
                    previewExampleLabel
                  )}
                </p>
                <p className="mt-1 text-gray-600">
                  {result
                    ? (lang === 'en' ? result.summary_en : result.summary_pl)
                    : previewExampleText}
                </p>

                {/* SEE HISTORY LINK */}
                {result && result.url && (
                  <div className="mt-3">
                    <a
                      href={`/history?url=${encodeURIComponent(result.url)}`}
                      className="text-xs font-medium text-brand-green hover:underline"
                    >
                      {lang === 'en' ? 'See history →' : 'Zobacz historię →'}
                    </a>
                  </div>
                )}
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                <MetricTile
                  label={lang === 'en' ? 'Mobile score' : 'Wynik mobile'}
                  value={
                    result?.metrics?.mobile_score !== undefined
                      ? result.metrics.mobile_score
                      : 64
                  }
                />
                <MetricTile
                  label={lang === 'en' ? 'Desktop score' : 'Wynik desktop'}
                  value={
                    result?.metrics?.desktop_score !== undefined
                      ? result.metrics.desktop_score
                      : 89
                  }
                />
                <MetricTile
                  label={lang === 'en' ? 'LCP (mobile)' : 'LCP (mobile)'}
                  value={
                    result?.metrics?.mobile_lcp !== undefined
                      ? result.metrics.mobile_lcp
                      : '3.8 s'
                  }
                />
                <MetricTile
                  label={lang === 'en' ? 'CLS (mobile)' : 'CLS (mobile)'}
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
                    {topIssuesLabel}
                  </p>
                  <ul className="mt-1 list-disc space-y-1 pl-5 text-xs text-gray-600">
                    {result.topFindings.map((f: any, idx: number) => (
                      <li key={idx}>
                        <span className="font-medium">{f.severity}:</span>{' '}
                        {lang === 'en' ? f.message_en : f.message_pl}
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
      <FeatureGrid lang={lang} />

      {/* HOW IT WORKS */}
      <StepsSection lang={lang} />

      {/* FAQ */}
      <FaqSection lang={lang} />

      {/* FOOTER */}
      <SiteFooter lang={lang} />
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
