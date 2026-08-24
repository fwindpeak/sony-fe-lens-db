import React from 'react';
import { Lens } from '../types/lens';

interface RadarChartProps {
  lens?: Lens;
  compareLenses?: Lens[];
  size?: number;
}

const METRICS = [
  { key: 'sharpnessScore', labelZh: '锐度均值', labelEn: 'Sharpness', max: 5 },
  { key: 'uniformityScore', labelZh: '边缘一致性', labelEn: 'Uniformity', max: 5 },
  { key: 'wideOpenScore', labelZh: '全开可用度', labelEn: 'Wide Open', max: 5 },
  { key: 'caControlScore', labelZh: '色散控制', labelEn: 'CA Control', max: 5 },
  { key: 'bokehScore', labelZh: '虚化氛围', labelEn: 'Bokeh', max: 5 },
  { key: 'distortionScore', labelZh: '畸变暗角', labelEn: 'Distortion', max: 5 },
] as const;

const COMPARE_COLORS = [
  { stroke: '#FF5A00', fill: 'rgba(255, 90, 0, 0.25)', name: 'Lens 1' },
  { stroke: '#3b82f6', fill: 'rgba(59, 130, 246, 0.25)', name: 'Lens 2' },
  { stroke: '#10b981', fill: 'rgba(16, 185, 129, 0.25)', name: 'Lens 3' },
  { stroke: '#a855f7', fill: 'rgba(168, 85, 247, 0.25)', name: 'Lens 4' },
];

export const OpticalRadarChart: React.FC<RadarChartProps> = ({
  lens,
  compareLenses,
  size = 280,
}) => {
  const center = size / 2;
  const radius = center - 42;
  const count = METRICS.length;
  const angleStep = (Math.PI * 2) / count;

  // 计算多边形网格坐标
  const getCoordinates = (index: number, value: number, max: number) => {
    const angle = index * angleStep - Math.PI / 2;
    const distance = (value / max) * radius;
    const x = center + distance * Math.cos(angle);
    const y = center + distance * Math.sin(angle);
    return { x, y };
  };

  // 生成同心多边形
  const levels = [1, 2, 3, 4, 5];

  const targetLenses = compareLenses && compareLenses.length > 0
    ? compareLenses
    : lens
    ? [lens]
    : [];

  return (
    <div className="flex flex-col items-center justify-center">
      <svg width={size} height={size} className="overflow-visible select-none">
        {/* 背景同心网格 */}
        {levels.map((level) => {
          const points = METRICS.map((_, i) => {
            const { x, y } = getCoordinates(i, level, 5);
            return `${x},${y}`;
          }).join(' ');

          return (
            <polygon
              key={`level-${level}`}
              points={points}
              className="fill-none stroke-slate-200 dark:stroke-slate-800"
              strokeWidth="1"
              strokeDasharray={level < 5 ? '2,2' : undefined}
            />
          );
        })}

        {/* 放射轴线 */}
        {METRICS.map((_, i) => {
          const { x, y } = getCoordinates(i, 5, 5);
          return (
            <line
              key={`axis-${i}`}
              x1={center}
              y1={center}
              x2={x}
              y2={y}
              className="stroke-slate-200 dark:stroke-slate-800"
              strokeWidth="1"
            />
          );
        })}

        {/* 数据多边形渲染 */}
        {targetLenses.map((target, lIdx) => {
          const color = COMPARE_COLORS[lIdx % COMPARE_COLORS.length];
          const points = METRICS.map((m, i) => {
            const val = (target[m.key as keyof Lens] as number) || 0;
            const { x, y } = getCoordinates(i, Math.min(val, m.max), m.max);
            return `${x},${y}`;
          }).join(' ');

          return (
            <g key={target.id || lIdx}>
              <polygon
                points={points}
                fill={color.fill}
                stroke={color.stroke}
                strokeWidth="2"
                className="transition-all duration-300"
              />
              {METRICS.map((m, i) => {
                const val = (target[m.key as keyof Lens] as number) || 0;
                const { x, y } = getCoordinates(i, Math.min(val, m.max), m.max);
                return (
                  <circle
                    key={`dot-${lIdx}-${i}`}
                    cx={x}
                    cy={y}
                    r="3.5"
                    fill={color.stroke}
                    className="stroke-white dark:stroke-slate-900"
                    strokeWidth="1.5"
                  />
                );
              })}
            </g>
          );
        })}

        {/* 维度文字标签 */}
        {METRICS.map((m, i) => {
          const angle = i * angleStep - Math.PI / 2;
          const labelDist = radius + 22;
          const lx = center + labelDist * Math.cos(angle);
          const ly = center + labelDist * Math.sin(angle);

          return (
            <text
              key={`label-${i}`}
              x={lx}
              y={ly}
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-[11px] font-medium fill-slate-600 dark:fill-slate-300"
            >
              {m.labelZh}
            </text>
          );
        })}
      </svg>
    </div>
  );
};
