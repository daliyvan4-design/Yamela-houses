'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const A = '#C8A97A';
const BG = '#0D0D0D';
const SIDE = '#111111';
const BORDER = 'rgba(200,169,122,0.15)';

const nav = [
  { href: '/admin',          label: 'Dashboard',   icon: '◈' },
  { href: '/admin/projects', label: 'Projets',      icon: '⊞' },
  { href: '/admin/about',    label: 'À propos',     icon: '◉' },
  { href: '/admin/contact',  label: 'Contact',      icon: '◎' },
  { href: '/admin/logo',     label: 'Logos',        icon: '◐' },
];

interface Props { children: React.ReactNode; title: string; }

export default function AdminShell({ children, title }: Props) {
  const path = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div style={{ display: 'flex', height: '100vh', background: BG, color: '#FAFAF8', fontFamily: 'var(--font-dm-sans)' }}>

      {/* Sidebar */}
      <aside style={{
        width: collapsed ? 56 : 220, flexShrink: 0,
        background: SIDE, borderRight: `0.5px solid ${BORDER}`,
        display: 'flex', flexDirection: 'column',
        transition: 'width 0.25s cubic-bezier(0.4,0,0.2,1)',
        overflow: 'hidden',
      }}>
        {/* Logo zone */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'space-between',
          padding: collapsed ? '20px 0' : '20px 20px 20px 24px',
          borderBottom: `0.5px solid ${BORDER}`,
        }}>
          {!collapsed && (
            <span style={{ fontFamily: 'var(--font-cormorant)', fontSize: 16, letterSpacing: '0.12em',
              color: A, fontStyle: 'italic', whiteSpace: 'nowrap' }}>Yamela Admin</span>
          )}
          <button onClick={() => setCollapsed(c => !c)} style={{
            background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(250,250,248,0.3)',
            fontSize: 16, lineHeight: 1, padding: 4, flexShrink: 0,
          }}>
            {collapsed ? '›' : '‹'}
          </button>
        </div>

        {/* Nav links */}
        <nav style={{ flex: 1, padding: '12px 0' }}>
          {nav.map(item => {
            const active = path === item.href;
            return (
              <Link key={item.href} href={item.href} style={{
                display: 'flex', alignItems: 'center',
                gap: 12, padding: collapsed ? '12px 0' : '12px 24px',
                justifyContent: collapsed ? 'center' : 'flex-start',
                textDecoration: 'none',
                background: active ? 'rgba(200,169,122,0.08)' : 'transparent',
                borderLeft: active ? `2px solid ${A}` : '2px solid transparent',
                color: active ? A : 'rgba(250,250,248,0.45)',
                fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase',
                transition: 'all 0.15s',
                whiteSpace: 'nowrap',
              }}>
                <span style={{ fontSize: 14, flexShrink: 0 }}>{item.icon}</span>
                {!collapsed && item.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer actions */}
        <div style={{ padding: collapsed ? '12px 0' : '16px 24px', borderTop: `0.5px solid ${BORDER}`,
          display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Link href="/" style={{
            display: 'flex', alignItems: 'center', gap: 10, justifyContent: collapsed ? 'center' : 'flex-start',
            textDecoration: 'none', color: 'rgba(250,250,248,0.25)',
            fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', whiteSpace: 'nowrap',
          }}>
            <span style={{ fontSize: 12 }}>←</span>
            {!collapsed && 'Voir le site'}
          </Link>
          <button onClick={async () => { await fetch('/api/auth', { method: 'DELETE' }); window.location.href = '/admin/login'; }}
            style={{
              display: 'flex', alignItems: 'center', gap: 10, justifyContent: collapsed ? 'center' : 'flex-start',
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'rgba(250,250,248,0.15)', fontSize: 10,
              letterSpacing: '0.12em', textTransform: 'uppercase', whiteSpace: 'nowrap',
              fontFamily: 'var(--font-dm-sans)',
            }}>
            <span style={{ fontSize: 12 }}>⏻</span>
            {!collapsed && 'Déconnexion'}
          </button>
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
        {/* Top bar */}
        <div style={{
          padding: '20px 40px', borderBottom: `0.5px solid ${BORDER}`,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0,
        }}>
          <h1 style={{ fontFamily: 'var(--font-cormorant)', fontWeight: 300, fontSize: 28,
            letterSpacing: '0.04em', color: '#FAFAF8' }}>{title}</h1>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#4ade80' }} title="En ligne"/>
        </div>

        {/* Content */}
        <div style={{ flex: 1, padding: '36px 40px', overflowY: 'auto' }}>
          {children}
        </div>
      </main>
    </div>
  );
}
