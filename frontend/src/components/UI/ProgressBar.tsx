'use client';

interface ProgressBarProps {
  current: number;
  total: number;
  label?: string;
  color?: string;
}

export function ProgressBar({ current, total, label, color = '#0066CC' }: ProgressBarProps) {
  const pct = total > 0 ? Math.min((current / total) * 100, 100) : 0;

  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between text-xs text-slate-500 mb-1">
          <span>{label}</span>
          <span>
            {current}/{total}
          </span>
        </div>
      )}
      <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
        <div
          className="h-3 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}
