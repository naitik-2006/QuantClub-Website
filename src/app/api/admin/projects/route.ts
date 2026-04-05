import { NextResponse } from 'next/server';
import { readJSON, writeJSON } from '@/lib/db';
import { verifyAdmin } from '@/lib/auth';

export async function GET() {
  const projects = await readJSON<any[]>('projects.json', []);
  return NextResponse.json([...projects].sort((a, b) => (a.order ?? 99) - (b.order ?? 99)));
}

export async function POST(request: Request) {
  if (!(await verifyAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const item = await request.json();
    const projects = await readJSON<any[]>('projects.json', []);
    if (!item.id) item.id = Date.now();
    if (item.order === undefined) item.order = projects.length;
    projects.push(item);
    await writeJSON('projects.json', projects);
    return NextResponse.json(item);
  } catch {
    return NextResponse.json({ error: 'Failed to add project' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  if (!(await verifyAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const updated = await request.json();
    const projects = await readJSON<any[]>('projects.json', []);
    const idx = projects.findIndex((p: any) => p.id === updated.id);
    if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    projects[idx] = { ...projects[idx], ...updated };
    await writeJSON('projects.json', projects);
    return NextResponse.json(projects[idx]);
  } catch {
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  if (!(await verifyAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const { searchParams } = new URL(request.url);
    const id = parseInt(searchParams.get('id') || '');
    if (isNaN(id)) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    const projects = await readJSON<any[]>('projects.json', []);
    await writeJSON('projects.json', projects.filter((p: any) => p.id !== id));
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
  }
}
