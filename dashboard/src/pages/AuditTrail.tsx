import { useEffect, useState } from 'react';
import { auditApi, type AuditRow } from '../api/client';

export default function AuditTrail() {
  const [logs, setLogs] = useState<AuditRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    auditApi
      .list()
      .then((data) => {
        if (!cancelled) setLogs(data);
      })
      .catch(() => {
        if (!cancelled) setError('No se pudieron cargar los logs de auditoría.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Auditoría</h1>
        <p className="mt-1 text-sm text-slate-400">Últimos 200 eventos (registro solo append)</p>
      </div>

      {error ? (
        <div className="rounded-2xl border border-rose-500/35 bg-rose-950/30 px-4 py-4 text-sm text-rose-100">
          {error}
        </div>
      ) : null}

      <div className="overflow-hidden rounded-2xl border border-slate-800/90 bg-slate-900/20 ring-1 ring-slate-800/60">
        {loading ? (
          <p className="py-14 text-center text-sm text-slate-500">Cargando auditoría…</p>
        ) : logs.length === 0 ? (
          <p className="py-14 text-center text-sm text-slate-500">Aún no hay eventos registrados.</p>
        ) : (
          <ul className="divide-y divide-slate-800/80">
            {logs.map((log) => (
              <li
                key={log.id}
                className="flex flex-wrap items-baseline gap-x-4 gap-y-2 px-4 py-3 text-sm hover:bg-slate-900/40"
              >
                <time className="font-mono text-xs text-slate-500">{new Date(log.created_at).toLocaleString('es')}</time>
                <span className="rounded-md bg-sky-950/55 px-2 py-1 text-xs font-semibold uppercase tracking-wide text-sky-200 ring-1 ring-sky-800/60">
                  {log.action}
                </span>
                <span className="text-slate-300">{log.actor ?? 'sistema'}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
