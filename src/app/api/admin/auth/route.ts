import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getAdminToken } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { password } = await request.json();
    const adminPassword = process.env.ADMIN_PASSWORD || 'quantclub2026';
    
    if (password === adminPassword) {
      // Set the secure, HTTP-Only cookie to track the admin session
      cookies().set({
        name: 'admin_token',
        value: getAdminToken(password),
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 1 week
      });
      
      return NextResponse.json({ success: true });
    }
    
    return NextResponse.json(
      { success: false, error: 'Invalid password' },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Bad request' },
      { status: 400 }
    );
  }
}

// Add a logout route while we are at it
export async function DELETE() {
  cookies().delete('admin_token');
  return NextResponse.json({ success: true });
}
