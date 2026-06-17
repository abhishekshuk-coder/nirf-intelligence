"use client";

interface ScoreGaugeProps {
  score: number;
  max?: number;
  size?: number;
  label?: string;
  color?: string;
}

export function ScoreGauge({ score, max = 100, size = 120, label, color = "#2563EB" }: ScoreGaugeProps) {
  const pct = Math.min(1, score / max);
  const r = 46;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = Math.PI * r; // half circle
  const filled = circumference * pct;
  const startAngle = Math.PI;

  const x1 = cx + r * Math.cos(startAngle);
  const y1 = cy + r * Math.sin(startAngle);

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size * 0.6} viewBox={`0 0 ${size} ${size * 0.6}`}>
        <path
          d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
          fill="none"
          stroke="#E2E8F0"
          strokeWidth="10"
          strokeLinecap="round"
        />
        <path
          d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={`${filled} ${circumference}`}
          style={{ transition: "stroke-dasharray 1.5s cubic-bezier(0.4,0,0.2,1)" }}
        />
        <text x={cx} y={cy - 4} textAnchor="middle" fontSize="18" fontWeight="700" fill="#0F172A">
          {score.toFixed(1)}
        </text>
        {label && (
          <text x={cx} y={cy + 14} textAnchor="middle" fontSize="9" fill="#64748B">
            {label}
          </text>
        )}
      </svg>
    </div>
  );
}
