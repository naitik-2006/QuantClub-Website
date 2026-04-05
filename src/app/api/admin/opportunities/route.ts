import { NextResponse } from 'next/server';
import { readJSON, writeJSON } from '@/lib/db';
import { revalidateTag } from 'next/cache';
import { verifyAdmin } from '@/lib/auth';

export async function GET() {
  const opportunities = await readJSON<any[]>('opportunities.json', []);
  return NextResponse.json(opportunities);
}

export async function POST(request: Request) {
  if (!(await verifyAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const newOpp = await request.json();
    const opportunities = await readJSON<any[]>('opportunities.json', []);
    if (!newOpp.id) newOpp.id = 'opp-' + Date.now();
    if (newOpp.order === undefined) newOpp.order = opportunities.length;
    opportunities.push(newOpp);
    await writeJSON('opportunities.json', opportunities);
    revalidateTag('opportunities');
    return NextResponse.json(newOpp);
  } catch {
    return NextResponse.json({ error: 'Failed to add opportunity' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  if (!(await verifyAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const updated = await request.json();
    const opportunities = await readJSON<any[]>('opportunities.json', []);
    const idx = opportunities.findIndex((o: any) => o.id === updated.id);
    if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    opportunities[idx] = { ...opportunities[idx], ...updated };
    await writeJSON('opportunities.json', opportunities);
    revalidateTag('opportunities');
    return NextResponse.json(opportunities[idx]);
  } catch {
    return NextResponse.json({ error: 'Failed to update opportunity' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  if (!(await verifyAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    const opportunities = await readJSON<any[]>('opportunities.json', []);
    const updated = opportunities.filter((o: any) => o.id !== id);
    await writeJSON('opportunities.json', updated);
    revalidateTag('opportunities');
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete opportunity' }, { status: 500 });
  }
}
