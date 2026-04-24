'use client';
import { useState, useEffect, useRef } from 'react';
import { T } from '@/lib/tokens';
import { Page } from '@/lib/types';
import { useIsMobile } from '@/lib/useIsMobile';
import BlueprintSVG from '@/components/ui/BlueprintSVG';

interface Props { setPage: (p: Page) => void; }

export default function HeroPage({ setPage }: Props) {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const rafRef = useRef<number>(null);
  const targetRef = useRef({ x: 0, y: 0 });
  const currentRef = useRef({ x: 0, y: 0 });
  const mobile = useIsMobile();

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      targetRef.current = {
        x: e.clientX / window.innerWidth  - 0.5,
        y: e.clientY / window.innerHeight - 0.5,
      };
    };
    window.addEventListener('mousemove', onMove);
    const tick = () => {
      const t = currentRef.current, g = targetRef.current;
      currentRef.current = { x: t.x + (g.x - t.x) * 0.06, y: t.y + (g.y - t.y) * 0.06 };
      setMouse({ ...currentRef.current });
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener('mousemove', onMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const px = mouse.x, py = mouse.y;

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', background: '#0D0D0D', overflow: 'clip' }}>
      <BlueprintSVG px={px} py={py}/>

      {/* Text */}
      <div style={{
        position: 'absolute',
        left: '6%',
        bottom: mobile ? 116 : '11%',
        maxWidth: mobile ? '82%' : '60%',
        display: 'flex', flexDirection: 'column',
        transform: mobile ? 'none' : `translate(${px * -10}px, ${py * -8}px)`,
        transition: 'transform 0.1s linear',
        zIndex: 2,
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', marginBottom: mobile ? 16 : 24,
          animation: 'fadeUp 0.8s ease both', animationDelay: '0.8s', opacity: 0,
        }}>
          <div style={{ width: 32, height: '0.5px', background: T.accent }}/>
        </div>

        <h1 style={{
          fontFamily: 'var(--font-cormorant)', fontWeight: 300,
          fontSize: mobile ? 'clamp(38px,11vw,64px)' : 'clamp(52px,7vw,96px)',
          lineHeight: 0.95, letterSpacing: '-0.01em', color: '#FAFAF8',
          animation: 'fadeUp 1s cubic-bezier(0.22,1,0.36,1) both', animationDelay: '1s', opacity: 0,
        }}>
          Yamela,<br/><em style={{ color: T.accent }}>the Design</em><br/>Project.
        </h1>

        <div style={{
          display: 'flex', flexDirection: 'column', gap: mobile ? 14 : 20, marginTop: mobile ? 24 : 40,
          animation: 'fadeUp 0.8s ease both', animationDelay: '1.3s', opacity: 0,
        }}>
          <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: 12, color: 'rgba(250,250,248,0.38)',
            letterSpacing: '0.06em', lineHeight: 1.7 }}>
            Architecture | Specific Interior design
          </p>
          <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: 11, color: 'rgba(250,250,248,0.28)',
            letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            We designed:
          </p>
          <button
            onClick={() => setPage('projects')}
            style={{
              alignSelf: 'flex-start',
              padding: mobile ? '11px 28px' : '13px 36px',
              border: `1px solid ${T.accent}`,
              background: 'transparent', color: T.accent,
              fontFamily: 'var(--font-dm-sans)', fontSize: 10, letterSpacing: '0.22em',
              textTransform: 'uppercase', cursor: 'pointer', transition: 'background 0.35s, color 0.35s',
              whiteSpace: 'nowrap',
              WebkitAppearance: 'none', appearance: 'none', borderRadius: 0,
              outline: 'none',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = T.accent; (e.currentTarget as HTMLButtonElement).style.color = '#0D0D0D'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; (e.currentTarget as HTMLButtonElement).style.color = T.accent; }}
          >
            Voir les projets
          </button>
        </div>
      </div>
    </div>
  );
}
