'use client';
import { useEffect, useState, useCallback } from 'react';
import { T } from '@/lib/tokens';
import { ProjectRecord as Project } from '@/lib/store';
import ImgPlaceholder from '@/components/ui/ImgPlaceholder';
import { useIsMobile } from '@/lib/useIsMobile';

interface Props { project: Project; onClose: () => void; }

const PANEL_W = 400;
// Le panneau réapparaît dès que la souris est à moins de ce seuil du bord droit
const TRIGGER_OFFSET = PANEL_W + 120;

export default function ProjectExpand({ project, onClose }: Props) {
  const mobile = useIsMobile();
  const photos = [project.image, ...(project.gallery ?? [])].filter(Boolean);
  const [active, setActive] = useState(0);
  const [panelHidden, setPanelHidden] = useState(false);
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

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const fromRight = window.innerWidth - e.clientX;
    setPanelHidden(fromRight > TRIGGER_OFFSET);
  }, []);

  /* ── MOBILE layout ── */
  if (mobile) return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 500,
      background: '#0D0D0D',
      display: 'grid', gridTemplateRows: '45vh auto',
      animation: 'fadeIn 0.4s ease both',
      overflowY: 'auto',
    }}>
      <MobileImageArea photos={photos} active={active} setActive={setActive} name={project.name}/>
      <InfoPanel project={project} phase={phase} onClose={onClose} mobile/>
    </div>
  );

  /* ── DESKTOP layout ── */
  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setPanelHidden(false)}
      style={{
        position: 'fixed', inset: 0, zIndex: 500,
        background: '#0D0D0D',
        animation: 'fadeIn 0.4s ease both',
      }}
    >
      {/* Image plein écran */}
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column' }}>
        {/* Image active */}
        <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
          {photos[active]
            // eslint-disable-next-line @next/next/no-img-element
            ? <img src={photos[active]} alt={project.name} loading="eager" decoding="async"
                style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}/>
            : <ImgPlaceholder label={project.name} style={{ width: '100%', height: '100%' }}/>
          }

          {/* Dégradé droite — disparaît quand le panneau est masqué */}
          <div style={{
            position: 'absolute', inset: 0,
            background: `linear-gradient(to right, transparent 55%, rgba(13,13,13,0.95) 100%)`,
            opacity: panelHidden ? 0 : 1,
            transition: 'opacity 0.35s ease',
            pointerEvents: 'none',
          }}/>

          {/* Flèches nav */}
          {photos.length > 1 && (
            <>
              <button onClick={() => setActive(a => Math.max(a - 1, 0))} style={{
                position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)',
                background: 'rgba(13,13,13,0.75)', border: `1px solid rgba(200,169,122,0.6)`,
                color: T.accent, width: 40, height: 40, cursor: 'pointer', fontSize: 18,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                opacity: active === 0 ? 0.4 : 1, transition: 'opacity 0.2s',
              }}>‹</button>
              <button onClick={() => setActive(a => Math.min(a + 1, photos.length - 1))} style={{
                position: 'absolute', right: PANEL_W + 16, top: '50%', transform: 'translateY(-50%)',
                background: 'rgba(13,13,13,0.75)', border: `1px solid rgba(200,169,122,0.6)`,
                color: T.accent, width: 40, height: 40, cursor: 'pointer', fontSize: 18,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                opacity: active === photos.length - 1 ? 0.4 : 1, transition: 'opacity 0.2s',
              }}>›</button>
            </>
          )}

          {/* Dots */}
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
            display: 'flex', gap: 4, padding: '8px',
            background: 'rgba(0,0,0,0.5)', overflowX: 'auto', flexShrink: 0,
            marginRight: PANEL_W,
          }}>
            {photos.map((url, i) => (
              <button key={i} onClick={() => setActive(i)} style={{
                width: 56, height: 40, flexShrink: 0, padding: 0, border: 'none', cursor: 'pointer',
                outline: i === active ? `1.5px solid ${T.accent}` : '1.5px solid transparent',
                transition: 'outline 0.15s', overflow: 'hidden',
              }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt="" loading="eager" decoding="async"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}/>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Bouton fermer — toujours visible */}
      <button onClick={onClose} style={{
        position: 'absolute', top: 20, right: 20, zIndex: 20,
        background: 'rgba(13,13,13,0.85)', border: `0.5px solid rgba(200,169,122,0.3)`,
        cursor: 'pointer', fontFamily: 'var(--font-dm-sans)', fontSize: 10,
        letterSpacing: '0.18em', textTransform: 'uppercase',
        color: 'rgba(250,250,248,0.5)', padding: '7px 14px',
        transition: 'color 0.2s',
      }}
        onMouseEnter={e => (e.currentTarget.style.color = T.accent)}
        onMouseLeave={e => (e.currentTarget.style.color = 'rgba(250,250,248,0.5)')}
      >Fermer ×</button>

      {/* Panneau info — flottant droite, transparent quand souris loin */}
      <div style={{
        position: 'absolute', top: 0, right: 0, bottom: 0, width: PANEL_W,
        background: 'rgba(13,13,13,0.96)',
        borderLeft: `0.5px solid rgba(200,169,122,0.15)`,
        opacity: panelHidden ? 0 : 1,
        pointerEvents: panelHidden ? 'none' : 'auto',
        transition: 'opacity 0.35s ease',
      }}>
        <InfoPanel project={project} phase={phase} onClose={onClose} mobile={false} hideClose/>
      </div>
    </div>
  );
}

/* ─── Sous-composants ─────────────────────────────────────────────── */

function MobileImageArea({ photos, active, setActive, name }: {
  photos: string[]; active: number; setActive: (fn: (a: number) => number) => void; name: string;
}) {
  return (
    <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden', minHeight: 220 }}>
        {photos[active]
          // eslint-disable-next-line @next/next/no-img-element
          ? <img src={photos[active]} alt={name} loading="eager" decoding="async"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}/>
          : <ImgPlaceholder label={name} style={{ width: '100%', height: '100%' }}/>
        }
        {photos.length > 1 && (
          <>
            <button onClick={() => setActive(a => Math.max(a - 1, 0))} style={{
              position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)',
              background: 'rgba(13,13,13,0.75)', border: `1px solid rgba(200,169,122,0.6)`,
              color: T.accent, width: 40, height: 40, cursor: 'pointer', fontSize: 18,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              opacity: active === 0 ? 0.4 : 1, transition: 'opacity 0.2s',
            }}>‹</button>
            <button onClick={() => setActive(a => Math.min(a + 1, photos.length - 1))} style={{
              position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)',
              background: 'rgba(13,13,13,0.75)', border: `1px solid rgba(200,169,122,0.6)`,
              color: T.accent, width: 40, height: 40, cursor: 'pointer', fontSize: 18,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              opacity: active === photos.length - 1 ? 0.4 : 1, transition: 'opacity 0.2s',
            }}>›</button>
          </>
        )}
        {photos.length > 1 && (
          <div style={{ position: 'absolute', bottom: 16, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 6 }}>
            {photos.map((_, i) => (
              <button key={i} onClick={() => setActive(() => i)} style={{
                width: i === active ? 18 : 6, height: 6,
                background: i === active ? T.accent : 'rgba(200,169,122,0.3)',
                border: 'none', cursor: 'pointer', padding: 0,
                borderRadius: 3, transition: 'all 0.2s',
              }}/>
            ))}
          </div>
        )}
      </div>
      {photos.length > 1 && (
        <div style={{ display: 'flex', gap: 4, padding: '8px', background: 'rgba(0,0,0,0.5)', overflowX: 'auto', flexShrink: 0 }}>
          {photos.map((url, i) => (
            <button key={i} onClick={() => setActive(() => i)} style={{
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
  );
}

function InfoPanel({ project, phase, onClose, mobile, hideClose }: {
  project: Project; phase: string; onClose: () => void; mobile: boolean; hideClose?: boolean;
}) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', justifyContent: 'center',
      padding: mobile ? '28px 20px 40px' : '60px 40px',
      height: '100%', overflowY: 'auto', boxSizing: 'border-box',
      borderTop: mobile ? `0.5px solid rgba(200,169,122,0.15)` : 'none',
    }}>
      {/* Bouton fermer — mobile uniquement (desktop géré en dehors du panneau) */}
      {!hideClose && (
        <button onClick={onClose} style={{
          position: 'fixed', top: 20, right: 20,
          background: 'rgba(13,13,13,0.85)', border: `0.5px solid rgba(200,169,122,0.3)`,
          cursor: 'pointer', fontFamily: 'var(--font-dm-sans)', fontSize: 10,
          letterSpacing: '0.18em', textTransform: 'uppercase',
          color: 'rgba(250,250,248,0.5)', padding: '7px 14px',
          transition: 'color 0.2s', zIndex: 10,
        }}
          onMouseEnter={e => (e.currentTarget.style.color = T.accent)}
          onMouseLeave={e => (e.currentTarget.style.color = 'rgba(250,250,248,0.5)')}
        >Fermer ×</button>
      )}

      <div style={{ width: 28, height: '0.5px', background: T.accent, marginBottom: 24 }}/>

      {project.category !== 'mobilier' && (
        <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: 9, letterSpacing: '0.22em',
          textTransform: 'uppercase', color: T.accent, marginBottom: 12 }}>
          {project.year} · {project.location}
        </p>
      )}

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
        {(project.category === 'mobilier'
          ? [['Catégorie', 'Mobilier']]
          : [['Phase', phase], ['Année', project.year], ['Localisation', project.location], ['Catégorie', project.category]]
        ).map(([k, v]) => (
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
  );
}
