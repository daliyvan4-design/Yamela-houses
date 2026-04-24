'use client';
import { T } from '@/lib/tokens';

interface Props { size?: number; color?: string; }

export default function LogoMark({ size = 28, color = '#0D0D0D' }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4"  y="14" width="10" height="10" stroke={color}    strokeWidth="0.8"/>
      <rect x="14" y="4"  width="10" height="10" stroke={color}    strokeWidth="0.8"/>
      <line x1="4" y1="14" x2="24" y2="4"        stroke={T.accent} strokeWidth="0.8"/>
    </svg>
  );
}
