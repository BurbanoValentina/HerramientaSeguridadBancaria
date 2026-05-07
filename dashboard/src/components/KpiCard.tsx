import clsx from 'clsx';

interface KpiCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  accent: 'sky' | 'rose' | 'amber' | 'emerald';
}

const accentBorder = {
  sky: 'border-l-sky-500',
  rose: 'border-l-rose-500',
  amber: 'border-l-amber-500',
  emerald: 'border-l-emerald-500',
};

const accentGlow = {
  sky: 'shadow-[inset_0_1px_0_0_theme(colors.sky.500/0.15)]',
  rose: 'shadow-[inset_0_1px_0_0_theme(colors.rose.500/0.15)]',
  amber: 'shadow-[inset_0_1px_0_0_theme(colors.amber.500/0.12)]',
  emerald: 'shadow-[inset_0_1px_0_0_theme(colors.emerald.500/0.12)]',
};

export default function KpiCard({ title, value, subtitle, accent }: KpiCardProps) {
  return (
    <div
      className={clsx(
        'rounded-2xl border border-slate-800/80 bg-slate-900/30 p-5 border-l-4 backdrop-blur-sm',
        accentBorder[accent],
        accentGlow[accent]
      )}
    >
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{title}</p>
      <p className="mt-2 text-3xl font-bold tabular-nums tracking-tight text-white">{value}</p>
      {subtitle ? (
        <p className="mt-2 text-xs text-slate-500">{subtitle}</p>
      ) : (
        <div className="mt-2 h-4" />
      )}
    </div>
  );
}
