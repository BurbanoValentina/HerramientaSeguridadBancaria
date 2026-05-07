import { scanContent } from '../engine/detection.js';

export async function getRiskReportTool(content: string, filepath?: string) {
  const findings = scanContent(content, filepath);
  const score = findings.reduce((acc, f) => {
    const weights = { critical: 1.0, high: 0.75, medium: 0.5, low: 0.25 };
    return acc + (weights[f.severity as keyof typeof weights] || 0);
  }, 0);

  return {
    riskScore: Math.min(score / Math.max(findings.length, 1), 1.0),
    totalFindings: findings.length,
    breakdown: {
      critical: findings.filter(f => f.severity === 'critical').length,
      high: findings.filter(f => f.severity === 'high').length,
      medium: findings.filter(f => f.severity === 'medium').length,
      low: findings.filter(f => f.severity === 'low').length,
    },
    categories: [...new Set(findings.map(f => f.category))],
    generatedAt: new Date().toISOString()
  };
}
