import { NextResponse } from 'next/server';
import { readJSON, writeJSON } from '@/lib/db';

export async function GET() {
  const opps = readJSON('opportunities.json', []);
  return NextResponse.json(opps);
}

export async function POST(request: Request) {
  try {
    const newOpp = await request.json();
    const opps = readJSON<any[]>('opportunities.json', []);
    
    if (!newOpp.id) {
      newOpp.id = 'opp-' + Date.now();
    }
    
    opps.push(newOpp);
    writeJSON('opportunities.json', opps);
    
    return NextResponse.json(newOpp);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to add opportunity' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }
    
    const opps = readJSON<any[]>('opportunities.json', []);
    const updated = opps.filter(o => o.id !== id);
    writeJSON('opportunities.json', updated);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete opportunity' },
      { status: 500 }
    );
  }
}
