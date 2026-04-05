import { NextResponse } from 'next/server';
import { readJSON, writeJSON } from '@/lib/db';
import { verifyAdmin } from '@/lib/auth';

/**
 * PUT /api/admin/achievements/order
 * Body: { ids: number[] }  — ordered array of achievement IDs
 * Sets order = index for each achievement in the list.
 */
export async function PUT(request: Request) {
  if (!(await verifyAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const { ids } = await request.json();
    if (!Array.isArray(ids)) return NextResponse.json({ error: 'ids must be an array' }, { status: 400 });

    const achievements = await readJSON<any[]>('achievements.json', []);
    const orderMap: Record<number, number> = {};
    ids.forEach((id: number, idx: number) => { orderMap[id] = idx; });

    for (const item of achievements) {
      if (orderMap[item.id] !== undefined) {
        item.order = orderMap[item.id];
      }
    }

    await writeJSON('achievements.json', achievements);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}
