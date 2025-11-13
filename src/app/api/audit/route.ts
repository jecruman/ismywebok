import { NextRequest } from 'next/server';
import { z } from 'zod';
import { mockAudit } from '@/lib/mock-audit';

const bodySchema = z.object({ url: z.string().url() });

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = bodySchema.parse(body);

    const report = await mockAudit(parsed.url);

    return new Response(JSON.stringify(report), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    const message = err?.message || 'Invalid request';
    return new Response(JSON.stringify({ error: message }), { status: 400 });
  }
}
