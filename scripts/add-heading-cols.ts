import { neon } from '@neondatabase/serverless';

const url = (process.env.DATABASE_URL ?? '').replace(/[&?]channel_binding=[^&]*/g, '');
const sql = neon(url);

async function main() {
  await sql`ALTER TABLE about ADD COLUMN IF NOT EXISTS heading_dark   TEXT NOT NULL DEFAULT 'L''architecture comme'`;
  await sql`ALTER TABLE about ADD COLUMN IF NOT EXISTS heading_accent TEXT NOT NULL DEFAULT 'acte de précision'`;
  console.log('✓ colonnes ajoutées');
}

main().catch(e => { console.error(e); process.exit(1); });
