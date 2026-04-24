'use client';
import { useRef, useState } from 'react';

const A = '#C8A97A';
const BORDER = 'rgba(200,169,122,0.2)';

interface Props {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

export default function ImageUpload({ value, onChange, label = 'Image' }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFile = async (file: File) => {
    setUploading(true);
    const fd = new FormData();
    fd.append('file', file);
    const res = await fetch('/api/upload', { method: 'POST', body: fd });
    const { url } = await res.json();
    onChange(url);
    setUploading(false);
  };

  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={e => e.preventDefault()}
        onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
        style={{
          border: `0.5px dashed ${BORDER}`, borderRadius: 2,
          height: value ? 'auto' : 120,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', position: 'relative', overflow: 'hidden',
          background: 'rgba(255,255,255,0.03)',
          transition: 'border-color 0.2s',
        }}
      >
        {value ? (
          <div style={{ position: 'relative', width: '100%' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={value} alt="" style={{ width: '100%', maxHeight: 200, objectFit: 'cover', display: 'block' }}/>
            <div style={{
              position: 'absolute', inset: 0, background: 'rgba(13,13,13,0.5)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              opacity: 0, transition: 'opacity 0.2s',
            }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '0')}
            >
              <span style={{ color: A, fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase' }}>Changer</span>
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: 20 }}>
            {uploading
              ? <span style={{ color: A, fontSize: 11, letterSpacing: '0.1em' }}>Envoi en cours…</span>
              : <>
                  <div style={{ fontSize: 22, color: 'rgba(200,169,122,0.4)', marginBottom: 8 }}>+</div>
                  <span style={{ color: 'rgba(250,250,248,0.25)', fontSize: 11, letterSpacing: '0.1em' }}>
                    Glisser une image ou cliquer
                  </span>
                </>
            }
          </div>
        )}
      </div>
      {value && (
        <button onClick={() => onChange('')} style={{
          marginTop: 8, background: 'none', border: 'none', cursor: 'pointer',
          color: 'rgba(250,250,248,0.25)', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase',
        }}>
          Supprimer l&apos;image
        </button>
      )}
      <input ref={inputRef} type="file" accept="image/*" style={{ display: 'none' }}
        onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }}/>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display: 'block', marginBottom: 8,
  fontFamily: 'var(--font-dm-sans)', fontSize: 9, letterSpacing: '0.18em',
  textTransform: 'uppercase', color: 'rgba(250,250,248,0.4)',
};
