import { useEffect } from 'react';
import clsx from 'clsx';
import useFindingsStore from '../stores/findingsStore';
import KpiCard from '../components/KpiCard';
import RiskGauge from '../components/RiskGauge';

const CATEGORY_LABELS: Record<string, string> = {
  pii: 'PII',
  credentials: 'Credenciales',
  financial: 'Financiero',
  payment_card: 'Tarjeta',
  health: 'Salud',
};

export default function Dashboard() {
  const { findings, loading, error, fetchSummary } = useFindingsStore();

  useEffect(() => {
    void fetchSummary();
  }, []);

  const criticalCount = findings.filter((f) => f.severity === 'critical').length;
  const activeCount = findings.filter((f) => !f.remediated).length;
  const avgRisk = findings.length
    ? Math.round((findings.reduce((a, f) => a + f.risk_score, 0) / findings.length) * 100)
    : 0;

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Dashboard</h1>
          <p className="mt-1 text-sm text-slate-400">
            Vista consolidada del riesgo de datos sensibles en tus repositorios
          </p>
        </div>
        <button
          type="button"
          disabled={loading}
          onClick={() => void fetchSummary()}
          className={clsx(
            'rounded-xl px-4 py-2 text-sm font-semibold ring-1 transition-all',
            'bg-slate-900/80 text-slate-100 ring-slate-700 hover:bg-slate-800 hover:ring-slate-600',
            loading && 'cursor-wait opacity-70'
          )}
        >
          {loading ? 'Actualizando…' : 'Actualizar'}
        </button>
      </div>

      {error ? (
        <div
          role="alert"
          className="rounded-2xl border border-rose-500/35 bg-rose-950/30 px-4 py-4 text-sm text-rose-100 ring-1 ring-rose-500/20"
        >
          <p className="font-semibold">Error de conexión</p>
          <p className="mt-1 text-rose-200/85">{error}</p>
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <KpiCard title="Hallazgos activos" value={activeCount} subtitle="Sin remediar" accent="sky" />
        <KpiCard title="Críticos abiertos" value={criticalCount} subtitle="Requieren atención" accent="rose" />
        <KpiCard title="Total hallazgos" value={findings.length} subtitle="Histórico en DB" accent="amber" />
        <KpiCard
          title="Riesgo promedio"
          value={findings.length ? `${avgRisk}%` : '—'}
          subtitle="Sobre hallazgos actuales"
          accent="emerald"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <RiskGauge score={avgRisk} loading={loading && !findings.length} />

        <div className="rounded-2xl border border-slate-800/90 bg-slate-900/25 p-6 ring-1 ring-slate-800/60 backdrop-blur-sm">
          <h3 className="font-semibold text-slate-100">Por categoría</h3>
          <p className="mt-1 text-xs text-slate-500">Distribución entre tipos detectados</p>
          <div className="mt-6 space-y-4">
            {['pii', 'credentials', 'financial', 'payment_card', 'health'].map((cat) => {
              const count = findings.filter((f) => f.category === cat).length;
              const pct = findings.length ? Math.round((count / findings.length) * 100) : 0;
              return (
                <div key={cat} className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:gap-3">
                  <span className="w-36 shrink-0 text-sm text-slate-400">{CATEGORY_LABELS[cat] ?? cat}</span>
                  <div className="min-w-0 flex-1">
                    <div className="h-2 overflow-hidden rounded-full bg-slate-800 ring-1 ring-slate-800/80">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-sky-500 transition-[width] duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                  <span className="w-14 shrink-0 tabular-nums text-right text-sm text-slate-300">
                    {count}
                    <span className="ml-1 text-slate-500">({pct}%)</span>
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
