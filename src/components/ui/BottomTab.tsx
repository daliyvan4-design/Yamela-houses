'use client';
import { useState, useEffect } from 'react';
import { T } from '@/lib/tokens';
import { Page } from '@/lib/types';
import { getCachedLogoUrl } from '@/lib/apiCache';

const icons = {
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

const tabs: { key: Page; label: string }[] = [
  { key: 'projects', label: 'Projets' },
  { key: 'about',    label: 'À propos' },
  { key: 'contact',  label: 'Contact' },
];

interface Props { page: Page; setPage: (p: Page) => void; }

export default function BottomTab({ page, setPage }: Props) {
  const [logoSrc, setLogoSrc] = useState<string>('/yamelogo.png');

  useEffect(() => {
    const cached = getCachedLogoUrl();
    if (cached) { setLogoSrc(cached); return; }
    fetch('/api/logo').then(r => r.json()).then(d => { if (d.active_url) setLogoSrc(d.active_url); });
  }, []);

  return (
    <nav style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, height: 60,
      borderTop: `0.5px solid ${T.border}`, background: T.bg,
      display: 'flex', alignItems: 'stretch', zIndex: 100,
    }}>
      {/* Logo — bouton home */}
      <button onClick={() => setPage('hero')} style={{
        width: 88, flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'none', border: 'none', borderRight: `0.5px solid ${T.border}`,
        cursor: 'pointer', padding: 0,
        opacity: page === 'hero' ? 1 : 0.55,
        transition: 'opacity 0.2s',
      }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logoSrc} alt="Yamela" style={{ objectFit: 'contain', width: '60px', height: '60px', display: 'block' }}/>
      </button>

      {/* Autres onglets */}
      {tabs.map(t => (
        <button key={t.key} onClick={() => setPage(t.key)} style={{
          flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', gap: 4, background: 'none', border: 'none', cursor: 'pointer',
          color: page === t.key ? T.text : T.muted,
          fontSize: 9, fontFamily: 'var(--font-dm-sans)', letterSpacing: '0.08em', textTransform: 'uppercase',
          borderLeft: `0.5px solid ${T.border}`,
          borderBottom: page === t.key ? `1.5px solid ${T.accent}` : '1.5px solid transparent',
          transition: 'color 0.2s',
        }}>
          {t.key === 'projects' ? icons.grid : t.key === 'about' ? icons.user : icons.mail}
          {t.label}
        </button>
      ))}
    </nav>
  );
}
