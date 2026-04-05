import { NextResponse } from 'next/server';
import { readJSON, writeJSON } from '@/lib/db';
import { revalidateTag } from 'next/cache';
import { verifyAdmin } from '@/lib/auth';

export async function GET() {
  const team = await readJSON('team.json', []);
  return NextResponse.json(team);
}

export async function POST(request: Request) {
  if (!(await verifyAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const newMember = await request.json();
    const team = await readJSON<any[]>('team.json', []);
    if (!newMember.id) newMember.id = Date.now();
    // Auto-assign order and sectionOrder if not provided
    const sectionMembers = team.filter((m: any) => m.section === newMember.section);
    const sections = Array.from(new Set(team.map((m: any) => m.section)));
    if (newMember.order === undefined) newMember.order = sectionMembers.length;
    if (newMember.sectionOrder === undefined) {
      const existingSection = team.find((m: any) => m.section === newMember.section);
      newMember.sectionOrder = existingSection ? existingSection.sectionOrder : sections.length;
    }
    team.push(newMember);
    await writeJSON('team.json', team);
    revalidateTag('team');
    return NextResponse.json(newMember);
  } catch {
    return NextResponse.json({ error: 'Failed to add member' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  if (!(await verifyAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const updated = await request.json();
    const team = await readJSON<any[]>('team.json', []);
    const idx = team.findIndex((m: any) => m.id === updated.id);
    if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    team[idx] = { ...team[idx], ...updated };
    await writeJSON('team.json', team);
    revalidateTag('team');
    return NextResponse.json(team[idx]);
  } catch {
    return NextResponse.json({ error: 'Failed to update member' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  if (!(await verifyAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const { searchParams } = new URL(request.url);
    const id = parseInt(searchParams.get('id') || '');
    if (isNaN(id)) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    const team = await readJSON<any[]>('team.json', []);
    const updated = team.filter((m: any) => m.id !== id);
    await writeJSON('team.json', updated);
    revalidateTag('team');
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete member' }, { status: 500 });
  }
}
