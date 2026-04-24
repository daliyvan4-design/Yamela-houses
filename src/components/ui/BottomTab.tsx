'use client';
import { T } from '@/lib/tokens';
import { Page } from '@/lib/types';

const icons = {
  home: (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="0.9">
      <path d="M2 9L9 3l7 6"/><path d="M4 8v7h4v-4h2v4h4V8"/>
    </svg>
  ),
  grid: (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="0.9">
      <rect x="2" y="2" width="6" height="6"/><rect x="10" y="2" width="6" height="6"/>
      <rect x="2" y="10" width="6" height="6"/><rect x="10" y="10" width="6" height="6"/>
    </svg>
  ),
  user: (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="0.9">
      <circle cx="9" cy="7" r="3.5"/>
      <path d="M2.5 16.5c0-3.31 2.91-6 6.5-6s6.5 2.69 6.5 6"/>
    </svg>
  ),
  mail: (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="0.9">
      <rect x="2" y="4" width="14" height="10" rx="0.5"/>
      <path d="M2 5l7 5.5L16 5"/>
    </svg>
  ),
};

const tabs: { key: Page; icon: React.ReactNode; label: string }[] = [
  { key: 'hero',     icon: icons.home, label: 'Home' },
  { key: 'projects', icon: icons.grid, label: 'Projects' },
  { key: 'about',    icon: icons.user, label: 'About' },
  { key: 'contact',  icon: icons.mail, label: 'Contact' },
];

interface Props { page: Page; setPage: (p: Page) => void; }

export default function BottomTab({ page, setPage }: Props) {
  return (
    <nav style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, height: 56,
      borderTop: `0.5px solid ${T.border}`, background: T.bg,
      display: 'flex', zIndex: 100,
    }}>
      {tabs.map(t => (
        <button key={t.key} onClick={() => setPage(t.key)} style={{
          flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', gap: 3, background: 'none', border: 'none', cursor: 'pointer',
          color: page === t.key ? T.text : T.muted,
          fontSize: 9, fontFamily: 'var(--font-dm-sans)', letterSpacing: '0.06em', textTransform: 'uppercase',
        }}>
          {t.icon}
          {t.label}
        </button>
      ))}
    </nav>
  );
}
