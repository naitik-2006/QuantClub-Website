import { NextResponse } from 'next/server';
import { readJSON, writeJSON } from '@/lib/db';
import { revalidateTag } from 'next/cache';
import { verifyAdmin } from '@/lib/auth';

export async function GET() {
  const events = await readJSON<any[]>('events.json', []);
  return NextResponse.json(events);
}

export async function POST(request: Request) {
  if (!verifyAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const newEvent = await request.json();
    const events = await readJSON<any[]>('events.json', []);
    
    if (!newEvent.id) {
      newEvent.id = Date.now();
    }
    
    events.push(newEvent);
    await writeJSON('events.json', events);
    revalidateTag('events');
    
    return NextResponse.json(newEvent);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to add event' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  if (!verifyAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { searchParams } = new URL(request.url);
    const id = parseInt(searchParams.get('id') || '');
    
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }
    
    const events = await readJSON<any[]>('events.json', []);
    const updated = events.filter(e => e.id !== id);
    await writeJSON('events.json', updated);
    revalidateTag('events');
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete event' },
      { status: 500 }
    );
  }
}
