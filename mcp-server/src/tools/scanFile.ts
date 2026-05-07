import { scanContent, DetectionResult } from '../engine/detection.js';

export async function scanFileTool(content: string, filepath?: string): Promise<{
  findings: DetectionResult[];
  scannedAt: string;
  filepath?: string;
  totalFindings: number;
}> {
  const findings = scanContent(content, filepath);
  return {
    findings,
    scannedAt: new Date().toISOString(),
    filepath,
    totalFindings: findings.length
  };
}
