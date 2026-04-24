'use client';
import { useState } from 'react';
import { AboutRecord } from '@/lib/store';
import { Field, TextareaField } from './Field';
import ImageUpload from './ImageUpload';

const A = '#C8A97A';
const BORDER = 'rgba(200,169,122,0.15)';

const DEFAULTS: Partial<AboutRecord> = { heading_dark: "L'architecture comme", heading_accent: 'acte de précision' };

interface Props { initial: AboutRecord; }

export default function AboutAdmin({ initial }: Props) {
  const [form, setForm] = useState<AboutRecord>({ ...DEFAULTS, ...initial });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  const handleSave = async () => {
    setSaving(true);
    await fetch('/api/about', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    setSaving(false);
    setMsg('Page À propos mise à jour.');
    setTimeout(() => setMsg(''), 2500);
  };

  const setStat = (i: number, key: 'value' | 'label', val: string) =>
    setForm(f => { const stats = [...f.stats]; stats[i] = { ...stats[i], [key]: val }; return { ...f, stats }; });

  const setPara = (i: number, val: string) =>
    setForm(f => { const paragraphs = [...f.paragraphs]; paragraphs[i] = val; return { ...f, paragraphs }; });

  const addPara = () => setForm(f => ({ ...f, paragraphs: [...f.paragraphs, ''] }));
  const removePara = (i: number) => setForm(f => ({ ...f, paragraphs: f.paragraphs.filter((_, j) => j !== i) }));

  const setService = (i: number, val: string) =>
    setForm(f => { const services = [...f.services]; services[i] = val; return { ...f, services }; });

  const addService = () => setForm(f => ({ ...f, services: [...f.services, ''] }));
  const removeService = (i: number) => setForm(f => ({ ...f, services: f.services.filter((_, j) => j !== i) }));

  return (
    <div style={{ maxWidth: 680 }}>
      {msg && <div style={{ padding: '10px 16px', background: 'rgba(200,169,122,0.12)',
        border: `0.5px solid ${A}`, fontSize: 11, color: A, letterSpacing: '0.08em', marginBottom: 24 }}>{msg}</div>}

      {/* Titre */}
      <Section title="Titre de la page">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Field label="Ligne principale (blanc)" value={form.heading_dark}
            onChange={e => setForm(f => ({ ...f, heading_dark: e.target.value }))}
            placeholder="L'architecture comme"/>
          <Field label="Ligne accent (dorée)" value={form.heading_accent}
            onChange={e => setForm(f => ({ ...f, heading_accent: e.target.value }))}
            placeholder="acte de précision"/>
        </div>
      </Section>

      {/* Photo */}
      <Section title="Photo">
        <ImageUpload label="Portrait / Photo de l'architecte" value={form.image}
          onChange={url => setForm(f => ({ ...f, image: url }))}/>
      </Section>

      {/* Stats */}
      <Section title="Statistiques">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {form.stats.map((s, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <Field label="Chiffre" value={s.value} onChange={e => setStat(i, 'value', e.target.value)} placeholder="12+"/>
              <Field label="Label"  value={s.label} onChange={e => setStat(i, 'label', e.target.value)} placeholder="Ans"/>
            </div>
          ))}
        </div>
      </Section>

      {/* Description */}
      <Section title="Description">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {form.paragraphs.map((p, i) => (
            <div key={i} style={{ position: 'relative' }}>
              <TextareaField label={`Paragraphe ${i + 1}`} value={p} rows={3}
                onChange={e => setPara(i, e.target.value)}/>
              {form.paragraphs.length > 1 && (
                <button onClick={() => removePara(i)} style={{
                  position: 'absolute', top: 0, right: 0,
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: 'rgba(250,100,100,0.4)', fontSize: 10,
                  letterSpacing: '0.1em', textTransform: 'uppercase',
                }}>− Supprimer</button>
              )}
            </div>
          ))}
          <button onClick={addPara} style={addBtn}>+ Ajouter un paragraphe</button>
        </div>
      </Section>

      {/* Services */}
      <Section title="Services">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {form.services.map((s, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <div style={{ flex: 1 }}>
                <Field label={`Service ${i + 1}`} value={s}
                  onChange={e => setService(i, e.target.value)} placeholder="Maisons individuelles"/>
              </div>
              {form.services.length > 1 && (
                <button onClick={() => removeService(i)} style={{
                  background: 'none', border: 'none', cursor: 'pointer', marginTop: 18,
                  color: 'rgba(250,100,100,0.4)', fontSize: 16, lineHeight: 1,
                }}>×</button>
              )}
            </div>
          ))}
          <button onClick={addService} style={addBtn}>+ Ajouter un service</button>
        </div>
      </Section>

      <button onClick={handleSave} disabled={saving} style={{
        padding: '12px 36px', border: `0.5px solid ${A}`,
        background: 'transparent', color: A,
        fontFamily: 'var(--font-dm-sans)', fontSize: 10,
        letterSpacing: '0.2em', textTransform: 'uppercase',
        cursor: saving ? 'default' : 'pointer', transition: 'all 0.2s',
      }}>
        {saving ? 'Enregistrement…' : 'Enregistrer'}
      </button>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 32 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <div style={{ width: 16, height: '0.5px', background: '#C8A97A' }}/>
        <span style={{ fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#C8A97A' }}>
          {title}
        </span>
      </div>
      <div style={{ padding: 24, border: `0.5px solid ${BORDER}`, background: 'rgba(255,255,255,0.02)' }}>
        {children}
      </div>
    </div>
  );
}

const addBtn: React.CSSProperties = {
  alignSelf: 'flex-start', background: 'none',
  border: `0.5px solid rgba(200,169,122,0.2)`, cursor: 'pointer',
  color: 'rgba(200,169,122,0.5)', fontFamily: 'var(--font-dm-sans)',
  fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase',
  padding: '8px 16px', transition: 'all 0.2s',
};
