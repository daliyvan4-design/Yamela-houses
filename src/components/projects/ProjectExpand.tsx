'use client';
import { useEffect, useState } from 'react';
import { T } from '@/lib/tokens';
import { ProjectRecord as Project } from '@/lib/store';
import ImgPlaceholder from '@/components/ui/ImgPlaceholder';
import { useIsMobile } from '@/lib/useIsMobile';

interface Props { project: Project; onClose: () => void; }

export default function ProjectExpand({ project, onClose }: Props) {
  const mobile = useIsMobile();
  const photos = [project.image, ...(project.gallery ?? [])].filter(Boolean);
  const [active, setActive] = useState(0);
  const phase = project.phase ?? 'étude';

  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') setActive(a => Math.min(a + 1, photos.length - 1));
      if (e.key === 'ArrowLeft')  setActive(a => Math.max(a - 1, 0));
    };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, [onClose, photos.length]);

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 500,
      background: '#0D0D0D',
      display: 'grid',
      gridTemplateColumns: mobile ? '1fr' : '1fr 400px',
      gridTemplateRows: mobile ? '45vh auto' : '1fr',
      animation: 'fadeIn 0.4s ease both',
      overflowY: mobile ? 'auto' : 'hidden',
    }}>

      {/* Image principale + strip galerie */}
      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Image active */}
        <div style={{ flex: 1, position: 'relative', overflow: 'hidden', minHeight: mobile ? 220 : 0 }}>
          {photos[active]
            // eslint-disable-next-line @next/next/no-img-element
            ? <img src={photos[active]} alt={project.name} loading="eager" decoding="async"
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}/>
            : <ImgPlaceholder label={project.name} style={{ width: '100%', height: '100%' }}/>
          }
          {!mobile && (
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(to right, transparent 70%, #0D0D0D 100%)',
              pointerEvents: 'none',
            }}/>
          )}
          {/* Flèches nav */}
          {photos.length > 1 && (
            <>
              <button onClick={() => setActive(a => Math.max(a - 1, 0))} style={{
                position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)',
                background: 'rgba(13,13,13,0.6)', border: `0.5px solid rgba(200,169,122,0.3)`,
                color: T.accent, width: 36, height: 36, cursor: 'pointer', fontSize: 14,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                opacity: active === 0 ? 0.2 : 1, transition: 'opacity 0.2s',
              }}>‹</button>
              <button onClick={() => setActive(a => Math.min(a + 1, photos.length - 1))} style={{
                position: 'absolute', right: mobile ? 16 : 56, top: '50%', transform: 'translateY(-50%)',
                background: 'rgba(13,13,13,0.6)', border: `0.5px solid rgba(200,169,122,0.3)`,
                color: T.accent, width: 36, height: 36, cursor: 'pointer', fontSize: 14,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                opacity: active === photos.length - 1 ? 0.2 : 1, transition: 'opacity 0.2s',
              }}>›</button>
            </>
          )}
          {/* Compteur */}
          {photos.length > 1 && (
            <div style={{
              position: 'absolute', bottom: 16, left: '50%', transform: 'translateX(-50%)',
              display: 'flex', gap: 6,
            }}>
              {photos.map((_, i) => (
                <button key={i} onClick={() => setActive(i)} style={{
                  width: i === active ? 18 : 6, height: 6,
                  background: i === active ? T.accent : 'rgba(200,169,122,0.3)',
                  border: 'none', cursor: 'pointer', padding: 0,
                  borderRadius: 3, transition: 'all 0.2s',
                }}/>
              ))}
            </div>
          )}
        </div>

        {/* Strip miniatures */}
        {photos.length > 1 && (
          <div style={{
            display: 'flex', gap: 4, padding: '8px 8px',
            background: 'rgba(0,0,0,0.5)', overflowX: 'auto', flexShrink: 0,
          }}>
            {photos.map((url, i) => (
              <button key={i} onClick={() => setActive(i)} style={{
                width: 56, height: 40, flexShrink: 0, padding: 0, border: 'none', cursor: 'pointer',
                outline: i === active ? `1.5px solid ${T.accent}` : '1.5px solid transparent',
                transition: 'outline 0.15s', overflow: 'hidden',
              }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt="" loading="eager" decoding="async" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}/>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Info panel */}
      <div style={{
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        padding: mobile ? '28px 20px 40px' : '60px 40px',
        borderLeft: mobile ? 'none' : `0.5px solid rgba(200,169,122,0.15)`,
        borderTop: mobile ? `0.5px solid rgba(200,169,122,0.15)` : 'none',
        overflowY: 'auto',
      }}>
        <button onClick={onClose} style={{
          position: mobile ? 'fixed' : 'absolute', top: 20, right: 20,
          background: 'rgba(13,13,13,0.8)', border: `0.5px solid rgba(200,169,122,0.2)`,
          cursor: 'pointer', fontFamily: 'var(--font-dm-sans)', fontSize: 10,
          letterSpacing: '0.18em', textTransform: 'uppercase',
          color: 'rgba(250,250,248,0.4)', padding: '6px 12px',
          transition: 'color 0.2s', zIndex: 10,
        }}
          onMouseEnter={e => (e.currentTarget.style.color = T.accent)}
          onMouseLeave={e => (e.currentTarget.style.color = 'rgba(250,250,248,0.4)')}
        >Fermer ×</button>

        <div style={{ width: 28, height: '0.5px', background: T.accent, marginBottom: 24 }}/>

        <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: 9, letterSpacing: '0.22em',
          textTransform: 'uppercase', color: T.accent, marginBottom: 12 }}>
          {project.year} · {project.location}
        </p>

        <h2 style={{ fontFamily: 'var(--font-cormorant)', fontWeight: 300,
          fontSize: 'clamp(26px,3vw,40px)', color: '#FAFAF8',
          letterSpacing: '0.03em', lineHeight: 1.05, marginBottom: 28 }}>
          {project.name}
        </h2>

        <div style={{ height: '0.5px', background: 'rgba(200,169,122,0.2)', marginBottom: 24 }}/>

        {project.description && (
          <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: 13, color: 'rgba(250,250,248,0.5)',
            lineHeight: 1.85, letterSpacing: '0.02em', marginBottom: 28 }}>
            {project.description}
          </p>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 28 }}>
          {[['Phase', phase], ['Année', project.year], ['Localisation', project.location], ['Catégorie', project.category]].map(([k, v]) => (
            <div key={k}>
              <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: 9, letterSpacing: '0.18em',
                textTransform: 'uppercase', color: T.accent, marginBottom: 4 }}>{k}</p>
              <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: 12,
                color: 'rgba(250,250,248,0.55)', letterSpacing: '0.03em' }}>{v}</p>
            </div>
          ))}
        </div>

        <div style={{ height: '0.5px', background: 'rgba(200,169,122,0.15)', marginBottom: 20 }}/>
        <p style={{ fontFamily: 'var(--font-cormorant)', fontStyle: 'italic', fontSize: 15,
          color: 'rgba(200,169,122,0.55)', letterSpacing: '0.04em', lineHeight: 1.5 }}>
          &ldquo;La lumière est le thème principal<br/>de tout projet architectural.&rdquo;
        </p>
      </div>
    </div>
  );
}
