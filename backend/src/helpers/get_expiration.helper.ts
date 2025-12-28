import { Expiration } from 'src/enums/expiration.enum';

/**
 * Calculates expiration timestamp based on period.
 * Returns BigInt in milliseconds.
 * Returns 0n for NO_EXPIRATION (common practice for "never expires").
 */
export function getExpiration(period: Expiration): bigint {
  if (period === Expiration.NO_EXPIRATION) {
    return 0n; // Or a very far future date like 9999-12-31
  }

  const date = new Date();

  switch (period) {
    case Expiration.THREE_MONTHS:
      date.setMonth(date.getMonth() + 3);
      break;
    case Expiration.SIX_MONTHS:
      date.setMonth(date.getMonth() + 6);
      break;
    case Expiration.TWELVE_MONTHS:
      date.setMonth(date.getMonth() + 12);
      break;
    default:
      throw new Error('Invalid expiration period');
  }

  return BigInt(date.getTime());
}
