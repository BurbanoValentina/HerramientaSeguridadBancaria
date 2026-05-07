import axios from 'axios';

export interface FindingRow {
  id: string;
  filepath: string;
  category: string;
  severity: string;
  risk_score: number;
  masked_snippet?: string;
  remediated: boolean;
  created_at: string;
}

export interface RuleRow {
  id: string;
  name: string;
  category: string;
  pattern: string;
  severity: string;
  enabled: boolean;
}

export interface AuditRow {
  id: string;
  action: string;
  actor: string | null;
  created_at: string;
}

const client = axios.create({
  baseURL: '/api/v1',
  headers: { 'Content-Type': 'application/json' },
});

export const findingsApi = {
  list: () => client.get<FindingRow[]>('findings/').then((r) => r.data),
  remediate: (id: string) => client.patch(`findings/${id}/remediate`, {}).then((r) => r.data),
};

export const rulesApi = {
  list: () => client.get<RuleRow[]>('rules/').then((r) => r.data),
  create: (rule: object) => client.post('rules/', rule).then((r) => r.data),
  toggle: (id: string) => client.patch(`rules/${id}/toggle`).then((r) => r.data),
};

export const auditApi = {
  list: () => client.get<AuditRow[]>('audit/').then((r) => r.data),
};

export default client;
