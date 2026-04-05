import { NextResponse } from 'next/server';
import { readJSON, writeJSON } from '@/lib/db';
import { revalidateTag } from 'next/cache';
import { verifyAdmin } from '@/lib/auth';

export async function GET() {
  try {
    const events = await readJSON('events.json', []);
    const resources = await readJSON('resources.json', []);
    const team = await readJSON('team.json', []);
    const opportunities = await readJSON('opportunities.json', []);
    
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
  if (!verifyAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const backup = await request.json();
    
    if (!backup.events || !backup.resources || !backup.team || !backup.opportunities) {
      return NextResponse.json(
        { error: 'Invalid backup format' },
        { status: 400 }
      );
    }
    
    await writeJSON('events.json', backup.events);
    await writeJSON('resources.json', backup.resources);
    await writeJSON('team.json', backup.team);
    await writeJSON('opportunities.json', backup.opportunities);
    
    revalidateTag('events');
    revalidateTag('resources');
    revalidateTag('team');
    revalidateTag('opportunities');
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to restore backup' },
      { status: 500 }
    );
  }
}
