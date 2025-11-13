'use client';

import { useState } from 'react';
import { z } from 'zod';
import Container from '@/components/Container';
import Section from '@/components/Section';
import ScoreBadge from '@/components/ScoreBadge';

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
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container className="py-16">
      <Section className="py-10">
        <h1 className="text-4xl font-semibold tracking-tight">
          Is your website OK?
        </h1>
        <p className="mt-3 text-lg text-gray-600">
          Run a free health check in 30 seconds.
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
            className="rounded-xl bg-brand-green px-5 py-3 text-white font-medium disabled:opacity-60"
          >
            {loading ? 'Checking…' : 'Check'}
          </button>
        </form>

        {error && <p className="mt-4 text-red-600">{error}</p>}

        {result && (
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border p-5">
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-xl font-semibold">Overall Health</h2>
                <ScoreBadge score={result.score} />
              </div>
              <p className="mt-2 text-gray-600">{result.summary}</p>
              <ul className="mt-4 list-disc space-y-1 pl-6 text-gray-700">
                {result.topFindings?.map((f: any, i: number) => (
                  <li key={i}>
                    <span className="font-medium">{f.severity}:</span>{' '}
                    {f.message}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border p-5">
              <h3 className="text-lg font-semibold">Key Metrics</h3>
              <div className="mt-3 space-y-2 text-sm">
                {Object.entries(result.metrics || {}).map(([k, v]) => (
                  <div
                    key={k}
                    className="flex justify-between border-b py-2 last:border-b-0"
                  >
                    <span className="capitalize">
                      {k.replace(/_/g, ' ')}
                    </span>
                    <span className="font-medium">{String(v)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Section>
    </Container>
  );
}
