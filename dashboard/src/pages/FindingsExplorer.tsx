import { useEffect, useState } from 'react';
import clsx from 'clsx';
import useFindingsStore from '../stores/findingsStore';
import FindingsTable from '../components/FindingsTable';

export default function FindingsExplorer() {
  const { findings, loading, error, fetchSummary, remediate } = useFindingsStore();
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => {
    void fetchSummary();
  }, []);

  const handleRemediate = async (id: string) => {
    setBusyId(id);
    try {
      await remediate(id);
    } catch {
      // El store ya no expone el error granular; refrescar sirve ante fallos parciales
      await fetchSummary();
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Hallazgos</h1>
          <p className="mt-1 text-sm text-slate-400">
            Detecciones con snippets enmascarados; marca como remedido cuando corresponda
          </p>
        </div>
        <button
          type="button"
          disabled={loading}
          onClick={() => void fetchSummary()}
          className={clsx(
            'rounded-xl px-4 py-2 text-sm font-semibold ring-1 transition-all',
            'bg-slate-900/80 text-slate-100 ring-slate-700 hover:bg-slate-800',
            loading && 'opacity-70'
          )}
        >
          {loading ? 'Cargando…' : 'Recargar'}
        </button>
      </div>

      {error ? (
        <div
          role="alert"
          className="rounded-2xl border border-rose-500/35 bg-rose-950/30 px-4 py-4 text-sm text-rose-100"
        >
          {error}
        </div>
      ) : null}

      <FindingsTable
        findings={findings}
        onRemediate={handleRemediate}
        remediateBusyId={busyId}
      />
    </div>
  );
}
