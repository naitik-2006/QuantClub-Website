import { NextResponse } from 'next/server';
import { readJSON, writeJSON } from '@/lib/db';
import { verifyAdmin } from '@/lib/auth';
import { revalidateTag } from 'next/cache';

export async function PUT(request: Request) {
  if (!(await verifyAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const { ids } = await request.json();
    if (!Array.isArray(ids)) return NextResponse.json({ error: 'ids must be an array' }, { status: 400 });

    const items = await readJSON<any[]>('team.json', []);
    const orderMap: Record<number, number> = {};
    ids.forEach((id: number, idx: number) => { orderMap[id] = idx; });

    for (const item of items) {
      if (orderMap[item.id] !== undefined) {
        item.order = orderMap[item.id];
      }
    }

    await writeJSON('team.json', items);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}
