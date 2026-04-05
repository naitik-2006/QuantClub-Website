import { NextResponse } from 'next/server';
import { readJSON, writeJSON } from '@/lib/db';

export async function GET() {
  try {
    const events = readJSON('events.json', []);
    const resources = readJSON('resources.json', []);
    const team = readJSON('team.json', []);
    const opportunities = readJSON('opportunities.json', []);
    
    const backup = {
      timestamp: new Date().toISOString(),
      events,
      resources,
      team,
      opportunities
    };
    
    return NextResponse.json(backup);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to generate backup' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const backup = await request.json();
    
    if (!backup.events || !backup.resources || !backup.team || !backup.opportunities) {
      return NextResponse.json(
        { error: 'Invalid backup format' },
        { status: 400 }
      );
    }
    
    writeJSON('events.json', backup.events);
    writeJSON('resources.json', backup.resources);
    writeJSON('team.json', backup.team);
    writeJSON('opportunities.json', backup.opportunities);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to restore backup' },
      { status: 500 }
    );
  }
}
