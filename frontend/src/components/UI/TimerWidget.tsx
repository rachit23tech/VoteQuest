'use client';

interface TimerWidgetProps {
  secondsLeft: number;
  totalSeconds: number;
  formattedTime: string;
}

export function TimerWidget({ secondsLeft, totalSeconds, formattedTime }: TimerWidgetProps) {
  const pct = secondsLeft / totalSeconds;
  const isUrgent = pct <= 0.2;
  const isWarning = pct <= 0.5;

  const color = isUrgent ? '#E81B23' : isWarning ? '#FFB81C' : '#0066CC';

  return (
    <div
      className="flex items-center gap-3 bg-white rounded-xl px-4 py-2 shadow border"
      style={{ borderColor: color }}
    >
      <span className="text-xl">{isUrgent ? '⚠️' : '⏱️'}</span>
      <div className="flex flex-col items-center min-w-[60px]">
        <span
          className="text-2xl font-mono font-bold leading-none"
          style={{ color, fontVariantNumeric: 'tabular-nums' }}
        >
          {formattedTime}
        </span>
        {/* Progress bar */}
        <div className="w-full h-1 bg-slate-200 rounded-full mt-1 overflow-hidden">
          <div
            className="h-1 rounded-full transition-all duration-1000"
            style={{ width: `${pct * 100}%`, backgroundColor: color }}
          />
        </div>
      </div>
    </div>
  );
}
