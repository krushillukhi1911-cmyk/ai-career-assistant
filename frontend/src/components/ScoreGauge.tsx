import React from 'react';

interface ScoreGaugeProps {
  score: number;
  label?: string;
  size?: number;
}

export const ScoreGauge: React.FC<ScoreGaugeProps> = ({
  score,
  label = 'Compatibility Score',
  size = 140,
}) => {
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  let color = 'var(--accent-cyan)';
  if (score >= 80) color = 'var(--accent-emerald)';
  else if (score >= 60) color = 'var(--primary)';
  else if (score >= 40) color = 'var(--accent-amber)';
  else color = 'var(--accent-rose)';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
      <div style={{ position: 'relative', width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
          />
        </svg>
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span style={{ fontSize: '1.8rem', fontWeight: 800, color: color }}>
            {Math.round(score)}%
          </span>
        </div>
      </div>
      {label && (
        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>
          {label}
        </span>
      )}
    </div>
  );
};
