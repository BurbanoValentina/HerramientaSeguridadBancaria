import { PATTERNS } from '../engine/patterns.js';

export async function maskDataTool(content: string, categories?: string[]): Promise<string> {
  let masked = content;
  const activePatterns = categories
    ? PATTERNS.filter(p => categories.includes(p.category))
    : PATTERNS;

  for (const pattern of activePatterns) {
    const regex = new RegExp(pattern.regex.source, pattern.regex.flags);
    masked = masked.replace(regex, (match) => {
      if (match.length <= 4) return '[REDACTED]';
      return match.substring(0, 2) + '[REDACTED]' + match.substring(match.length - 2);
    });
  }
  return masked;
}
