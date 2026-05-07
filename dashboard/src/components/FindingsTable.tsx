import clsx from 'clsx';
import type { FindingRow } from '../api/client';

const severityColor: Record<string, string> = {
  critical: 'text-rose-200 bg-rose-950/50 ring-rose-500/30',
  high: 'text-orange-200 bg-orange-950/45 ring-orange-500/25',
  medium: 'text-amber-200 bg-amber-950/40 ring-amber-500/25',
  low: 'text-emerald-200 bg-emerald-950/40 ring-emerald-500/25',
};

interface FindingsTableProps {
  findings: FindingRow[];
  onRemediate?: (id: string) => Promise<void>;
  remediateBusyId?: string | null;
}

export default function FindingsTable({ findings, onRemediate, remediateBusyId }: FindingsTableProps) {
  if (!findings.length) {
    return (
      <div className="rounded-xl border border-dashed border-slate-800 bg-slate-900/20 py-14 text-center">
        <p className="text-sm font-medium text-slate-300">Sin hallazgos</p>
        <p className="mx-auto mt-2 max-w-sm text-xs text-slate-500">
          Cuando el motor de detección reporte nuevos hallazgos, aparecerán en esta tabla con datos
          enmascarados.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl ring-1 ring-slate-800/80">
      <table className="w-full table-fixed text-sm">
        <thead>
          <tr className="border-b border-slate-800 bg-slate-900/50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
            <th className="px-4 py-3 w-[22%]">Archivo</th>
            <th className="px-4 py-3 w-[12%]">Categoría</th>
            <th className="px-4 py-3 w-[12%]">Severidad</th>
            <th className="px-4 py-3 w-[10%]">Riesgo</th>
            <th className="px-4 py-3 w-[12%]">Estado</th>
            <th className="px-4 py-3 w-[32%]">Snippet</th>
            <th className="px-4 py-3 w-[12%] text-right">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/80">
          {findings.map((f) => (
            <tr key={f.id} className="bg-slate-950/20 hover:bg-slate-900/40 transition-colors">
              <td className="px-4 py-3 font-mono text-xs text-slate-200 truncate" title={f.filepath}>
                {f.filepath}
              </td>
              <td className="px-4 py-3 text-slate-300">{f.category}</td>
              <td className="px-4 py-3">
                <span
                  className={clsx(
                    'inline-flex rounded-md px-2 py-1 text-xs font-semibold ring-1',
                    severityColor[f.severity] ?? 'bg-slate-800 text-slate-200 ring-slate-700'
                  )}
                >
                  {f.severity}
                </span>
              </td>
              <td className="px-4 py-3 tabular-nums text-slate-300">{(f.risk_score * 100).toFixed(0)}%</td>
              <td className="px-4 py-3">
                <span
                  className={clsx(
                    'inline-flex rounded-md px-2 py-1 text-xs font-medium ring-1',
                    f.remediated
                      ? 'bg-emerald-950/50 text-emerald-200 ring-emerald-900/40'
                      : 'bg-rose-950/40 text-rose-200 ring-rose-900/40'
                  )}
                >
                  {f.remediated ? 'Remediado' : 'Activo'}
                </span>
              </td>
              <td className="px-4 py-3">
                {f.masked_snippet ? (
                  <code className="block truncate rounded bg-slate-900/80 px-2 py-1 font-mono text-[11px] text-sky-200/90 ring-1 ring-slate-800">
                    {f.masked_snippet}
                  </code>
                ) : (
                  <span className="text-slate-600">—</span>
                )}
              </td>
              <td className="px-4 py-3 text-right">
                {onRemediate && !f.remediated ? (
                  <button
                    type="button"
                    disabled={remediateBusyId === f.id}
                    onClick={() => onRemediate(f.id)}
                    className="rounded-lg bg-emerald-600/90 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {remediateBusyId === f.id ? '…' : 'Remediar'}
                  </button>
                ) : null}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
