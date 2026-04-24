import { neon, type NeonQueryFunction } from '@neondatabase/serverless';

let _sql: NeonQueryFunction<false, false> | null = null;

export function getSql(): NeonQueryFunction<false, false> {
  if (!_sql) {
    const raw = process.env.DATABASE_URL ?? process.env.POSTGRES_URL;
    if (!raw) throw new Error('DATABASE_URL is not set');
    // Strip channel_binding — unsupported by neon HTTP driver
    const url = raw.replace(/[&?]channel_binding=[^&]*/g, '');
    _sql = neon(url);
  }
  return _sql;
}

export async function initDb() {
  const sql = getSql();

  await sql`
    CREATE TABLE IF NOT EXISTS projects (
      id        SERIAL PRIMARY KEY,
      name      TEXT NOT NULL,
      location  TEXT NOT NULL DEFAULT '',
      year      TEXT NOT NULL DEFAULT '',
      tags      TEXT NOT NULL DEFAULT '',
      category  TEXT NOT NULL DEFAULT 'maison',
      description TEXT NOT NULL DEFAULT '',
      image     TEXT NOT NULL DEFAULT ''
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS contact (
      id      INT PRIMARY KEY DEFAULT 1,
      address TEXT NOT NULL DEFAULT '',
      email   TEXT NOT NULL DEFAULT '',
      phone   TEXT NOT NULL DEFAULT ''
    )
  `;

  await sql`
    INSERT INTO contact (id, address, email, phone)
    VALUES (1, '', '', '')
    ON CONFLICT (id) DO NOTHING
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS about (
      id          INT PRIMARY KEY DEFAULT 1,
      image       TEXT NOT NULL DEFAULT '',
      stats       JSONB NOT NULL DEFAULT '[]',
      paragraphs  JSONB NOT NULL DEFAULT '[]',
      services    JSONB NOT NULL DEFAULT '[]'
    )
  `;

  await sql`
    INSERT INTO about (id, image, stats, paragraphs, services)
    VALUES (1, '', '[]', '[]', '[]')
    ON CONFLICT (id) DO NOTHING
  `;
}
