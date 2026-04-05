import { cookies } from 'next/headers';
import crypto from 'crypto';

export function getAdminToken(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

export async function verifyAdmin(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;
  
  // Use environment variable in production, fallback for testing
  const adminPassword = process.env.ADMIN_PASSWORD || 'quantclub2026';
  
  if (!token) return false;
  
  const expectedToken = getAdminToken(adminPassword);
  return token === expectedToken;
}
