import { NextResponse } from 'next/server';
import { readJSON, writeJSON } from '@/lib/db';
import { revalidateTag } from 'next/cache';
import { verifyAdmin } from '@/lib/auth';

export async function GET() {
  const opportunities = await readJSON<any[]>('opportunities.json', []);
  return NextResponse.json(opportunities);
}

export async function POST(request: Request) {
  if (!verifyAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const newOpp = await request.json();
    const opportunities = await readJSON<any[]>('opportunities.json', []);
    
    if (!newOpp.id) {
      newOpp.id = 'opp-' + Date.now();
    }
    
    opportunities.push(newOpp);
    await writeJSON('opportunities.json', opportunities);
    revalidateTag('opportunities');
    
    return NextResponse.json(newOpp);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to add opportunity' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  if (!verifyAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }
    
    const opportunities = await readJSON<any[]>('opportunities.json', []);
    const updated = opportunities.filter(o => o.id !== id);
    await writeJSON('opportunities.json', updated);
    revalidateTag('opportunities');
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete opportunity' },
      { status: 500 }
    );
  }
}
