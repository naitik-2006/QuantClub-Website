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
    
    if (!newResource.id) {
      newResource.id = 'admin-' + Date.now();
    }
    
    resources.push(newResource);
    await writeJSON('resources.json', resources);
    revalidateTag('resources');
    
    return NextResponse.json(newResource);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to add resource' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  if (!(await verifyAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }
    
    const resources = await readJSON<any[]>('resources.json', []);
    const updated = resources.filter(r => r.id !== id);
    await writeJSON('resources.json', updated);
    revalidateTag('resources');
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete resource' },
      { status: 500 }
    );
  }
}
