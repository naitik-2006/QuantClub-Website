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
    
    if (!newMember.id) {
      newMember.id = Date.now();
    }
    
    team.push(newMember);
    await writeJSON('team.json', team);
    revalidateTag('team');
    
    return NextResponse.json(newMember);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to add member' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  if (!(await verifyAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { searchParams } = new URL(request.url);
    const id = parseInt(searchParams.get('id') || '');
    
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }
    
    const team = await readJSON<any[]>('team.json', []);
    const updated = team.filter(m => m.id !== id);
    await writeJSON('team.json', updated);
    revalidateTag('team');
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete member' },
      { status: 500 }
    );
  }
}
