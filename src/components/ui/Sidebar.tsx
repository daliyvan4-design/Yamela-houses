'use client';
import { useState } from 'react';
import Image from 'next/image';
import { T } from '@/lib/tokens';
import { Page } from '@/lib/types';

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
  home: (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="0.9">
      <path d="M2 9L9 3l7 6"/><path d="M4 8v7h4v-4h2v4h4V8"/>
    </svg>
  ),
};

function NavItem({ icon, active, onClick, label }: { icon: React.ReactNode; active: boolean; onClick: () => void; label: string }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      title={label}
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
        height: 52, background: 'none', border: 'none', cursor: 'pointer',
        color: active ? T.text : hov ? T.text : T.muted,
        position: 'relative', transition: 'color 0.2s',
      }}
    >
      {active && (
        <div style={{
          position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)',
          width: 2, height: 20, background: T.accent,
        }}/>
      )}
      {icon}
    </button>
  );
}

interface Props { page: Page; setPage: (p: Page) => void; }

export default function Sidebar({ page, setPage }: Props) {
  return (
    <nav style={{
      position: 'fixed', left: 0, top: 0, bottom: 0, width: T.sidebar,
      borderRight: `0.5px solid ${T.border}`,
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      background: T.bg, zIndex: 100,
    }}>
      <button
        onClick={() => setPage('hero')}
        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '28px 0 28px' }}
        title="Yamela Homes"
      >
        <Image src="/yamelogo.png" alt="Yamela" width={52} height={36} style={{ objectFit: 'contain' }} priority/>
      </button>

      <div style={{ width: '60%', height: '0.5px', background: T.border }}/>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '100%' }}>
        {[
          { key: 'projects' as const, icon: icons.grid, label: 'Projects' },
          { key: 'about'    as const, icon: icons.user, label: 'About' },
          { key: 'contact'  as const, icon: icons.mail, label: 'Contact' },
        ].map(({ key, icon, label }) => (
          <div key={key} style={{ borderTop: `0.5px solid ${T.border}` }}>
            <NavItem icon={icon} active={page === key} onClick={() => setPage(key)} label={label}/>
          </div>
        ))}
        <div style={{ borderTop: `0.5px solid ${T.border}` }}/>
      </div>

      <div style={{ width: '60%', height: '0.5px', background: T.border, marginBottom: 24 }}/>
    </nav>
  );
}
