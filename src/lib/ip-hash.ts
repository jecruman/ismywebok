// src/lib/ip-hash.ts
import crypto from 'crypto';

export function hashIp(ip: string | null): string | null {
  if (!ip) return null;
  return crypto.createHash('sha256').update(ip).digest('hex');
}
