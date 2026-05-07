import { PATTERNS, Pattern } from './patterns.js';

export interface DetectionResult {
  patternId: string;
  patternName: string;
  category: string;
  severity: string;
  lineNumber?: number;
  maskedSnippet: string;
  count: number;
}

function maskMatch(input: string, match: string): string {
  if (match.length <= 4) return '*'.repeat(match.length);
  return match.substring(0, 2) + '*'.repeat(match.length - 4) + match.substring(match.length - 2);
}

export function scanContent(content: string, filepath?: string): DetectionResult[] {
  const results: DetectionResult[] = [];
  const lines = content.split('\n');

  for (const pattern of PATTERNS) {
    const regex = new RegExp(pattern.regex.source, pattern.regex.flags);
    let globalMatch;
    const matches: { match: string; line: number }[] = [];

    for (let i = 0; i < lines.length; i++) {
      const lineRegex = new RegExp(pattern.regex.source, pattern.regex.flags.replace('g', '') + 'g');
      let m;
      while ((m = lineRegex.exec(lines[i])) !== null) {
        matches.push({ match: m[0], line: i + 1 });
      }
    }

    if (matches.length > 0) {
      results.push({
        patternId: pattern.id,
        patternName: pattern.name,
        category: pattern.category,
        severity: pattern.severity,
        lineNumber: matches[0].line,
        maskedSnippet: maskMatch(matches[0].match, matches[0].match),
        count: matches.length
      });
    }
  }

  return results;
}
