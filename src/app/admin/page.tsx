import AdminShell from '@/components/admin/AdminShell';
import DashboardCard from '@/components/admin/DashboardCard';
import { getProjects } from '@/lib/store';

export const dynamic = 'force-dynamic';

const BORDER = 'rgba(200,169,122,0.15)';
const A = '#C8A97A';

export default async function AdminDashboard() {
  let projects: Awaited<ReturnType<typeof getProjects>> = [];
  let dbError: string | null = null;
  try {
    projects = await getProjects();
  } catch (err) {
    dbError = String(err);
  }
  const byCategory = {
    interieur: projects.filter(p => p.category === 'interieur').length,
    immeuble:  projects.filter(p => p.category === 'immeuble').length,
    maison:    projects.filter(p => p.category === 'maison').length,
  };

  const cards = [
    { href: '/admin/projects', label: 'Projets',  value: projects.length, sub: `${byCategory.interieur} intérieur · ${byCategory.immeuble} immeuble · ${byCategory.maison} maison` },
    { href: '/admin/about',    label: 'À propos', value: '—', sub: 'Description, image, stats' },
    { href: '/admin/contact',  label: 'Contact',  value: '—', sub: 'Email, téléphone, adresse' },
  ];

  return (
    <AdminShell title="Dashboard">
      {dbError && (
        <div style={{ background: 'rgba(250,100,100,0.1)', border: '0.5px solid rgba(250,100,100,0.4)',
          padding: '16px 20px', marginBottom: 24, fontSize: 12, color: 'rgba(250,150,150,0.9)',
          fontFamily: 'monospace', wordBreak: 'break-all' }}>
          DB Error: {dbError}
        </div>
      )}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 48 }}>
        {cards.map(c => <DashboardCard key={c.href} {...c}/>)}
      </div>

      <div style={{ borderTop: `0.5px solid ${BORDER}`, paddingTop: 32 }}>
        <p style={{ fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase',
          color: 'rgba(250,250,248,0.25)', marginBottom: 20 }}>Derniers projets</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {projects.slice(-5).reverse().map(p => (
            <div key={p.id} style={{
              display: 'grid', gridTemplateColumns: '1fr auto auto',
              gap: 24, padding: '14px 20px', alignItems: 'center',
              background: 'rgba(255,255,255,0.02)', border: `0.5px solid ${BORDER}`,
            }}>
              <span style={{ fontSize: 13, color: '#FAFAF8', letterSpacing: '0.02em' }}>{p.name}</span>
              <span style={{ fontSize: 10, color: A, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{p.category}</span>
              <span style={{ fontSize: 10, color: 'rgba(250,250,248,0.3)' }}>{p.year}</span>
            </div>
          ))}
        </div>
      </div>
    </AdminShell>
  );
}
