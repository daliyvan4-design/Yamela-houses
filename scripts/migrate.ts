/**
 * Migration : JSON files → Neon Postgres
 * Usage : DATABASE_URL=... npx tsx scripts/migrate.ts
 */
import { neon } from '@neondatabase/serverless';
import { readFileSync } from 'fs';
import { join } from 'path';

const sql = neon(process.env.DATABASE_URL!);

async function main() {
  console.log('→ Création des tables…');

  await sql`
    CREATE TABLE IF NOT EXISTS projects (
      id          SERIAL PRIMARY KEY,
      name        TEXT NOT NULL,
      location    TEXT NOT NULL DEFAULT '',
      year        TEXT NOT NULL DEFAULT '',
      tags        TEXT NOT NULL DEFAULT '',
      category    TEXT NOT NULL DEFAULT 'maison',
      description TEXT NOT NULL DEFAULT '',
      image       TEXT NOT NULL DEFAULT ''
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
    CREATE TABLE IF NOT EXISTS about (
      id          INT PRIMARY KEY DEFAULT 1,
      image       TEXT NOT NULL DEFAULT '',
      stats       JSONB NOT NULL DEFAULT '[]',
      paragraphs  JSONB NOT NULL DEFAULT '[]',
      services    JSONB NOT NULL DEFAULT '[]'
    )
  `;

  /* ── Projects ── */
  const projects = JSON.parse(readFileSync(join(process.cwd(), 'data/projects.json'), 'utf-8'));
  console.log(`→ Insertion de ${projects.length} projets…`);
  for (const p of projects) {
    await sql`
      INSERT INTO projects (name, location, year, tags, category, description, image)
      VALUES (${p.name}, ${p.location}, ${p.year}, ${p.tags}, ${p.category}, ${p.description ?? ''}, ${p.image ?? ''})
      ON CONFLICT DO NOTHING
    `;
  }

  /* ── Contact ── */
  const contact = JSON.parse(readFileSync(join(process.cwd(), 'data/contact.json'), 'utf-8'));
  console.log('→ Insertion des infos contact…');
  await sql`
    INSERT INTO contact (id, address, email, phone)
    VALUES (1, ${contact.address}, ${contact.email}, ${contact.phone})
    ON CONFLICT (id) DO UPDATE SET address = EXCLUDED.address, email = EXCLUDED.email, phone = EXCLUDED.phone
  `;

  /* ── About ── */
  const about = JSON.parse(readFileSync(join(process.cwd(), 'data/about.json'), 'utf-8'));
  console.log('→ Insertion de la page À propos…');
  await sql`
    INSERT INTO about (id, image, stats, paragraphs, services)
    VALUES (1, ${about.image ?? ''}, ${JSON.stringify(about.stats)}, ${JSON.stringify(about.paragraphs)}, ${JSON.stringify(about.services)})
    ON CONFLICT (id) DO UPDATE SET image = EXCLUDED.image, stats = EXCLUDED.stats, paragraphs = EXCLUDED.paragraphs, services = EXCLUDED.services
  `;

  console.log('✓ Migration terminée.');
}

main().catch(err => { console.error(err); process.exit(1); });
