'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import LogoMark from '@/components/ui/LogoMark';

const A = '#C8A97A';
const BORDER = 'rgba(200,169,122,0.2)';

export default function LoginForm() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      router.push('/admin');
      router.refresh();
    } else {
      const { error: msg } = await res.json();
      setError(msg);
      setLoading(false);
    }
  };

  return (
    <div style={{
      height: '100vh', background: '#0D0D0D',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'var(--font-dm-sans)',
    }}>
      <div style={{ width: 360 }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 48 }}>
          <LogoMark size={32} color="#FAFAF8"/>
          <span style={{ fontFamily: 'var(--font-cormorant)', fontSize: 18,
            letterSpacing: '0.1em', color: '#FAFAF8', fontStyle: 'italic' }}>Yamela Homes</span>
        </div>

        <div style={{ marginBottom: 32 }}>
          <div style={{ width: 20, height: '0.5px', background: A, marginBottom: 16 }}/>
          <h1 style={{ fontFamily: 'var(--font-cormorant)', fontWeight: 300, fontSize: 32,
            color: '#FAFAF8', letterSpacing: '0.04em' }}>Administration</h1>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div>
            <label style={{ display: 'block', fontSize: 9, letterSpacing: '0.2em',
              textTransform: 'uppercase', color: 'rgba(250,250,248,0.4)', marginBottom: 8 }}>
              Mot de passe
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoFocus
              required
              style={{
                width: '100%', padding: '12px 14px',
                background: 'rgba(255,255,255,0.04)',
                border: `0.5px solid ${error ? 'rgba(250,100,100,0.4)' : BORDER}`,
                color: '#FAFAF8', outline: 'none',
                fontFamily: 'var(--font-dm-sans)', fontSize: 14,
                letterSpacing: '0.1em', borderRadius: 2,
                transition: 'border-color 0.2s',
              }}
              onFocus={e => (e.target.style.borderColor = A)}
              onBlur={e => (e.target.style.borderColor = error ? 'rgba(250,100,100,0.4)' : BORDER)}
            />
            {error && <p style={{ marginTop: 8, fontSize: 10, color: 'rgba(250,100,100,0.7)',
              letterSpacing: '0.06em' }}>{error}</p>}
          </div>

          <button type="submit" disabled={loading} style={{
            padding: '13px', border: `0.5px solid ${A}`,
            background: loading ? 'rgba(200,169,122,0.1)' : 'transparent',
            color: A, fontFamily: 'var(--font-dm-sans)', fontSize: 10,
            letterSpacing: '0.22em', textTransform: 'uppercase',
            cursor: loading ? 'default' : 'pointer', transition: 'all 0.25s',
          }}
            onMouseEnter={e => { if (!loading) { (e.currentTarget.style.background = A); (e.currentTarget.style.color = '#0D0D0D'); } }}
            onMouseLeave={e => { (e.currentTarget.style.background = 'transparent'); (e.currentTarget.style.color = A); }}
          >
            {loading ? 'Connexion…' : 'Accéder'}
          </button>
        </form>
      </div>
    </div>
  );
}
