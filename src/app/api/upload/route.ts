import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

export const dynamic = 'force-dynamic';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: Request) {
  const form = await req.formData();
  const file = form.get('file') as File | null;
  if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 });

  const buffer = Buffer.from(await file.arrayBuffer());

  const isHeic = file.name.toLowerCase().match(/\.hei[cf]$/) || file.type === 'image/heic' || file.type === 'image/heif';

  const result = await new Promise<{ secure_url: string }>((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      { folder: 'yamela-homes', resource_type: 'image', ...(isHeic ? { format: 'jpg' } : {}) },
      (err, res) => err ? reject(err) : resolve(res as { secure_url: string }),
    ).end(buffer);
  });

  return NextResponse.json({ url: result.secure_url });
}
