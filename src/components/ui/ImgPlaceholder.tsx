'use client';
import { useId, ReactNode, CSSProperties } from 'react';

interface Props {
  label: string;
  style?: CSSProperties;
  overlay?: ReactNode;
}

export default function ImgPlaceholder({ label, style, overlay }: Props) {
  const rawId = useId().replace(/:/g, '');
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', background: '#F0EDE8', ...style }}>
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style={{ position: 'absolute', inset: 0 }}>
        <defs>
          <pattern id={`p${rawId}`} width="24" height="24" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="24" stroke="#DDD9D3" strokeWidth="1"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#p${rawId})`}/>
      </svg>
      <div style={{
        position: 'absolute', inset: 0, display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        fontFamily: 'monospace', fontSize: 10, color: '#AAA4A0',
        letterSpacing: '0.08em', textAlign: 'center', padding: 8,
      }}>
        {label}
      </div>
      {overlay}
    </div>
  );
}
