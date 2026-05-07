import clsx from 'clsx';

interface RiskGaugeProps {
  score: number;
  loading?: boolean;
}

export default function RiskGauge({ score, loading }: RiskGaugeProps) {
  const tone = score > 75 ? 'rose' : score > 50 ? 'amber' : 'emerald';
  const strokeClass =
    tone === 'rose'
      ? 'stroke-rose-500'
      : tone === 'amber'
        ? 'stroke-amber-500'
        : 'stroke-emerald-500';
  const textClass =
    tone === 'rose' ? 'text-rose-300' : tone === 'amber' ? 'text-amber-300' : 'text-emerald-300';

  const dash = `${Math.min(score, 100) * 2.51} 251`;

  return (
    <div className="rounded-2xl border border-slate-800/90 bg-slate-900/25 p-6 ring-1 ring-slate-800/60 backdrop-blur-sm">
      <h3 className="font-semibold text-slate-100">Índice de riesgo global</h3>
      <p className="mt-1 text-xs text-slate-500">Media de puntajes de hallazgos (0–100)</p>
      <div className="mt-8 flex items-center justify-center">
        <div className="relative h-44 w-44">
          {loading ? (
            <div className="flex h-full items-center justify-center text-sm text-slate-500">…</div>
          ) : (
            <>
              <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
                <circle cx="50" cy="50" r="40" fill="none" className="stroke-slate-800" strokeWidth="10" />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  className={clsx(strokeClass, 'transition-[stroke-dasharray] duration-700 ease-out')}
                  strokeWidth="10"
                  strokeDasharray={dash}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className={clsx('text-4xl font-bold tabular-nums tracking-tight', textClass)}>{score}</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
