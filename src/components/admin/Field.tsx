'use client';

const A = '#C8A97A';
const BORDER = 'rgba(200,169,122,0.18)';

const base: React.CSSProperties = {
  width: '100%', padding: '11px 14px',
  background: 'rgba(255,255,255,0.04)',
  border: `0.5px solid ${BORDER}`,
  color: '#FAFAF8', outline: 'none',
  fontFamily: 'var(--font-dm-sans)', fontSize: 13,
  letterSpacing: '0.02em', fontWeight: 300,
  transition: 'border-color 0.2s',
  borderRadius: 2,
};

const labelStyle: React.CSSProperties = {
  display: 'block', marginBottom: 8,
  fontFamily: 'var(--font-dm-sans)', fontSize: 9, letterSpacing: '0.18em',
  textTransform: 'uppercase', color: 'rgba(250,250,248,0.4)',
};

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> { label: string; }
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> { label: string; rows?: number; }
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> { label: string; options: { value: string; label: string }[]; }

export function Field({ label, ...props }: InputProps) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <input {...props} style={{ ...base, ...props.style }}
        onFocus={e => (e.target.style.borderColor = A)}
        onBlur={e => (e.target.style.borderColor = BORDER)}/>
    </div>
  );
}

export function TextareaField({ label, rows = 4, ...props }: TextareaProps) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <textarea rows={rows} {...props} style={{ ...base, resize: 'vertical', ...props.style }}
        onFocus={e => (e.target.style.borderColor = A)}
        onBlur={e => (e.target.style.borderColor = BORDER)}/>
    </div>
  );
}

export function SelectField({ label, options, ...props }: SelectProps) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <select {...props} style={{ ...base, cursor: 'pointer', ...props.style }}
        onFocus={e => (e.target.style.borderColor = A)}
        onBlur={e => (e.target.style.borderColor = BORDER)}>
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}
