import { NextResponse } from 'next/server';
import { readJSON, writeJSON } from '@/lib/db';
import { revalidateTag } from 'next/cache';
import { verifyAdmin } from '@/lib/auth';

export async function GET() {
  const resources = await readJSON<any[]>('resources.json', []);
  return NextResponse.json(resources);
}

export async function POST(request: Request) {
  if (!(await verifyAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const newResource = await request.json();
    const resources = await readJSON<any[]>('resources.json', []);
    if (!newResource.id) newResource.id = 'admin-' + Date.now();
    if (newResource.order === undefined) newResource.order = resources.length;
    resources.push(newResource);
    await writeJSON('resources.json', resources);
    revalidateTag('resources');
    return NextResponse.json(newResource);
  } catch {
    return NextResponse.json({ error: 'Failed to add resource' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  if (!(await verifyAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const updated = await request.json();
    const resources = await readJSON<any[]>('resources.json', []);
    const idx = resources.findIndex((r: any) => r.id === updated.id);
    if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    resources[idx] = { ...resources[idx], ...updated };
    await writeJSON('resources.json', resources);
    revalidateTag('resources');
    return NextResponse.json(resources[idx]);
  } catch {
    return NextResponse.json({ error: 'Failed to update resource' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  if (!(await verifyAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    const resources = await readJSON<any[]>('resources.json', []);
    const updated = resources.filter((r: any) => r.id !== id);
    await writeJSON('resources.json', updated);
    revalidateTag('resources');
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete resource' }, { status: 500 });
  }
}
