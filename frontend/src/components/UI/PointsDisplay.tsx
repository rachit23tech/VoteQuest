'use client';

interface PointsDisplayProps {
  points: number;
  label?: string;
}

export function PointsDisplay({ points, label = 'Points' }: PointsDisplayProps) {
  return (
    <div className="flex items-center gap-2 bg-white rounded-xl px-4 py-2 shadow border border-yellow-200">
      <span className="text-xl">⭐</span>
      <div className="flex flex-col items-center">
        <span className="text-2xl font-bold leading-none text-yellow-600 font-mono">
          {points.toLocaleString()}
        </span>
        <span className="text-xs text-slate-500 leading-none mt-0.5">{label}</span>
      </div>
    </div>
  );
}
