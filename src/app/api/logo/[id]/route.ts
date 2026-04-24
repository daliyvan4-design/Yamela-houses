import { NextResponse } from 'next/server';
import { getSql } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function PUT(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const sql = getSql();
  const { id } = await params;
  await sql`UPDATE logos SET active = false`;
  await sql`UPDATE logos SET active = true WHERE id = ${Number(id)}`;
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const sql = getSql();
  const { id } = await params;
  await sql`DELETE FROM logos WHERE id = ${Number(id)}`;
  return NextResponse.json({ ok: true });
}
