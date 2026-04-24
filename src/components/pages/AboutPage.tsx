'use client';
import { useState, useEffect } from 'react';
import { T } from '@/lib/tokens';
import { AboutRecord } from '@/lib/store';
import { useIsMobile } from '@/lib/useIsMobile';
import ImgPlaceholder from '@/components/ui/ImgPlaceholder';

const DEFAULT: AboutRecord = {
  image: '', heading_dark: "L'architecture comme", heading_accent: 'acte de précision',
  stats: [{ value: '—', label: 'Ans' }],
  paragraphs: [''], services: [],
};

export default function AboutPage() {
  const [data, setData] = useState<AboutRecord>(DEFAULT);
  const [projectCount, setProjectCount] = useState<number>(0);
  const mobile = useIsMobile();

  useEffect(() => {
    fetch('/api/about').then(r => r.json()).then(setData);
    fetch('/api/projects').then(r => r.json()).then((p: unknown[]) => setProjectCount(p.length));
  }, []);

  const stats = [
    { value: data.stats[0]?.value ?? '—', label: data.stats[0]?.label ?? 'Ans' },
    { value: String(projectCount), label: 'Projets' },
  ];

  return (
    <div className="page-enter" style={{
      height: '100%',
      display: mobile ? 'block' : 'grid',
      gridTemplateColumns: '1fr 1fr',
      overflowY: mobile ? 'auto' : 'hidden',
    }}>

      {/* LEFT — image + stats */}
      <div style={{
        background: '#0D0D0D', position: 'relative', overflow: 'hidden',
        display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
        padding: mobile ? '28px 24px' : '52px 48px',
        minHeight: mobile ? 260 : undefined,
      }}>
        <div style={{
          position: 'absolute', top: '-4%', left: '-5%',
          fontFamily: 'var(--font-cormorant)', fontWeight: 300, fontSize: '38vw',
          lineHeight: 1, color: 'transparent',
          WebkitTextStroke: `1px rgba(200,169,122,0.06)`,
          userSelect: 'none', pointerEvents: 'none',
        }}>A</div>

        <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
          viewBox="0 0 600 900" preserveAspectRatio="xMidYMid slice">
          <line x1="0" y1="0" x2="600" y2="900" stroke={T.accent} strokeWidth="0.4" opacity="0.18"/>
          <rect x="48" y="200" width="8" height="8" fill="none" stroke={T.accent} strokeWidth="0.8" opacity="0.5"/>
        </svg>

        {!mobile && (
          <div style={{ position: 'relative', zIndex: 1, height: '52%', marginBottom: 32 }}>
            {data.image
              // eslint-disable-next-line @next/next/no-img-element
              ? <img src={data.image} alt="Portrait" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}/>
              : <ImgPlaceholder label="architecte / portrait" style={{ width: '100%', height: '100%' }}/>
            }
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(13,13,13,0.25)' }}/>
          </div>
        )}

        <div style={{ position: 'relative', zIndex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
          {stats.map((s, i) => (
            <div key={i} style={{
              paddingRight: 24,
              borderRight: i === 0 ? `0.5px solid rgba(200,169,122,0.2)` : 'none',
              paddingLeft: i > 0 ? 24 : 0,
            }}>
              <p style={{ fontFamily: 'var(--font-cormorant)', fontWeight: 300, fontSize: mobile ? 32 : 40, color: '#FAFAF8', lineHeight: 1 }}>{s.value}</p>
              <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase',
                color: T.accent, marginTop: 6 }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT — texte */}
      <div style={{
        display: 'flex', flexDirection: 'column', justifyContent: mobile ? 'flex-start' : 'center',
        padding: mobile ? '32px 24px 100px' : '60px 56px 60px 52px',
        background: T.bg,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 28 }}>
          <div style={{ width: 28, height: '0.5px', background: T.accent }}/>
          <div style={{ width: 28, height: '0.5px', background: T.text }}/>
        </div>

        <h2 style={{
          fontFamily: 'var(--font-cormorant)', fontWeight: 300,
          fontSize: mobile ? 'clamp(28px,7vw,40px)' : 'clamp(30px,3.2vw,48px)',
          letterSpacing: '0.02em', lineHeight: 1.1, marginBottom: 32,
        }}>
          {data.heading_dark}<br/><em style={{ color: T.accent }}>{data.heading_accent}</em>
        </h2>

        <div style={{ width: '100%', height: '0.5px', background: T.border, marginBottom: 32 }}/>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20,
          fontFamily: 'var(--font-dm-sans)', fontSize: 13, lineHeight: 1.85, color: '#555550', fontWeight: 300 }}>
          {data.paragraphs.map((p, i) => <p key={i}>{p}</p>)}
        </div>

        {data.services.length > 0 && (
          <div style={{ marginTop: 40, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {data.services.map(s => (
              <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 16, height: '0.5px', background: T.accent, flexShrink: 0 }}/>
                <span style={{ fontFamily: 'var(--font-dm-sans)', fontSize: 11, color: T.muted, letterSpacing: '0.04em' }}>{s}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
