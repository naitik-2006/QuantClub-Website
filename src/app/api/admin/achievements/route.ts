import { NextResponse } from 'next/server';
import { readJSON, writeJSON } from '@/lib/db';
import { verifyAdmin } from '@/lib/auth';

export async function GET() {
  const achievements = await readJSON<any[]>('achievements.json', []);
  const sorted = [...achievements].sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
  return NextResponse.json(sorted);
}

export async function POST(request: Request) {
  if (!(await verifyAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const newItem = await request.json();
    const achievements = await readJSON<any[]>('achievements.json', []);
    if (!newItem.id) newItem.id = Date.now();
    if (newItem.order === undefined) newItem.order = achievements.length;
    achievements.push(newItem);
    await writeJSON('achievements.json', achievements);
    return NextResponse.json(newItem);
  } catch {
    return NextResponse.json({ error: 'Failed to add achievement' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  if (!(await verifyAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const updated = await request.json();
    const achievements = await readJSON<any[]>('achievements.json', []);
    const idx = achievements.findIndex((a: any) => a.id === updated.id);
    if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    achievements[idx] = { ...achievements[idx], ...updated };
    await writeJSON('achievements.json', achievements);
    return NextResponse.json(achievements[idx]);
  } catch {
    return NextResponse.json({ error: 'Failed to update achievement' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  if (!(await verifyAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const { searchParams } = new URL(request.url);
    const id = parseInt(searchParams.get('id') || '');
    if (isNaN(id)) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    const achievements = await readJSON<any[]>('achievements.json', []);
    const updated = achievements.filter((a: any) => a.id !== id);
    await writeJSON('achievements.json', updated);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete achievement' }, { status: 500 });
  }
}
