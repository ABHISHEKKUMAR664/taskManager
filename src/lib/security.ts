// Basic security utilities
import crypto from 'crypto';

// Simple password hashing (better than plain text)
export function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password + 'salt123').digest('hex');
}

export function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash;
}

// Get JWT secret from environment or fallback
export function getJWTSecret(): string {
  return process.env.JWT_SECRET || 'abhi_secret_fallback_change_in_production';
}
