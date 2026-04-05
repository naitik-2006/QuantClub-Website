import { NextResponse } from 'next/server';
import { readJSON, writeJSON } from '@/lib/db';
import { verifyAdmin } from '@/lib/auth';
import { revalidateTag } from 'next/cache';

export async function PUT(request: Request) {
  if (!(await verifyAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const { sections } = await request.json();
    if (!Array.isArray(sections)) return NextResponse.json({ error: 'sections must be an array' }, { status: 400 });

    const items = await readJSON<any[]>('team.json', []);
    
    // Create a map of section name to its order
    const sectionOrderMap: Record<string, number> = {};
    sections.forEach((sec: string, idx: number) => { sectionOrderMap[sec] = idx; });

    for (const item of items) {
      if (sectionOrderMap[item.section] !== undefined) {
        item.sectionOrder = sectionOrderMap[item.section];
      }
    }

    await writeJSON('team.json', items);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to update section order' }, { status: 500 });
  }
}
