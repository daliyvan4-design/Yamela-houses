import { NextResponse } from 'next/server';
import { getSql } from '@/lib/db';

export const dynamic = 'force-dynamic';

async function ensureTable() {
  const sql = getSql();
  await sql`
    CREATE TABLE IF NOT EXISTS logos (
      id     SERIAL PRIMARY KEY,
      name   TEXT NOT NULL DEFAULT '',
      url    TEXT NOT NULL,
      active BOOLEAN NOT NULL DEFAULT false
    )
  `;
}

export async function GET() {
  const sql = getSql();
  await ensureTable();
  const rows = await sql`SELECT * FROM logos ORDER BY id`;
  const active = (rows as { id: number; name: string; url: string; active: boolean }[]).find(r => r.active);
  return NextResponse.json({ logos: rows, active_url: active?.url ?? null });
}

export async function POST(req: Request) {
  const sql = getSql();
  await ensureTable();
  const { name, url } = await req.json() as { name: string; url: string };
  const [row] = await sql`INSERT INTO logos (name, url) VALUES (${name}, ${url}) RETURNING *`;
  return NextResponse.json(row);
}
