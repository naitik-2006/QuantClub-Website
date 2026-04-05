import { NextResponse } from 'next/server';
import { readJSON, writeJSON } from '@/lib/db';
import type { Resource } from '@/data/resources';

export async function GET() {
  const resources = readJSON<Resource[]>('resources.json', []);
  return NextResponse.json(resources);
}

export async function POST(request: Request) {
  try {
    const newResource = await request.json();
    const resources = readJSON<Resource[]>('resources.json', []);
    
    if (!newResource.id) {
      newResource.id = 'admin-' + Date.now();
    }
    
    resources.push(newResource);
    writeJSON('resources.json', resources);
    
    return NextResponse.json(newResource);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to add resource' },
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
    
    const resources = readJSON<Resource[]>('resources.json', []);
    const updated = resources.filter(r => r.id !== id);
    writeJSON('resources.json', updated);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete resource' },
      { status: 500 }
    );
  }
}
