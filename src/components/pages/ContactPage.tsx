'use client';
import { useState, useEffect } from 'react';
import { T } from '@/lib/tokens';
import { ContactRecord } from '@/lib/store';
import { getCachedContact } from '@/lib/apiCache';
import { useIsMobile } from '@/lib/useIsMobile';

const DEFAULT: ContactRecord = { address: '', email: '', phone: '' };

export default function ContactPage() {
  const [info, setInfo] = useState<ContactRecord>(() => getCachedContact() ?? DEFAULT);
  const [form, setForm] = useState({ name: '', email: '', message: '', type: 'Résidentiel' });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [hovBtn, setHovBtn] = useState(false);
  const mobile = useIsMobile();

  useEffect(() => {
    if (info === DEFAULT) fetch('/api/contact').then(r => r.json()).then(setInfo);
  }, []);

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '13px 0', background: 'transparent',
    border: 'none', borderBottom: `0.5px solid ${T.border}`,
    fontFamily: 'var(--font-dm-sans)', fontSize: 13, color: T.text,
    outline: 'none', fontWeight: 300, letterSpacing: '0.02em',
    transition: 'border-color 0.2s',
  };

  if (sent) return (
    <div className="page-enter" style={{
      height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexDirection: 'column', gap: 20, background: T.bg,
    }}>
      <div style={{ width: 40, height: '0.5px', background: T.accent }}/>
      <h2 style={{ fontFamily: 'var(--font-cormorant)', fontWeight: 300, fontSize: 40, letterSpacing: '0.04em' }}>
        Message reçu
      </h2>
      <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: 12, color: T.muted, letterSpacing: '0.04em' }}>
        Nous vous répondons sous 48h.
      </p>
    </div>
  );

  return (
    <div className="page-enter" style={{
      height: '100%',
      display: mobile ? 'block' : 'grid',
      gridTemplateColumns: '1fr 1.2fr',
      overflowY: mobile ? 'auto' : 'hidden',
    }}>

      {/* LEFT — infos */}
      <div style={{
        background: '#0D0D0D', position: 'relative', overflow: 'hidden',
        display: 'flex', flexDirection: 'column', justifyContent: mobile ? 'center' : 'flex-end',
        padding: mobile ? '36px 24px' : '52px 48px',
        minHeight: mobile ? 'auto' : undefined,
      }}>
        <div style={{
          position: 'absolute', bottom: '-10%', right: '-10%',
          fontFamily: 'var(--font-cormorant)', fontWeight: 300, fontSize: '40vw',
          lineHeight: 1, color: 'transparent',
          WebkitTextStroke: `1px rgba(200,169,122,0.05)`,
          userSelect: 'none', pointerEvents: 'none',
        }}>C</div>

        <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
          viewBox="0 0 600 900" preserveAspectRatio="xMidYMid slice">
          <line x1="600" y1="0" x2="0" y2="900" stroke={T.accent} strokeWidth="0.4" opacity="0.15"/>
        </svg>

        <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: mobile ? 24 : 48 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
              <div style={{ width: 28, height: '0.5px', background: T.accent }}/>
              <span style={{ fontFamily: 'var(--font-dm-sans)', fontSize: 10, letterSpacing: '0.22em',
                textTransform: 'uppercase', color: T.accent }}>Contact</span>
            </div>
            <h2 style={{ fontFamily: 'var(--font-cormorant)', fontWeight: 300,
              fontSize: mobile ? 'clamp(28px,7vw,40px)' : 'clamp(32px,3.5vw,52px)',
              color: '#FAFAF8', lineHeight: 1.1, letterSpacing: '0.02em' }}>
              Parlons de<br/><em style={{ color: T.accent }}>votre projet.</em>
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: mobile ? 'row' : 'column', gap: mobile ? 20 : 24, flexWrap: 'wrap' }}>
            {[['Adresse', info.address], ['Email', info.email], ['Tél.', info.phone]]
              .filter(([, v]) => v).map(([label, val]) => (
              <div key={label}>
                <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: 9, letterSpacing: '0.2em',
                  textTransform: 'uppercase', color: T.accent, marginBottom: 4 }}>{label}</p>
                <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: mobile ? 11 : 12,
                  color: 'rgba(250,250,248,0.55)', letterSpacing: '0.03em' }}>{val}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT — formulaire */}
      <div style={{
        display: 'flex', flexDirection: 'column', justifyContent: mobile ? 'flex-start' : 'center',
        padding: mobile ? '32px 24px 100px' : '60px 56px',
        background: T.bg,
      }}>
        <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: 10, letterSpacing: '0.2em',
          textTransform: 'uppercase', color: T.muted, marginBottom: 28 }}>Formulaire de contact</p>

        <form onSubmit={async e => {
          e.preventDefault();
          setSending(true);
          await fetch('https://formspree.io/f/mlgazbbn', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
            body: JSON.stringify({ name: form.name, email: form.email, message: form.message, type: form.type }),
          });
          setSending(false);
          setSent(true);
        }} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

          <div>
            <label style={{ fontFamily: 'var(--font-dm-sans)', fontSize: 9, letterSpacing: '0.18em',
              textTransform: 'uppercase', color: T.muted, display: 'block', marginBottom: 10 }}>Type de projet</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {['Intérieur', 'Résidentiel', 'Bureaux', 'Commercial'].map(t => (
                <button key={t} type="button" onClick={() => setForm(f => ({ ...f, type: t }))} style={{
                  padding: '7px 16px', background: 'none', cursor: 'pointer',
                  border: `0.5px solid ${form.type === t ? T.accent : T.border}`,
                  color: form.type === t ? T.accent : T.muted,
                  fontFamily: 'var(--font-dm-sans)', fontSize: 10, letterSpacing: '0.1em',
                  textTransform: 'uppercase', transition: 'all 0.2s',
                }}>{t}</button>
              ))}
            </div>
          </div>

          <div>
            <label style={{ fontFamily: 'var(--font-dm-sans)', fontSize: 9, letterSpacing: '0.18em',
              textTransform: 'uppercase', color: T.muted, display: 'block', marginBottom: 4 }}>Nom</label>
            <input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              style={inputStyle}
              onFocus={e => (e.target as HTMLInputElement).style.borderBottomColor = T.accent}
              onBlur={e => (e.target as HTMLInputElement).style.borderBottomColor = T.border}/>
          </div>

          <div>
            <label style={{ fontFamily: 'var(--font-dm-sans)', fontSize: 9, letterSpacing: '0.18em',
              textTransform: 'uppercase', color: T.muted, display: 'block', marginBottom: 4 }}>Email</label>
            <input type="email" required value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              style={inputStyle}
              onFocus={e => (e.target as HTMLInputElement).style.borderBottomColor = T.accent}
              onBlur={e => (e.target as HTMLInputElement).style.borderBottomColor = T.border}/>
          </div>

          <div>
            <label style={{ fontFamily: 'var(--font-dm-sans)', fontSize: 9, letterSpacing: '0.18em',
              textTransform: 'uppercase', color: T.muted, display: 'block', marginBottom: 4 }}>Message</label>
            <textarea required rows={4} value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
              style={{ ...inputStyle, resize: 'none', display: 'block' }}
              onFocus={e => (e.target as HTMLTextAreaElement).style.borderBottomColor = T.accent}
              onBlur={e => (e.target as HTMLTextAreaElement).style.borderBottomColor = T.border}/>
          </div>

          <button type="submit" disabled={sending}
            onMouseEnter={() => setHovBtn(true)}
            onMouseLeave={() => setHovBtn(false)}
            style={{
              padding: '14px 44px', alignSelf: 'flex-start', cursor: sending ? 'default' : 'pointer',
              border: `0.5px solid ${hovBtn && !sending ? T.accent : T.text}`,
              background: hovBtn && !sending ? T.accent : 'transparent',
              color: hovBtn && !sending ? '#0D0D0D' : T.text,
              fontFamily: 'var(--font-dm-sans)', fontSize: 10, letterSpacing: '0.22em',
              textTransform: 'uppercase', transition: 'all 0.3s',
            }}>
            {sending ? 'Envoi…' : 'Envoyer'}
          </button>
        </form>
      </div>
    </div>
  );
}
