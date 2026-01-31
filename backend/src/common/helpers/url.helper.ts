import crypto from 'crypto';

export function generateShortCode(length = 7): string {
  return crypto.randomBytes(length).toString('base64url').slice(0, length);
}
