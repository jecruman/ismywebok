import type { AuditReport } from './audit-schema';

export async function mockAudit(url: string): Promise<AuditReport> {
  // Simulate network delay
  await new Promise((r) => setTimeout(r, 800));

  const score = Math.floor(60 + Math.random() * 25); // 60–85

  return {
    url,
    score,
    summary:
      'Your website is generally OK but could be faster on mobile and has a few SEO content gaps.',
    metrics: {
      lcp: '3.8s',
      cls: 0.12,
      ttfb: '420ms',
      mobile_score: 64,
      seo_score: 78,
      security: 'good',
      broken_links: 3,
    },
    topFindings: [
      {
        severity: 'HIGH',
        message: 'Compress large images on the homepage (reduce total by ~3MB).',
      },
      {
        severity: 'MED',
        message: 'Add meta descriptions to 12 key pages.',
      },
      {
        severity: 'LOW',
        message: 'Consider adding a Content-Security-Policy header.',
      },
    ],
  };
}
