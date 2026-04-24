'use client';
import { useState, useEffect, useRef } from 'react';

const A = '#C8A97A';
const BORDER = 'rgba(200,169,122,0.15)';

interface Logo { id: number; name: string; url: string; active: boolean; }

export default function LogoAdmin() {
  const [logos, setLogos] = useState<Logo[]>([]);
  const [uploading, setUploading] = useState(false);
  const [name, setName] = useState('');
  const [msg, setMsg] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const load = () =>
    fetch('/api/logo').then(r => r.json()).then(d => setLogos(d.logos ?? []));

  useEffect(() => { load(); }, []);

  const flash = (m: string) => { setMsg(m); setTimeout(() => setMsg(''), 2500); };

  const handleFile = async (file: File) => {
    setUploading(true);
    const fd = new FormData();
    fd.append('file', file);
    const { url } = await fetch('/api/upload', { method: 'POST', body: fd }).then(r => r.json());
    await fetch('/api/logo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: name.trim() || file.name.replace(/\.[^.]+$/, ''), url }),
    });
    setName('');
    await load();
    setUploading(false);
    flash('Logo ajouté.');
  };

  const activate = async (id: number) => {
    await fetch(`/api/logo/${id}`, { method: 'PUT' });
    await load();
    flash('Logo activé — le site affichera ce logo.');
  };

  const remove = async (id: number) => {
    await fetch(`/api/logo/${id}`, { method: 'DELETE' });
    await load();
    flash('Logo supprimé.');
  };

  return (
    <div style={{ maxWidth: 760 }}>
      {msg && (
        <div style={{ padding: '10px 16px', background: 'rgba(200,169,122,0.12)',
          border: `0.5px solid ${A}`, fontSize: 11, color: A, letterSpacing: '0.08em', marginBottom: 24 }}>
          {msg}
        </div>
      )}

      {/* Upload zone */}
      <div style={{ marginBottom: 40 }}>
        <p style={{ fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase',
          color: 'rgba(250,250,248,0.35)', marginBottom: 16 }}>Ajouter un logo</p>

        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Nom du logo (optionnel)"
          style={{
            width: '100%', padding: '11px 14px', background: 'rgba(255,255,255,0.04)',
            border: `0.5px solid ${BORDER}`, color: '#FAFAF8',
            fontFamily: 'var(--font-dm-sans)', fontSize: 12, outline: 'none',
            letterSpacing: '0.04em', marginBottom: 12,
          }}
        />

        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={e => e.preventDefault()}
          onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
          style={{
            border: `0.5px dashed ${BORDER}`, height: 110,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', background: 'rgba(255,255,255,0.02)',
            transition: 'border-color 0.2s',
          }}
        >
          {uploading
            ? <span style={{ color: A, fontSize: 11, letterSpacing: '0.1em' }}>Envoi en cours…</span>
            : <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 22, color: 'rgba(200,169,122,0.4)', marginBottom: 8 }}>+</div>
                <span style={{ color: 'rgba(250,250,248,0.25)', fontSize: 11, letterSpacing: '0.1em' }}>
                  Glisser un fichier ou cliquer
                </span>
              </div>
          }
        </div>
        <input ref={inputRef} type="file" accept="image/*" style={{ display: 'none' }}
          onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }}/>
      </div>

      {/* Galerie */}
      <p style={{ fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase',
        color: 'rgba(250,250,248,0.35)', marginBottom: 16 }}>
        Logos ({logos.length})
      </p>

      {logos.length === 0 ? (
        <p style={{ color: 'rgba(250,250,248,0.2)', fontSize: 12, letterSpacing: '0.06em' }}>
          Aucun logo enregistré.
        </p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16 }}>
          {logos.map(logo => (
            <div key={logo.id} style={{
              border: logo.active ? `1px solid ${A}` : `0.5px solid ${BORDER}`,
              background: logo.active ? 'rgba(200,169,122,0.06)' : 'rgba(255,255,255,0.02)',
              padding: 16, display: 'flex', flexDirection: 'column', gap: 12,
              transition: 'border-color 0.2s',
            }}>
              {/* Preview — checkerboard bg to show transparency */}
              <div style={{
                height: 100, display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'repeating-conic-gradient(#2a2a2a 0% 25%, #1a1a1a 0% 50%) 0 0 / 16px 16px',
                overflow: 'hidden',
              }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={logo.url} alt={logo.name} style={{ maxWidth: '100%', maxHeight: '90px', objectFit: 'contain' }}/>
              </div>

              <div>
                <p style={{ fontSize: 11, color: '#FAFAF8', letterSpacing: '0.04em',
                  marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {logo.name || '—'}
                </p>
                {logo.active && (
                  <span style={{ fontSize: 9, color: A, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                    ● Actif
                  </span>
                )}
              </div>

              <div style={{ display: 'flex', gap: 8 }}>
                {!logo.active && (
                  <button onClick={() => activate(logo.id)} style={{
                    flex: 1, padding: '8px 0', background: 'rgba(200,169,122,0.12)',
                    border: `0.5px solid ${A}`, color: A, cursor: 'pointer',
                    fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase',
                    fontFamily: 'var(--font-dm-sans)', transition: 'background 0.2s',
                  }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(200,169,122,0.22)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'rgba(200,169,122,0.12)')}
                  >
                    Activer
                  </button>
                )}
                <button onClick={() => remove(logo.id)} style={{
                  flex: logo.active ? 1 : 0, padding: '8px 12px', background: 'transparent',
                  border: '0.5px solid rgba(250,100,100,0.3)', color: 'rgba(250,100,100,0.6)',
                  cursor: 'pointer', fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase',
                  fontFamily: 'var(--font-dm-sans)', transition: 'background 0.2s',
                }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(250,100,100,0.08)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
