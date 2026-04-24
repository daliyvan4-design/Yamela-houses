'use client';
import { useState, useEffect, useRef } from 'react';
import { T } from '@/lib/tokens';
import { Page } from '@/lib/types';
import BlueprintSVG from '@/components/ui/BlueprintSVG';

interface Props { setPage: (p: Page) => void; }

export default function HeroPage({ setPage }: Props) {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const rafRef = useRef<number>(null);
  const targetRef = useRef({ x: 0, y: 0 });
  const currentRef = useRef({ x: 0, y: 0 });

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
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', background: '#0D0D0D' }}>
      <BlueprintSVG px={px} py={py}/>

      {/* Text — counter-parallax */}
      <div style={{
        position: 'absolute', left: '6%', bottom: '11%',
        display: 'flex', flexDirection: 'column',
        transform: `translate(${px * -10}px, ${py * -8}px)`,
        transition: 'transform 0.1s linear',
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24,
          animation: 'fadeUp 0.8s ease both', animationDelay: '0.8s', opacity: 0,
        }}>
          <div style={{ width: 32, height: '0.5px', background: T.accent }}/>
          <span style={{ fontFamily: 'var(--font-dm-sans)', fontSize: 10, letterSpacing: '0.28em',
            textTransform: 'uppercase', color: T.accent }}>Yamela, the Design Project</span>
        </div>

        <h1 style={{
          fontFamily: 'var(--font-cormorant)', fontWeight: 300,
          fontSize: 'clamp(52px,7vw,96px)', lineHeight: 0.95, letterSpacing: '-0.01em',
          color: '#FAFAF8',
          animation: 'fadeUp 1s cubic-bezier(0.22,1,0.36,1) both', animationDelay: '1s', opacity: 0,
        }}>
          Shaping<br/><em style={{ color: T.accent }}>Space.</em><br/>Defining Life.
        </h1>

        <div style={{
          display: 'flex', flexDirection: 'column', gap: 20, marginTop: 40,
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
              padding: '13px 36px', border: `0.5px solid ${T.accent}`,
              background: 'transparent', color: T.accent,
              fontFamily: 'var(--font-dm-sans)', fontSize: 10, letterSpacing: '0.22em',
              textTransform: 'uppercase', cursor: 'pointer', transition: 'background 0.35s, color 0.35s',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = T.accent; (e.currentTarget as HTMLButtonElement).style.color = '#0D0D0D'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; (e.currentTarget as HTMLButtonElement).style.color = T.accent; }}
          >
            Voir les projets
          </button>
        </div>
      </div>

      {/* Scroll line */}
      <div style={{
        position: 'absolute', bottom: 40, left: 'calc(6% + 2px)',
        animation: 'fadeIn 1s ease both', animationDelay: '1.8s', opacity: 0,
      }}>
        <div style={{ width: 1, height: 52, background: 'rgba(200,169,122,0.2)', overflow: 'hidden' }}>
          <div style={{ width: 1, height: '100%', background: T.accent, animation: 'scrollLine 2s ease-in-out infinite' }}/>
        </div>
      </div>
    </div>
  );
}
