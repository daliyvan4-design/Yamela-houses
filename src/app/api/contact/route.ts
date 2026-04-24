import { NextResponse } from 'next/server';
import { getContact, saveContact, ContactRecord } from '@/lib/store';

export const dynamic = 'force-dynamic';

export async function GET() {
  const contact = await getContact();
  return NextResponse.json(contact);
}

export async function PUT(req: Request) {
  const body = await req.json() as ContactRecord;
  await saveContact(body);
  return NextResponse.json(body);
}
