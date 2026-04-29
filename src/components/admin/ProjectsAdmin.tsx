'use client';
import { useState, useRef } from 'react';
import { ProjectRecord, Phase } from '@/lib/store';
import { Field, TextareaField, SelectField } from './Field';
import ImageUpload from './ImageUpload';

const A = '#C8A97A';
const BORDER = 'rgba(200,169,122,0.15)';
const CAT_OPTIONS = [
  { value: 'residentiel', label: 'Résidentiel' },
  { value: 'bureaux',     label: 'Bureaux' },
  { value: 'commercial',  label: 'Commercial' },
  { value: 'interieur',   label: 'Intérieur' },
  { value: 'mobilier',    label: 'Mobilier' },
];

const PHASE_OPTIONS = [
  { value: 'étude',        label: 'Étude' },
  { value: 'construction', label: 'Construction' },
  { value: 'terminé',      label: 'Terminé' },
];

const EMPTY: Omit<ProjectRecord, 'id'> = {
  name: '', location: '', year: '',
  category: 'residentiel', phase: 'étude', description: '', image: '', gallery: [], featured: false,
};

type FormData = Omit<ProjectRecord, 'id'>;
type Filter = 'all' | ProjectRecord['category'];

interface Props { initial: ProjectRecord[]; }

export default function ProjectsAdmin({ initial }: Props) {
  const [projects, setProjects] = useState<ProjectRecord[]>(initial);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<FormData>(EMPTY);
  const [filter, setFilter] = useState<Filter>('all');
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const dragIdx = useRef<number | null>(null);

  const flash = (m: string) => { setMsg(m); setTimeout(() => setMsg(''), 2500); };
  const visible = filter === 'all' ? projects : projects.filter(p => p.category === filter);

  const openCreate = () => { setEditingId(null); setForm(EMPTY); setShowForm(true); };
  const openEdit = (p: ProjectRecord) => {
    setEditingId(p.id);
    setForm({ name: p.name, location: p.location, year: p.year,
      category: p.category, phase: p.phase ?? 'étude', description: p.description,
      image: p.image, gallery: p.gallery ?? [], featured: p.featured ?? false });
    setShowForm(true);
  };

  const toggleFeatured = async (p: ProjectRecord) => {
    const updated = await fetch(`/api/projects/${p.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ featured: !p.featured }),
    }).then(r => r.json());
    setProjects(prev => prev.map(x => x.id === updated.id ? updated : x));
    flash(updated.featured ? '★ Projet mis en avant.' : 'Projet retiré de la mise en avant.');
  };

  const moveGallery = (from: number, to: number) =>
    setForm(f => {
      const g = [...(f.gallery ?? [])];
      const [item] = g.splice(from, 1);
      g.splice(to, 0, item);
      return { ...f, gallery: g };
    });
  const closeForm = () => { setShowForm(false); setEditingId(null); };

  const patch = <K extends keyof FormData>(k: K, v: FormData[K]) => setForm(f => ({ ...f, [k]: v }));

  const addGallerySlot = () => setForm(f => ({ ...f, gallery: [...(f.gallery ?? []), ''] }));
  const setGalleryUrl = (i: number, url: string) =>
    setForm(f => { const g = [...(f.gallery ?? [])]; g[i] = url; return { ...f, gallery: g }; });
  const removeGallerySlot = (i: number) =>
    setForm(f => ({ ...f, gallery: (f.gallery ?? []).filter((_, j) => j !== i) }));

  const handleSave = async () => {
    setSaving(true);
    const body = { ...form, gallery: (form.gallery ?? []).filter(Boolean) };
    if (editingId !== null) {
      const res = await fetch(`/api/projects/${editingId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      const updated: ProjectRecord = await res.json();
      setProjects(p => p.map(x => x.id === updated.id ? updated : x));
      flash('Modifications enregistrées.');
    } else {
      const res = await fetch('/api/projects', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      const created: ProjectRecord = await res.json();
      setProjects(p => [...p, created]);
      flash('Projet créé.');
    }
    closeForm();
    setSaving(false);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Supprimer ce projet ?')) return;
    await fetch(`/api/projects/${id}`, { method: 'DELETE' });
    setProjects(p => p.filter(x => x.id !== id));
    flash('Projet supprimé.');
  };

  const FILTERS: Filter[] = ['all', 'residentiel', 'bureaux', 'commercial', 'interieur', 'mobilier'];

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28, gap: 16, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: 0, borderBottom: `0.5px solid ${BORDER}` }}>
          {FILTERS.map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding: '7px 16px', background: 'none', border: 'none', cursor: 'pointer',
              color: filter === f ? A : 'rgba(250,250,248,0.35)',
              fontFamily: 'var(--font-dm-sans)', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase',
              borderBottom: filter === f ? `1.5px solid ${A}` : '1.5px solid transparent',
              marginBottom: '-0.5px', transition: 'color 0.2s',
            }}>
              {f === 'all' ? 'Tous' : CAT_OPTIONS.find(o => o.value === f)?.label ?? f}
            </button>
          ))}
        </div>
        <BtnPrimary onClick={openCreate}>+ Nouveau projet</BtnPrimary>
      </div>

      {msg && <div style={{ padding: '10px 16px', background: 'rgba(200,169,122,0.12)', border: `0.5px solid ${A}`,
        fontSize: 11, color: A, letterSpacing: '0.08em', marginBottom: 20 }}>{msg}</div>}

      {/* Form panel */}
      {showForm && (
        <div style={{ border: `0.5px solid ${BORDER}`, padding: 32, marginBottom: 28, background: 'rgba(255,255,255,0.02)' }}>
          <p style={{ fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase',
            color: A, marginBottom: 24 }}>{editingId !== null ? 'Modifier le projet' : 'Nouveau projet'}</p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
            <Field label="Nom du projet" value={form.name} onChange={e => patch('name', e.target.value)} placeholder="Table Azur"/>
            <SelectField label="Catégorie" value={form.category} options={CAT_OPTIONS}
              onChange={e => patch('category', e.target.value as ProjectRecord['category'])}/>
            {form.category !== 'mobilier' && (
              <Field label="Localisation" value={form.location} onChange={e => patch('location', e.target.value)} placeholder="Marrakech, MA"/>
            )}
            {form.category !== 'mobilier' && (
              <Field label="Année" value={form.year} onChange={e => patch('year', e.target.value)} placeholder="2024"/>
            )}
            {form.category !== 'mobilier' && (
              <SelectField label="Phase" value={form.phase} options={PHASE_OPTIONS}
                onChange={e => patch('phase', e.target.value as Phase)}/>
            )}
          </div>

          <div style={{ marginBottom: 20 }}>
            <TextareaField label="Description" value={form.description} rows={3}
              onChange={e => patch('description', e.target.value)}
              placeholder="Une réponse attentive au site, à la lumière et aux matériaux…"/>
          </div>

          {/* Photo de profil */}
          <div style={{ marginBottom: 28 }}>
            <ImageUpload label="Photo de profil (principale)" value={form.image} onChange={url => patch('image', url)}/>
          </div>

          {/* Photos secondaires — drag-and-drop pour réordonner */}
          <div style={{ marginBottom: 28 }}>
            <p style={{ fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase',
              color: 'rgba(250,250,248,0.4)', marginBottom: 4 }}>
              Photos secondaires ({(form.gallery ?? []).length})
            </p>
            <p style={{ fontSize: 9, color: 'rgba(250,250,248,0.2)', letterSpacing: '0.06em', marginBottom: 16 }}>
              Glisser pour réordonner
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
              {(form.gallery ?? []).map((url, i) => (
                <div
                  key={i}
                  draggable
                  onDragStart={() => { dragIdx.current = i; }}
                  onDragOver={e => { e.preventDefault(); }}
                  onDrop={e => { e.preventDefault(); if (dragIdx.current !== null && dragIdx.current !== i) moveGallery(dragIdx.current, i); dragIdx.current = null; }}
                  style={{ position: 'relative', cursor: 'grab', opacity: 1 }}
                >
                  <div style={{
                    position: 'absolute', top: 0, left: 0, zIndex: 2,
                    background: 'rgba(13,13,13,0.7)', padding: '3px 7px',
                    fontSize: 9, color: 'rgba(200,169,122,0.7)', letterSpacing: '0.1em',
                    pointerEvents: 'none',
                  }}>⠿ {i + 1}</div>
                  <ImageUpload label="" value={url} onChange={u => setGalleryUrl(i, u)}/>
                  <button onClick={() => removeGallerySlot(i)} style={{
                    position: 'absolute', top: 0, right: 0, zIndex: 3,
                    background: 'rgba(13,13,13,0.8)', border: 'none', color: 'rgba(250,100,100,0.7)',
                    cursor: 'pointer', fontSize: 11, padding: '4px 8px',
                  }}>✕</button>
                </div>
              ))}
              <button onClick={addGallerySlot} style={{
                height: 120, border: `0.5px dashed ${BORDER}`, background: 'rgba(255,255,255,0.02)',
                color: 'rgba(200,169,122,0.4)', fontSize: 24, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'border-color 0.2s',
              }}>+</button>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <BtnPrimary onClick={handleSave} disabled={saving}>
              {saving ? 'Enregistrement…' : editingId !== null ? 'Enregistrer' : 'Créer le projet'}
            </BtnPrimary>
            <BtnGhost onClick={closeForm}>Annuler</BtnGhost>
          </div>
        </div>
      )}

      {/* Projects list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {visible.length === 0 && (
          <p style={{ padding: '40px 0', textAlign: 'center', color: 'rgba(250,250,248,0.2)',
            fontSize: 11, letterSpacing: '0.1em' }}>Aucun projet dans cette catégorie.</p>
        )}
        {visible.map(p => (
          <div key={p.id} style={{
            display: 'grid', gridTemplateColumns: '48px 1fr auto auto auto auto auto',
            gap: 16, padding: '16px 20px', alignItems: 'center',
            background: editingId === p.id ? 'rgba(200,169,122,0.05)' : 'rgba(255,255,255,0.02)',
            border: `0.5px solid ${editingId === p.id ? A : BORDER}`,
            transition: 'all 0.15s',
          }}>
            <div style={{ width: 48, height: 48, overflow: 'hidden', background: '#1a1a1a', flexShrink: 0 }}>
              {p.image
                // eslint-disable-next-line @next/next/no-img-element
                ? <img src={p.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
                : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', fontSize: 18, color: 'rgba(200,169,122,0.2)' }}>◈</div>
              }
            </div>
            <div>
              <p style={{ fontSize: 13, color: '#FAFAF8', letterSpacing: '0.02em', marginBottom: 3 }}>{p.name}</p>
              <p style={{ fontSize: 10, color: 'rgba(250,250,248,0.3)', letterSpacing: '0.04em' }}>
                {p.category !== 'mobilier'
                  ? <><span>{p.location} · {p.year} · </span><span style={{ color: 'rgba(200,169,122,0.6)' }}>{p.phase ?? 'étude'}</span></>
                  : <span style={{ color: 'rgba(200,169,122,0.6)' }}>mobilier</span>
                }
                {(p.gallery ?? []).length > 0 && <span style={{ color: A, marginLeft: 8 }}>+{p.gallery.length} photo{p.gallery.length > 1 ? 's' : ''}</span>}
              </p>
            </div>
            <span style={{ fontSize: 9, color: A, letterSpacing: '0.12em', textTransform: 'uppercase' }}>{p.category}</span>
            <button onClick={() => toggleFeatured(p)} title={p.featured ? 'Retirer de la mise en avant' : 'Mettre en avant'} style={{
              ...ghostBtn,
              color: p.featured ? A : 'rgba(250,250,248,0.2)',
              fontSize: 16, padding: '2px 8px',
            }}>★</button>
            <button onClick={() => openEdit(p)} style={ghostBtn}>Modifier</button>
            <button onClick={() => handleDelete(p.id)} style={{ ...ghostBtn, color: 'rgba(250,100,100,0.5)' }}>Supprimer</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function BtnPrimary({ children, onClick, disabled }: { children: React.ReactNode; onClick?: () => void; disabled?: boolean }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      padding: '11px 28px', border: `0.5px solid ${A}`,
      background: 'transparent', color: A,
      fontFamily: 'var(--font-dm-sans)', fontSize: 10,
      letterSpacing: '0.18em', textTransform: 'uppercase',
      cursor: disabled ? 'default' : 'pointer', transition: 'all 0.2s',
    }}>{children}</button>
  );
}

function BtnGhost({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <button onClick={onClick} style={{
      padding: '11px 28px', border: `0.5px solid rgba(250,250,248,0.1)`,
      background: 'transparent', color: 'rgba(250,250,248,0.35)',
      fontFamily: 'var(--font-dm-sans)', fontSize: 10, letterSpacing: '0.18em',
      textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.2s',
    }}>{children}</button>
  );
}

const ghostBtn: React.CSSProperties = {
  background: 'none', border: 'none', cursor: 'pointer',
  fontFamily: 'var(--font-dm-sans)', fontSize: 10,
  letterSpacing: '0.12em', textTransform: 'uppercase',
  color: 'rgba(250,250,248,0.3)', padding: '4px 8px', transition: 'color 0.15s',
};
