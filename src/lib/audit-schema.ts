import { z } from 'zod';

export const AuditFinding = z.object({
  severity: z.enum(["HIGH", "MED", "LOW"]),
  message_en: z.string(),
  message_pl: z.string(),
});

export const AuditReport = z.object({
  url: z.string().url(),
  score: z.number().min(0).max(100),
  summary_en: z.string(),
  summary_pl: z.string(),
  metrics: z.record(z.union([z.string(), z.number()])),
  topFindings: z.array(AuditFinding),
});

export type AuditReport = z.infer<typeof AuditReport>;
