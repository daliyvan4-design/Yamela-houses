'use client';
import { T } from '@/lib/tokens';

interface Props { px: number; py: number; }

export default function BlueprintSVG({ px, py }: Props) {
  const A = T.accent;

  const draw = (delay: number, dur = 1.2) => ({
    strokeDasharray: '3000',
    strokeDashoffset: '3000',
    style: { animation: `drawPath ${dur}s cubic-bezier(0.4,0,0.2,1) ${delay}s forwards` },
  });

  const fade = (delay: number) => ({
    style: { opacity: 0, animation: `fadeIn 0.5s ease ${delay}s forwards` },
  });

  return (
    <svg
      style={{
        position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none',
        transform: `translate(${px * 18}px,${py * 12}px)`, transition: 'transform 0.1s linear',
      }}
      viewBox="0 0 1200 900"
      preserveAspectRatio="xMidYMid meet"
    >
      {/* Exterior walls */}
      <line x1="340" y1="110" x2="950" y2="110" stroke={A} strokeWidth="2.5" opacity="0.7" {...draw(0.2)}/>
      <line x1="950" y1="110" x2="950" y2="650" stroke={A} strokeWidth="2.5" opacity="0.7" {...draw(0.6)}/>
      <line x1="950" y1="650" x2="340" y2="650" stroke={A} strokeWidth="2.5" opacity="0.7" {...draw(1.0)}/>
      <line x1="340" y1="650" x2="340" y2="110" stroke={A} strokeWidth="2.5" opacity="0.7" {...draw(1.4)}/>

      {/* Balcony dashed */}
      <g {...fade(1.7)}>
        <line x1="340" y1="110" x2="340" y2="55"  stroke={A} strokeWidth="1" strokeDasharray="7 4" opacity="0.35"/>
        <line x1="340" y1="55"  x2="640" y2="55"  stroke={A} strokeWidth="1" strokeDasharray="7 4" opacity="0.35"/>
        <line x1="640" y1="55"  x2="640" y2="110" stroke={A} strokeWidth="1" strokeDasharray="7 4" opacity="0.35"/>
      </g>

      {/* Interior walls */}
      <line x1="340" y1="405" x2="950" y2="405" stroke={A} strokeWidth="1.5" opacity="0.55" {...draw(1.9)}/>
      <line x1="635" y1="110" x2="635" y2="650" stroke={A} strokeWidth="1.5" opacity="0.55" {...draw(2.2)}/>
      <line x1="785" y1="405" x2="785" y2="650" stroke={A} strokeWidth="1.2" opacity="0.45" {...draw(2.5)}/>
      <line x1="635" y1="525" x2="785" y2="525" stroke={A} strokeWidth="1.2" opacity="0.45" {...draw(2.7)}/>

      {/* Doors */}
      <line x1="340" y1="540" x2="340" y2="460" stroke={A} strokeWidth="0.9" opacity="0.5" {...draw(2.9, 0.4)}/>
      <path d="M 340,460 A 80,80 0 0,1 420,540" fill="none" stroke={A} strokeWidth="0.9" opacity="0.5" {...draw(3.0, 0.5)}/>
      <path d="M 635,215 A 60,60 0 0,0 575,275" fill="none" stroke={A} strokeWidth="0.9" opacity="0.45" {...draw(3.1, 0.4)}/>
      <path d="M 455,405 A 65,65 0 0,1 520,470" fill="none" stroke={A} strokeWidth="0.9" opacity="0.45" {...draw(3.2, 0.4)}/>
      <path d="M 680,405 A 52,52 0 0,1 732,457" fill="none" stroke={A} strokeWidth="0.9" opacity="0.45" {...draw(3.3, 0.35)}/>
      <path d="M 635,452 A 45,45 0 0,1 680,407" fill="none" stroke={A} strokeWidth="0.9" opacity="0.45" {...draw(3.4, 0.3)}/>

      {/* Windows */}
      <g {...fade(3.5)}>
        {[185, 315].map(y => (
          <g key={y}>
            <line x1="332" y1={y}    x2="348" y2={y}    stroke={A} strokeWidth="1.2" opacity="0.6"/>
            <line x1="332" y1={y+22} x2="348" y2={y+22} stroke={A} strokeWidth="1.2" opacity="0.6"/>
            <line x1="332" y1={y+44} x2="348" y2={y+44} stroke={A} strokeWidth="1.2" opacity="0.6"/>
          </g>
        ))}
        {[715, 768, 821].map(x => (
          <line key={x} x1={x} y1="102" x2={x} y2="118" stroke={A} strokeWidth="1.2" opacity="0.6"/>
        ))}
        {[455, 488, 521].map(y => (
          <line key={y} x1="332" y1={y} x2="348" y2={y} stroke={A} strokeWidth="1.2" opacity="0.6"/>
        ))}
      </g>

      {/* Wall nodes */}
      <g {...fade(3.6)}>
        {[[340,110],[635,110],[950,110],[340,405],[635,405],[950,405],
          [340,650],[635,650],[950,650],[785,405],[785,525],[785,650],[635,525]].map(([x,y],i) => (
          <rect key={i} x={x-4} y={y-4} width={8} height={8} fill={A} opacity="0.35"/>
        ))}
      </g>

      {/* Dimension lines */}
      <g {...fade(3.7)}>
        <line x1="340" y1="28" x2="950" y2="28" stroke={A} strokeWidth="0.6" opacity="0.3"/>
        <line x1="340" y1="20" x2="340" y2="36" stroke={A} strokeWidth="1"   opacity="0.45"/>
        <line x1="950" y1="20" x2="950" y2="36" stroke={A} strokeWidth="1"   opacity="0.45"/>
        <text x="645" y="22" fill={A} fontFamily="DM Sans" fontSize="10" textAnchor="middle" letterSpacing="0.1em" opacity="0.45">12.2 m</text>
        <line x1="980" y1="110" x2="980" y2="650" stroke={A} strokeWidth="0.6" opacity="0.3"/>
        <line x1="972" y1="110" x2="988" y2="110" stroke={A} strokeWidth="1"   opacity="0.45"/>
        <line x1="972" y1="650" x2="988" y2="650" stroke={A} strokeWidth="1"   opacity="0.45"/>
        <text x="1006" y="385" fill={A} fontFamily="DM Sans" fontSize="10" textAnchor="middle" letterSpacing="0.1em" opacity="0.45" transform="rotate(90,1006,385)">10.8 m</text>
      </g>

      {/* Room labels */}
      <g {...fade(3.9)}>
        {[
          [480, 265, 'SÉJOUR',        10],
          [792, 265, 'CUISINE',        10],
          [487, 535, 'CH. PRINCIPALE',  8],
          [708, 462, 'DRESSING',         8],
          [708, 583, 'SDB',             8],
          [868, 535, 'CELLIER',         7.5],
          [490,  82, 'TERRASSE',        7.5],
        ].map(([x, y, lbl, sz]) => (
          <text key={lbl as string} x={x} y={y} fill={A} fontFamily="DM Sans" fontSize={sz as number}
            textAnchor="middle" letterSpacing="0.2em" opacity="0.5">{lbl as string}</text>
        ))}
      </g>

      {/* Section cut */}
      <g {...fade(4.1)}>
        <line x1="308" y1="405" x2="330" y2="405" stroke={A} strokeWidth="1.5" opacity="0.65"/>
        <line x1="960" y1="405" x2="982" y2="405" stroke={A} strokeWidth="1.5" opacity="0.65"/>
        <text x="303" y="409" fill={A} fontFamily="DM Sans" fontSize="10" textAnchor="end"   opacity="0.55">A</text>
        <text x="986" y="409" fill={A} fontFamily="DM Sans" fontSize="10" textAnchor="start" opacity="0.55">A&apos;</text>
      </g>

      {/* North arrow */}
      <g {...fade(4.2)}>
        <circle cx="1095" cy="210" r="22" stroke={A} strokeWidth="0.9" fill="none" opacity="0.45"/>
        <line x1="1095" y1="232" x2="1095" y2="188" stroke={A} strokeWidth="1" opacity="0.55"/>
        <polygon points="1095,188 1088,210 1102,210" fill={A} opacity="0.65"/>
        <text x="1095" y="246" fill={A} fontFamily="DM Sans" fontSize="9" textAnchor="middle" letterSpacing="0.2em" opacity="0.5">N</text>
      </g>

      {/* Title block */}
      <g {...fade(4.35)}>
        <line x1="1030" y1="275" x2="1175" y2="275" stroke={A} strokeWidth="0.7" opacity="0.3"/>
        <text x="1102" y="294" fill={A} fontFamily="Cormorant Garamond" fontSize="13" textAnchor="middle" letterSpacing="0.2em" fontStyle="italic" opacity="0.55">Yamela Homes</text>
        <line x1="1030" y1="302" x2="1175" y2="302" stroke={A} strokeWidth="0.4" opacity="0.2"/>
        <text x="1102" y="316" fill={A} fontFamily="DM Sans" fontSize="8" textAnchor="middle" letterSpacing="0.14em" opacity="0.35">PLAN RDC · 1:100</text>
        <line x1="1030" y1="325" x2="1175" y2="325" stroke={A} strokeWidth="0.4" opacity="0.2"/>
      </g>

      {/* Scale bar */}
      <g {...fade(4.5)}>
        <line x1="1040" y1="350" x2="1165" y2="350" stroke={A} strokeWidth="1"   opacity="0.35"/>
        <line x1="1040" y1="344" x2="1040" y2="356" stroke={A} strokeWidth="1"   opacity="0.4"/>
        <line x1="1102" y1="344" x2="1102" y2="356" stroke={A} strokeWidth="1"   opacity="0.4"/>
        <line x1="1165" y1="344" x2="1165" y2="356" stroke={A} strokeWidth="1"   opacity="0.4"/>
        <text x="1102" y="368" fill={A} fontFamily="DM Sans" fontSize="7.5" textAnchor="middle" letterSpacing="0.1em" opacity="0.3">0       5      10m</text>
      </g>
    </svg>
  );
}
