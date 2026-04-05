import { NextResponse } from 'next/server';
import { readJSON, writeJSON } from '@/lib/db';

export async function GET() {
  const team = readJSON('team.json', []);
  return NextResponse.json(team);
}

export async function POST(request: Request) {
  try {
    const newMember = await request.json();
    const team = readJSON<any[]>('team.json', []);
    
    if (!newMember.id) {
      newMember.id = Date.now();
    }
    
    team.push(newMember);
    writeJSON('team.json', team);
    
    return NextResponse.json(newMember);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to add member' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = parseInt(searchParams.get('id') || '');
    
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }
    
    const team = readJSON<any[]>('team.json', []);
    const updated = team.filter(m => m.id !== id);
    writeJSON('team.json', updated);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete member' },
      { status: 500 }
    );
  }
}
