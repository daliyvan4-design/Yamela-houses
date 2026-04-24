import { neon } from '@neondatabase/serverless';

export const sql = neon(process.env.DATABASE_URL!);

export async function initDb() {
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
