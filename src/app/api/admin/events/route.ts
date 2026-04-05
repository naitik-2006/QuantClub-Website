import { NextResponse } from 'next/server';
import { readJSON, writeJSON } from '@/lib/db';
import { revalidateTag } from 'next/cache';
import { verifyAdmin } from '@/lib/auth';

export async function GET() {
  const events = await readJSON<any[]>('events.json', []);
  return NextResponse.json(events);
}

export async function POST(request: Request) {
  if (!(await verifyAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const newEvent = await request.json();
    const events = await readJSON<any[]>('events.json', []);
    if (!newEvent.id) newEvent.id = Date.now();
    if (newEvent.order === undefined) newEvent.order = events.length;
    events.push(newEvent);
    await writeJSON('events.json', events);
    revalidateTag('events');
    return NextResponse.json(newEvent);
  } catch {
    return NextResponse.json({ error: 'Failed to add event' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  if (!(await verifyAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const updated = await request.json();
    const events = await readJSON<any[]>('events.json', []);
    const idx = events.findIndex((e: any) => e.id === updated.id);
    if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    events[idx] = { ...events[idx], ...updated };
    await writeJSON('events.json', events);
    revalidateTag('events');
    return NextResponse.json(events[idx]);
  } catch {
    return NextResponse.json({ error: 'Failed to update event' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  if (!(await verifyAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const { searchParams } = new URL(request.url);
    const id = parseInt(searchParams.get('id') || '');
    if (isNaN(id)) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    const events = await readJSON<any[]>('events.json', []);
    const updated = events.filter((e: any) => e.id !== id);
    await writeJSON('events.json', updated);
    revalidateTag('events');
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete event' }, { status: 500 });
  }
}
