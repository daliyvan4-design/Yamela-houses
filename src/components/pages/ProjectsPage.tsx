'use client';
import { useState, useEffect, useRef } from 'react';
import { T } from '@/lib/tokens';
import { catLabels, Category } from '@/lib/data';
import { ProjectRecord } from '@/lib/store';
import { getCachedProjects } from '@/lib/apiCache';
import { useIsMobile } from '@/lib/useIsMobile';
import ProjectCard from '@/components/projects/ProjectCard';
import ProjectExpand from '@/components/projects/ProjectExpand';

export default function ProjectsPage() {
  const [cat, setCat] = useState<Category>('residentiel');
  const [expanded, setExpanded] = useState<ProjectRecord | null>(null);
  const [all, setAll] = useState<ProjectRecord[]>(() => getCachedProjects() ?? []);
  const mobile = useIsMobile();
  const scrollRef = useRef<HTMLDivElement>(null);
  const savedScroll = useRef(0);

  useEffect(() => {
    if (all.length === 0) fetch('/api/projects').then(r => r.json()).then(setAll);
  }, [all.length]);

  const projects = all.filter(p => p.category === cat);

  const handleExpand = (p: ProjectRecord) => {
    savedScroll.current = scrollRef.current?.scrollTop ?? 0;
    setExpanded(p);
  };

  const handleClose = () => {
    setExpanded(null);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (scrollRef.current) scrollRef.current.scrollTop = savedScroll.current;
      });
    });
  };

  return (
    <div ref={scrollRef} className="page-enter" style={{
      padding: mobile ? '28px 16px 80px' : '44px 40px 40px',
      overflowY: 'auto', height: '100%',
    }}>
      <div style={{
        marginBottom: mobile ? 20 : 36,
        display: 'flex', alignItems: mobile ? 'flex-start' : 'flex-end',
        flexDirection: mobile ? 'column' : 'row',
        justifyContent: 'space-between', gap: mobile ? 16 : 20,
      }}>
        <div>
          <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: 10, letterSpacing: '0.2em',
            textTransform: 'uppercase', color: T.accent, marginBottom: 8 }}>Portfolio</p>
          <h2 style={{ fontFamily: 'var(--font-cormorant)', fontWeight: 500,
            fontSize: mobile ? 30 : 40, letterSpacing: '0.04em' }}>
            Nos Projets
          </h2>
        </div>

        {/* Filtres — scrollables sur mobile */}
        <div style={{
          display: 'flex', gap: 0,
          borderBottom: `0.5px solid ${T.border}`,
          overflowX: 'auto', width: mobile ? '100%' : 'auto',
        }}>
          {(Object.entries(catLabels) as [Category, string][]).map(([key, label]) => (
            <button key={key} onClick={() => setCat(key)} style={{
              padding: mobile ? '7px 14px' : '8px 24px',
              background: 'none', border: 'none', cursor: 'pointer',
              fontFamily: 'var(--font-dm-sans)', fontSize: mobile ? 10 : 11,
              letterSpacing: '0.12em', textTransform: 'uppercase', whiteSpace: 'nowrap',
              color: cat === key ? T.text : T.muted,
              borderBottom: cat === key ? `1.5px solid ${T.accent}` : '1.5px solid transparent',
              transition: 'color 0.2s, border-color 0.2s', marginBottom: '-0.5px',
            }}>{label}</button>
          ))}
        </div>
      </div>

      <div key={cat} style={{
        display: 'grid',
        gridTemplateColumns: mobile ? '1fr' : 'repeat(3, 1fr)',
        gap: mobile ? 12 : 2,
      }}>
        {projects.map((p, i) => (
          <ProjectCard key={p.id} project={p} index={i} onExpand={() => handleExpand(p)}/>
        ))}
      </div>

      {expanded && <ProjectExpand project={expanded} onClose={handleClose}/>}
    </div>
  );
}
