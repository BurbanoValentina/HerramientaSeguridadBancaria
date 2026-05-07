import { useEffect, useState } from 'react';
import clsx from 'clsx';
import { rulesApi, type RuleRow } from '../api/client';

export default function RulesManager() {
  const [rules, setRules] = useState<RuleRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    rulesApi
      .list()
      .then(setRules)
      .catch(() => setError('No se pudieron cargar las reglas.'))
      .finally(() => setLoading(false));
  }, []);

  const toggle = async (id: string) => {
    try {
      const updated = (await rulesApi.toggle(id)) as { enabled: boolean };
      setRules((r) => r.map((rule) => (rule.id === id ? { ...rule, enabled: updated.enabled } : rule)));
    } catch {
      setError('Error al cambiar el estado de la regla.');
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Reglas de detección</h1>
        <p className="mt-1 text-sm text-slate-400">Activa o desactiva patrones (reglas auditadas son inmutables en producción)</p>
      </div>

      {error ? (
        <div className="rounded-2xl border border-rose-500/35 bg-rose-950/30 px-4 py-4 text-sm text-rose-100">
          {error}
        </div>
      ) : null}

      <div className="overflow-x-auto rounded-2xl border border-slate-800/90 bg-slate-900/20 ring-1 ring-slate-800/60">
        {loading ? (
          <p className="py-14 text-center text-sm text-slate-500">Cargando reglas…</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/60 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                <th className="px-4 py-3">Nombre</th>
                <th className="px-4 py-3">Categoría</th>
                <th className="px-4 py-3">Severidad</th>
                <th className="px-4 py-3">Patrón</th>
                <th className="px-4 py-3 text-right">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {rules.map((r) => (
                <tr key={r.id} className="hover:bg-slate-900/35">
                  <td className="px-4 py-3 font-medium text-slate-100">{r.name}</td>
                  <td className="px-4 py-3 text-slate-400">{r.category}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-md bg-slate-800/80 px-2 py-1 text-xs text-slate-200 ring-1 ring-slate-700">
                      {r.severity}
                    </span>
                  </td>
                  <td className="max-w-xs truncate px-4 py-3 font-mono text-xs text-slate-500">{r.pattern}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => void toggle(r.id)}
                      className={clsx(
                        'rounded-lg px-3 py-1.5 text-xs font-semibold ring-1 transition-colors',
                        r.enabled
                          ? 'bg-emerald-600/85 text-white ring-emerald-500/40 hover:bg-emerald-500'
                          : 'bg-slate-800 text-slate-300 ring-slate-700 hover:bg-slate-700'
                      )}
                    >
                      {r.enabled ? 'Activa' : 'Inactiva'}
                    </button>
                  </td>
                </tr>
              ))}
              {rules.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-14 text-center text-slate-500">
                    No hay reglas cargadas.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
