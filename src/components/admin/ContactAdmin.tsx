'use client';
import { useState } from 'react';
import { ContactRecord } from '@/lib/store';
import { Field } from './Field';

const A = '#C8A97A';
const BORDER = 'rgba(200,169,122,0.15)';

interface Props { initial: ContactRecord; }

export default function ContactAdmin({ initial }: Props) {
  const [form, setForm] = useState<ContactRecord>(initial);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  const handleSave = async () => {
    setSaving(true);
    await fetch('/api/contact', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    setSaving(false);
    setMsg('Informations de contact enregistrées.');
    setTimeout(() => setMsg(''), 2500);
  };

  const set = (k: keyof ContactRecord) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  return (
    <div style={{ maxWidth: 560 }}>
      <p style={{ fontSize: 11, color: 'rgba(250,250,248,0.3)', letterSpacing: '0.06em',
        lineHeight: 1.7, marginBottom: 36 }}>
        Ces informations apparaissent dans la section Contact du site.
      </p>

      {msg && <div style={{ padding: '10px 16px', background: 'rgba(200,169,122,0.12)',
        border: `0.5px solid ${A}`, fontSize: 11, color: A, letterSpacing: '0.08em', marginBottom: 24 }}>{msg}</div>}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24, padding: 32,
        border: `0.5px solid ${BORDER}`, background: 'rgba(255,255,255,0.02)', marginBottom: 28 }}>

        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 8 }}>
          <div style={{ width: 20, height: '0.5px', background: A }}/>
          <span style={{ fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase', color: A }}>
            Coordonnées
          </span>
        </div>

        <Field label="Adresse" value={form.address} onChange={set('address')}
          placeholder="14 Rue des Orangers, Rabat 10000"/>
        <Field label="Email" type="email" value={form.email} onChange={set('email')}
          placeholder="contact@yamela-homes.ma"/>
        <Field label="Téléphone" type="tel" value={form.phone} onChange={set('phone')}
          placeholder="+212 537 00 00 00"/>
      </div>

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
