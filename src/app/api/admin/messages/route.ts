import { NextResponse } from 'next/server';
import { readJSON, writeJSON } from '@/lib/db';
import { verifyAdmin } from '@/lib/auth';

export async function GET() {
  if (!(await verifyAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const messages = await readJSON<any[]>('messages.json', []);
  // Return newest first
  return NextResponse.json([...messages].reverse());
}

export async function PATCH(request: Request) {
  if (!(await verifyAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    const messages = await readJSON<any[]>('messages.json', []);
    const idx = messages.findIndex((m: any) => m.id === id);
    if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    messages[idx].read = true;
    await writeJSON('messages.json', messages);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to mark as read' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  if (!(await verifyAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    const messages = await readJSON<any[]>('messages.json', []);
    const updated = messages.filter((m: any) => m.id !== id);
    await writeJSON('messages.json', updated);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete message' }, { status: 500 });
  }
}
