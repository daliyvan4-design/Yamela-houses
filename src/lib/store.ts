import { getSql } from './db';

/* ── Types ── */
export type Phase = 'étude' | 'construction' | 'terminé';

export interface ProjectRecord {
  id: number;
  name: string;
  location: string;
  year: string;
  category: 'residentiel' | 'bureaux' | 'commercial' | 'interieur' | 'mobilier';
  phase: Phase;
  description: string;
  image: string;
  gallery: string[];
  featured: boolean;
}

export interface ContactRecord {
  address: string;
  email: string;
  phone: string;
}

export interface AboutRecord {
  image: string;
  heading_dark: string;
  heading_accent: string;
  stats: { value: string; label: string }[];
  paragraphs: string[];
  services: string[];
}

/* ── Projects ── */
export async function getProjects(): Promise<ProjectRecord[]> {
  const sql = getSql();
  const rows = await sql`SELECT * FROM projects ORDER BY featured DESC, id`;
  return (rows as ProjectRecord[]).map(r => ({ ...r, gallery: r.gallery ?? [], featured: r.featured ?? false }));
}

export async function createProject(p: Omit<ProjectRecord, 'id'>): Promise<ProjectRecord> {
  const sql = getSql();
  const [row] = await sql`
    INSERT INTO projects (name, location, year, category, phase, description, image, gallery)
    VALUES (${p.name}, ${p.location}, ${p.year}, ${p.category}, ${p.phase ?? 'étude'}, ${p.description}, ${p.image}, ${JSON.stringify(p.gallery ?? [])})
    RETURNING *
  `;
  return { ...(row as ProjectRecord), gallery: (row as ProjectRecord).gallery ?? [] };
}

export async function updateProject(id: number, p: Partial<Omit<ProjectRecord, 'id'>>): Promise<ProjectRecord> {
  const sql = getSql();
  const [row] = await sql`
    UPDATE projects SET
      name        = COALESCE(${p.name        ?? null}, name),
      location    = COALESCE(${p.location    ?? null}, location),
      year        = COALESCE(${p.year        ?? null}, year),
      category    = COALESCE(${p.category    ?? null}, category),
      phase       = COALESCE(${p.phase       ?? null}, phase),
      description = COALESCE(${p.description ?? null}, description),
      image       = COALESCE(${p.image       ?? null}, image),
      gallery     = COALESCE(${p.gallery !== undefined ? JSON.stringify(p.gallery) : null}, gallery),
      featured    = COALESCE(${p.featured    !== undefined ? p.featured : null}, featured)
    WHERE id = ${id}
    RETURNING *
  `;
  return { ...(row as ProjectRecord), gallery: (row as ProjectRecord).gallery ?? [], featured: (row as ProjectRecord).featured ?? false };
}

export async function deleteProject(id: number): Promise<void> {
  const sql = getSql();
  await sql`DELETE FROM projects WHERE id = ${id}`;
}

/* ── Contact ── */
export async function getContact(): Promise<ContactRecord> {
  const sql = getSql();
  const [row] = await sql`SELECT address, email, phone FROM contact WHERE id = 1`;
  return (row ?? { address: '', email: '', phone: '' }) as ContactRecord;
}

export async function saveContact(data: ContactRecord): Promise<void> {
  const sql = getSql();
  await sql`
    INSERT INTO contact (id, address, email, phone)
    VALUES (1, ${data.address}, ${data.email}, ${data.phone})
    ON CONFLICT (id) DO UPDATE SET
      address = EXCLUDED.address,
      email   = EXCLUDED.email,
      phone   = EXCLUDED.phone
  `;
}

/* ── About ── */
export async function getAbout(): Promise<AboutRecord> {
  const sql = getSql();
  const [row] = await sql`SELECT image, heading_dark, heading_accent, stats, paragraphs, services FROM about WHERE id = 1`;
  return (row ?? { image: '', heading_dark: '', heading_accent: '', stats: [], paragraphs: [], services: [] }) as AboutRecord;
}

export async function saveAbout(data: AboutRecord): Promise<void> {
  const sql = getSql();
  await sql`
    INSERT INTO about (id, image, heading_dark, heading_accent, stats, paragraphs, services)
    VALUES (1, ${data.image}, ${data.heading_dark}, ${data.heading_accent}, ${JSON.stringify(data.stats)}, ${JSON.stringify(data.paragraphs)}, ${JSON.stringify(data.services)})
    ON CONFLICT (id) DO UPDATE SET
      image          = EXCLUDED.image,
      heading_dark   = EXCLUDED.heading_dark,
      heading_accent = EXCLUDED.heading_accent,
      stats          = EXCLUDED.stats,
      paragraphs     = EXCLUDED.paragraphs,
      services       = EXCLUDED.services
  `;
}
