import { NextResponse } from 'next/server';
import { readJSON, writeJSON } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Honeypot check — bots fill hidden fields, humans don't
    if (body.honeypot) {
      // Silent success — don't reveal we rejected it
      return NextResponse.json({ ok: true });
    }

    const { name, email, subject, message } = body;
    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const messages = await readJSON<any[]>('messages.json', []);
    const newMsg = {
      id: 'msg-' + Date.now(),
      name,
      email,
      subject: subject || 'General',
      message,
      read: false,
      timestamp: new Date().toISOString(),
    };

    messages.push(newMsg);
    await writeJSON('messages.json', messages);

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Failed to save message' }, { status: 500 });
  }
}
