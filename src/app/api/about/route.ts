import { NextResponse } from 'next/server';
import { getAbout, saveAbout, AboutRecord } from '@/lib/store';

export async function GET() {
  const about = await getAbout();
  return NextResponse.json(about);
}

export async function PUT(req: Request) {
  const body = await req.json() as AboutRecord;
  await saveAbout(body);
  return NextResponse.json(body);
}
