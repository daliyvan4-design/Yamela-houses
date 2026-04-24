'use client';
import Link from 'next/link';

const A = '#C8A97A';
const BORDER = 'rgba(200,169,122,0.15)';

interface Props { href: string; label: string; value: string | number; sub: string; }

export default function DashboardCard({ href, label, value, sub }: Props) {
  return (
    <Link href={href} style={{
      display: 'block', textDecoration: 'none',
      padding: '28px 32px', border: `0.5px solid ${BORDER}`,
      background: 'rgba(255,255,255,0.02)',
      transition: 'border-color 0.2s, background 0.2s',
    }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = A; (e.currentTarget as HTMLElement).style.background = 'rgba(200,169,122,0.04)'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = BORDER; (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.02)'; }}
    >
      <p style={{ fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: A, marginBottom: 12 }}>{label}</p>
      <p style={{ fontFamily: 'var(--font-cormorant)', fontSize: 44, fontWeight: 300, color: '#FAFAF8', lineHeight: 1, marginBottom: 10 }}>{value}</p>
      <p style={{ fontSize: 10, color: 'rgba(250,250,248,0.3)', letterSpacing: '0.04em' }}>{sub}</p>
    </Link>
  );
}
