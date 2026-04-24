'use client';
import { useEffect } from 'react';
import { T } from '@/lib/tokens';
import { ProjectRecord as Project } from '@/lib/store';
import ImgPlaceholder from '@/components/ui/ImgPlaceholder';

interface Props { project: Project; onClose: () => void; }

export default function ProjectExpand({ project, onClose }: Props) {
  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, [onClose]);

  const [type, surface] = project.tags.split('·').map(s => s.trim());

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 500,
      background: '#0D0D0D',
      display: 'grid', gridTemplateColumns: '1fr 420px',
      animation: 'fadeIn 0.4s ease both',
    }}>
      {/* Full image */}
      <div style={{ position: 'relative', overflow: 'hidden' }}>
        {project.image
          // eslint-disable-next-line @next/next/no-img-element
          ? <img src={project.image} alt={project.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
          : <ImgPlaceholder label={`${project.name} — photographie du projet`} style={{ width: '100%', height: '100%' }}/>
        }
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to right, transparent 70%, #0D0D0D 100%)',
        }}/>
      </div>

      {/* Info panel */}
      <div style={{
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        padding: '60px 48px', borderLeft: `0.5px solid rgba(200,169,122,0.15)`,
        overflowY: 'auto',
      }}>
        <button onClick={onClose} style={{
          position: 'absolute', top: 28, right: 32,
          background: 'none', border: 'none', cursor: 'pointer',
          fontFamily: 'var(--font-dm-sans)', fontSize: 10, letterSpacing: '0.18em',
          textTransform: 'uppercase', color: 'rgba(250,250,248,0.4)',
          transition: 'color 0.2s',
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
          fontSize: 'clamp(28px,3vw,44px)', color: '#FAFAF8',
          letterSpacing: '0.03em', lineHeight: 1.05, marginBottom: 32 }}>
          {project.name}
        </h2>

        <div style={{ height: '0.5px', background: 'rgba(200,169,122,0.2)', marginBottom: 32 }}/>

        <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: 13, color: 'rgba(250,250,248,0.5)',
          lineHeight: 1.85, letterSpacing: '0.02em', marginBottom: 28 }}>
          Une réponse attentive au site, à la lumière et aux matériaux. Ce projet explore
          le seuil entre intérieur et paysage — la géométrie au service du mouvement
          et de la vie quotidienne. Chaque espace est conçu pour révéler la qualité
          de la lumière naturelle à différents moments de la journée.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 32 }}>
          {[['Surface', surface], ['Type', type], ['Année', project.year], ['Localisation', project.location]].map(([k, v]) => (
            <div key={k}>
              <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: 9, letterSpacing: '0.18em',
                textTransform: 'uppercase', color: T.accent, marginBottom: 4 }}>{k}</p>
              <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: 12,
                color: 'rgba(250,250,248,0.55)', letterSpacing: '0.03em' }}>{v}</p>
            </div>
          ))}
        </div>

        <div style={{ height: '0.5px', background: 'rgba(200,169,122,0.15)', marginBottom: 24 }}/>
        <p style={{ fontFamily: 'var(--font-cormorant)', fontStyle: 'italic', fontSize: 16,
          color: 'rgba(200,169,122,0.6)', letterSpacing: '0.04em', lineHeight: 1.5 }}>
          &ldquo;La lumière est le thème principal<br/>de tout projet architectural.&rdquo;
        </p>
      </div>
    </div>
  );
}
