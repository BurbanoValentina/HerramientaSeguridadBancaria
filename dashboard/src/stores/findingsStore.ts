import { create } from 'zustand';
import { findingsApi } from '../api/client';

export interface Finding {
  id: string;
  filepath: string;
  category: string;
  severity: string;
  risk_score: number;
  masked_snippet?: string;
  remediated: boolean;
  created_at: string;
}

interface FindingsStore {
  findings: Finding[];
  loading: boolean;
  error: string | null;
  fetchSummary: () => Promise<void>;
  remediate: (id: string) => Promise<void>;
}

const useFindingsStore = create<FindingsStore>((set, get) => ({
  findings: [],
  loading: false,
  error: null,

  fetchSummary: async () => {
    set({ loading: true, error: null });
    try {
      const data = await findingsApi.list();
      set({ findings: data, loading: false });
    } catch {
      set({
        loading: false,
        error: 'No se pudo cargar hallazgos. Arranca la API con uvicorn en el puerto 8000.',
      });
    }
  },

  remediate: async (id: string) => {
    await findingsApi.remediate(id);
    set({
      findings: get().findings.map((f) => (f.id === id ? { ...f, remediated: true } : f)),
    });
  },

}));

export default useFindingsStore;
