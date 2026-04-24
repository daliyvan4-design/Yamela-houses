'use client';
import { useState } from 'react';
import { T } from '@/lib/tokens';
import { ProjectRecord } from '@/lib/store';
import ImgPlaceholder from '@/components/ui/ImgPlaceholder';

interface Props { project: ProjectRecord; index: number; onExpand: () => void; }

export default function ProjectCard({ project, index, onExpand }: Props) {
  const [hov, setHov] = useState(false);

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={onExpand}
      style={{
        cursor: 'pointer', overflow: 'hidden', position: 'relative',
        minHeight: 260,
        animation: 'stagger 0.6s cubic-bezier(0.22,1,0.36,1) both',
        animationDelay: `${index * 0.08}s`,
      }}
    >
      {project.image
        // eslint-disable-next-line @next/next/no-img-element
        ? <img src={project.image} alt={project.name} style={{
            width: '100%', height: '100%', objectFit: 'cover', display: 'block',
            transform: hov ? 'scale(1.05)' : 'scale(1)',
            transition: 'transform 1s cubic-bezier(0.22,1,0.36,1)',
          }}/>
        : <ImgPlaceholder label={project.name} style={{
            width: '100%', height: '100%',
            transform: hov ? 'scale(1.05)' : 'scale(1)',
            transition: 'transform 1s cubic-bezier(0.22,1,0.36,1)',
          }}/>
      }

      {/* Bottom gradient */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '35%',
        background: 'linear-gradient(to top, rgba(13,13,13,0.65) 0%, transparent 100%)',
        pointerEvents: 'none',
      }}/>

      {/* Year badge */}
      <div style={{
        position: 'absolute', top: 14, right: 14, zIndex: 2,
        opacity: hov ? 0 : 1, transition: 'opacity 0.3s',
      }}>
        <div style={{ width: 20, height: '0.5px', background: T.accent, marginBottom: 3 }}/>
        <span style={{ fontFamily: 'var(--font-dm-sans)', fontSize: 9,
          color: 'rgba(250,250,248,0.5)', letterSpacing: '0.1em' }}>{project.year}</span>
      </div>

      {/* Name */}
      <div style={{
        position: 'absolute', bottom: 18, left: 18, zIndex: 2,
        opacity: hov ? 0 : 1, transition: 'opacity 0.25s',
      }}>
        <p style={{ fontFamily: 'var(--font-cormorant)', fontSize: 17, fontWeight: 300,
          color: '#FAFAF8', letterSpacing: '0.04em' }}>{project.name}</p>
      </div>

      {/* Hover panel */}
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 3,
        background: 'rgba(13,13,13,0.9)',
        backdropFilter: 'blur(2px)',
        padding: '22px 22px 20px',
        transform: hov ? 'translateY(0)' : 'translateY(100%)',
        transition: 'transform 0.55s cubic-bezier(0.22,1,0.36,1)',
        borderTop: `0.5px solid rgba(200,169,122,0.25)`,
      }}>
        <div style={{ width: 24, height: '0.5px', background: T.accent, marginBottom: 12 }}/>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: 9, letterSpacing: '0.2em',
              textTransform: 'uppercase', color: T.accent, marginBottom: 5 }}>
              {project.year} · {project.location}
            </p>
            <h3 style={{ fontFamily: 'var(--font-cormorant)', fontWeight: 300,
              fontSize: 'clamp(18px,2vw,24px)', color: '#FAFAF8', letterSpacing: '0.03em', lineHeight: 1.1 }}>
              {project.name}
            </h3>
          </div>
          <span style={{ fontFamily: 'var(--font-dm-sans)', fontSize: 10, color: T.accent, marginTop: 2 }}>→</span>
        </div>
        <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: 11, color: 'rgba(250,250,248,0.42)',
          lineHeight: 1.7, marginTop: 10, letterSpacing: '0.02em' }}>
          Réponse attentive au site, à la lumière et aux matériaux.
        </p>
        <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: 8, letterSpacing: '0.14em',
          textTransform: 'uppercase', color: 'rgba(250,250,248,0.2)', marginTop: 10 }}>
          {project.tags} · Cliquer pour agrandir
        </p>
      </div>
    </div>
  );
}
