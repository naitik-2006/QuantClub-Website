import { NextResponse } from 'next/server';
import { verifyAdmin } from '@/lib/auth';
import { put } from '@vercel/blob';

export async function POST(request: Request) {
  // Ensure the user is an admin
  if (!(await verifyAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'File is required.' }, { status: 400 });
    }

    // Attempt to upload to Vercel Blob
    // This requires BLOB_READ_WRITE_TOKEN environment variable to be set in Vercel project settings
    const blob = await put(file.name, file, { access: 'public' });

    // Return the blob URL which acts as the permalink for the image
    return NextResponse.json({ url: blob.url });
  } catch (error: any) {
    console.error('Error uploading to Vercel Blob:', error);
    return NextResponse.json(
      { error: 'Failed to upload photo. Did you enable Vercel Blob and map the token?' },
      { status: 500 }
    );
  }
}
