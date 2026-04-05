import { NextResponse } from 'next/server';
import { readJSON, writeJSON } from '@/lib/db';
import type { CalEvent } from '@/lib/googleCalendar';

export async function GET() {
  const events = readJSON<CalEvent[]>('events.json', []);
  return NextResponse.json(events);
}

export async function POST(request: Request) {
  try {
    const newEvent = await request.json();
    const events = readJSON<CalEvent[]>('events.json', []);
    
    // Assign ID if not present
    if (!newEvent.id) {
      newEvent.id = Date.now();
    }
    
    events.push(newEvent);
    writeJSON('events.json', events);
    
    return NextResponse.json(newEvent);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to add event' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = parseInt(searchParams.get('id') || '');
    
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }
    
    const events = readJSON<CalEvent[]>('events.json', []);
    const updated = events.filter(e => e.id !== id);
    writeJSON('events.json', updated);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete event' },
      { status: 500 }
    );
  }
}
