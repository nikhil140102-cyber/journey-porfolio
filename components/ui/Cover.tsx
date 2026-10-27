import type { CoverKind } from '@/lib/content';

const hex = (cx: number, cy: number, r: number) =>
  Array.from({ length: 6 }, (_, i) => {
    const a = (Math.PI / 3) * i + Math.PI / 6;
    return `${i ? 'L' : 'M'}${(cx + r * Math.cos(a)).toFixed(1)} ${(cy + r * Math.sin(a)).toFixed(1)}`;
  }).join('') + 'Z';

/** Illustrated project covers (swap for real screenshots when you have them). */
export default function Cover({ kind, className }: { kind: CoverKind; className?: string }) {
  const common = { viewBox: '0 0 400 220', className, preserveAspectRatio: 'xMidYMid slice', role: 'img' as const };
  switch (kind) {
    case 'grync':
      return (
        <svg {...common} aria-label="GRYNC cover">
          <defs><linearGradient id="cg-g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#2A1760" /><stop offset="1" stopColor="#7C2D12" /></linearGradient></defs>
          <rect width="400" height="220" fill="url(#cg-g)" />
          {[40, 70, 55, 95, 80, 120].map((h, i) => (
            <g key={i}>
              <rect x={70 + i * 46} y={180 - h} width="30" height={h} rx="4" fill="#FB923C" fillOpacity={0.45 + i * 0.09} />
              <rect x={70 + i * 46} y={180 - h} width="30" height="6" rx="3" fill="#FED7AA" />
            </g>
          ))}
          <path d="M60 150 L130 118 L180 128 L240 84 L300 96 L350 50" stroke="#fff" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="350" cy="50" r="6" fill="#fff" />
        </svg>
      );
    case 'frames':
      return (
        <svg {...common} aria-label="Wall of Frames cover">
          <defs><linearGradient id="cg-f" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#3B0A2A" /><stop offset="1" stopColor="#831843" /></linearGradient></defs>
          <rect width="400" height="220" fill="url(#cg-f)" />
          {[[60, 30, -6], [160, 22, 4], [262, 34, -3], [84, 116, 5], [188, 112, -4], [288, 120, 6]].map(([x, y, r], i) => (
            <g key={i} transform={`translate(${x} ${y}) rotate(${r})`}>
              <rect width="76" height="76" rx="6" fill="#FFF7FB" />
              <rect x="7" y="7" width="62" height="50" rx="3" fill={['#F472B6', '#A78BFA', '#FB7185', '#F9A8D4', '#C084FC', '#EC4899'][i]} />
              <rect x="7" y="63" width="36" height="5" rx="2" fill="#9D174D" fillOpacity="0.5" />
            </g>
          ))}
        </svg>
      );
    case 'dashboard':
      return (
        <svg {...common} aria-label="MERN dashboard cover">
          <defs>
            <linearGradient id="cg-d" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#062A33" /><stop offset="1" stopColor="#0E7490" /></linearGradient>
            <linearGradient id="cg-da" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#22D3EE" stopOpacity="0.7" /><stop offset="1" stopColor="#22D3EE" stopOpacity="0" /></linearGradient>
          </defs>
          <rect width="400" height="220" fill="url(#cg-d)" />
          <rect x="30" y="24" width="340" height="180" rx="12" fill="#03161C" fillOpacity="0.75" />
          <rect x="42" y="36" width="56" height="156" rx="8" fill="#22D3EE" fillOpacity="0.15" />
          {[0, 1, 2].map((i) => (
            <g key={i}>
              <rect x={110 + i * 84} y="36" width="76" height="44" rx="8" fill="#22D3EE" fillOpacity={0.18 + i * 0.1} />
              <rect x={120 + i * 84} y="48" width="30" height="6" rx="3" fill="#A5F3FC" />
              <rect x={120 + i * 84} y="62" width="48" height="8" rx="4" fill="#fff" />
            </g>
          ))}
          <path d="M110 176 L150 150 L190 160 L230 124 L270 136 L310 102 L358 112 L358 186 L110 186 Z" fill="url(#cg-da)" />
          <path d="M110 176 L150 150 L190 160 L230 124 L270 136 L310 102 L358 112" stroke="#67E8F9" strokeWidth="2.5" fill="none" />
        </svg>
      );
    case 'devops':
      return (
        <svg {...common} aria-label="DevOps automation cover">
          <defs><linearGradient id="cg-o" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#022C22" /><stop offset="1" stopColor="#065F46" /></linearGradient></defs>
          <rect width="400" height="220" fill="url(#cg-o)" />
          {[[200, 110], [200, 62], [242, 86], [242, 134], [200, 158], [158, 134], [158, 86]].map(([x, y], i) => (
            <path key={i} d={hex(x, y, 26)} fill="#34D399" fillOpacity={i === 0 ? 0.9 : 0.22} stroke="#6EE7B7" strokeWidth="2" />
          ))}
          <circle cx="200" cy="110" r="78" stroke="#A7F3D0" strokeOpacity="0.35" strokeWidth="2" strokeDasharray="6 8" fill="none" />
        </svg>
      );
    case 'pipeline':
      return (
        <svg {...common} aria-label="CI/CD pipeline cover">
          <defs><linearGradient id="cg-p" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#2B1F02" /><stop offset="1" stopColor="#854D0E" /></linearGradient></defs>
          <rect width="400" height="220" fill="url(#cg-p)" />
          <path d="M76 110 H324" stroke="#FDE68A" strokeOpacity="0.5" strokeWidth="3" strokeDasharray="2 8" strokeLinecap="round" />
          {[0, 1, 2, 3].map((i) => {
            const x = 76 + i * 82.7;
            return (
              <g key={i}>
                <circle cx={x} cy="110" r="26" fill="#1C1405" stroke="#FACC15" strokeWidth="3" />
                {i < 3 ? <path d={`M${x - 9} 110 l6 7 l12 -14`} stroke="#FACC15" strokeWidth="3.5" fill="none" strokeLinecap="round" strokeLinejoin="round" /> : <circle cx={x} cy="110" r="8" fill="#FACC15" />}
              </g>
            );
          })}
        </svg>
      );
  }
}
