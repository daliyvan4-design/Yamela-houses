'use client';
import { useState, useEffect } from 'react';
import { T } from '@/lib/tokens';
import { catLabels, Category } from '@/lib/data';
import { ProjectRecord } from '@/lib/store';
import ProjectCard from '@/components/projects/ProjectCard';
import ProjectExpand from '@/components/projects/ProjectExpand';

export default function ProjectsPage() {
  const [cat, setCat] = useState<Category>('residentiel');
  const [expanded, setExpanded] = useState<ProjectRecord | null>(null);
  const [all, setAll] = useState<ProjectRecord[]>([]);

  useEffect(() => {
    fetch('/api/projects').then(r => r.json()).then(setAll);
  }, []);

  const projects = all.filter(p => p.category === cat);

  return (
    <div className="page-enter" style={{ padding: '44px 40px 40px', overflowY: 'auto', height: '100%' }}>
      <div style={{ marginBottom: 36, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20 }}>
        <div>
          <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: 10, letterSpacing: '0.2em',
            textTransform: 'uppercase', color: T.accent, marginBottom: 10 }}>Portfolio</p>
          <h2 style={{ fontFamily: 'var(--font-cormorant)', fontWeight: 300, fontSize: 40, letterSpacing: '0.04em' }}>
            Nos Projets
          </h2>
        </div>

        <div style={{ display: 'flex', gap: 0, borderBottom: `0.5px solid ${T.border}` }}>
          {(Object.entries(catLabels) as [Category, string][]).map(([key, label]) => (
            <button key={key} onClick={() => setCat(key)} style={{
              padding: '8px 24px', background: 'none', border: 'none', cursor: 'pointer',
              fontFamily: 'var(--font-dm-sans)', fontSize: 11, letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: cat === key ? T.text : T.muted,
              borderBottom: cat === key ? `1.5px solid ${T.accent}` : '1.5px solid transparent',
              transition: 'color 0.2s, border-color 0.2s', marginBottom: '-0.5px',
            }}>{label}</button>
          ))}
        </div>
      </div>

      <div key={cat} style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2 }}>
        {projects.map((p, i) => (
          <ProjectCard key={p.id} project={p} index={i} onExpand={() => setExpanded(p)}/>
        ))}
      </div>

      {expanded && <ProjectExpand project={expanded} onClose={() => setExpanded(null)}/>}
    </div>
  );
}
