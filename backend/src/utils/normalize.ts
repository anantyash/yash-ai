import crypto from 'crypto';

export function normalizeQuestion(question: string): string {
  return question
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/[?!.]+$/, ''); // Strip trailing sentence marks for hash consistency
}

export function hashString(text: string): string {
  return crypto.createHash('sha256').update(text).digest('hex');
}

export function hashIp(ip: string): string {
  return crypto.createHash('sha256').update(ip + '_yash_salt').digest('hex');
}
