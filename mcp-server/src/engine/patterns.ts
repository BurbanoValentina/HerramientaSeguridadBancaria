export interface Pattern {
  id: string;
  name: string;
  category: string;
  regex: RegExp;
  severity: 'critical' | 'high' | 'medium' | 'low';
}

export const PATTERNS: Pattern[] = [
  {
    id: 'CC_VISA',
    name: 'Visa Card Number',
    category: 'payment_card',
    regex: /\b4[0-9]{12}(?:[0-9]{3})?\b/g,
    severity: 'critical'
  },
  {
    id: 'CC_MASTERCARD',
    name: 'Mastercard Number',
    category: 'payment_card',
    regex: /\b5[1-5][0-9]{14}\b/g,
    severity: 'critical'
  },
  {
    id: 'SSN',
    name: 'Social Security Number',
    category: 'pii',
    regex: /\b\d{3}-\d{2}-\d{4}\b/g,
    severity: 'critical'
  },
  {
    id: 'IBAN',
    name: 'IBAN',
    category: 'financial',
    regex: /\b[A-Z]{2}[0-9]{2}[A-Z0-9]{4}[0-9]{7}([A-Z0-9]?){0,16}\b/g,
    severity: 'high'
  },
  {
    id: 'API_KEY',
    name: 'Generic API Key',
    category: 'credentials',
    regex: /(?:api[_-]?key|apikey|api[_-]?secret)\s*[:=]\s*["']?([A-Za-z0-9_\-]{20,})["']?/gi,
    severity: 'high'
  },
  {
    id: 'AWS_KEY',
    name: 'AWS Access Key',
    category: 'credentials',
    regex: /AKIA[0-9A-Z]{16}/g,
    severity: 'critical'
  },
  {
    id: 'EMAIL',
    name: 'Email Address',
    category: 'pii',
    regex: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
    severity: 'medium'
  },
  {
    id: 'PHONE',
    name: 'Phone Number',
    category: 'pii',
    regex: /\b(\+?1?\s?)?(\(?\d{3}\)?[\s.-]?)(\d{3}[\s.-]?\d{4})\b/g,
    severity: 'low'
  }
];
