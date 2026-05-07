-- BankGuard database initialization
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Audit findings table
CREATE TABLE IF NOT EXISTS audit_findings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id VARCHAR NOT NULL,
    user_id VARCHAR,
    repository VARCHAR,
    filepath VARCHAR NOT NULL,
    category VARCHAR NOT NULL,
    severity VARCHAR NOT NULL,
    risk_score FLOAT NOT NULL,
    line_number INTEGER,
    masked_snippet TEXT,
    pattern_id VARCHAR,
    metadata JSONB,
    remediated BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Detection rules table
CREATE TABLE IF NOT EXISTS detection_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR NOT NULL,
    category VARCHAR NOT NULL,
    pattern TEXT NOT NULL,
    severity VARCHAR NOT NULL,
    enabled BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Audit logs (immutable)
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    action VARCHAR NOT NULL,
    actor VARCHAR,
    target_id VARCHAR,
    details JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Seed default detection rules
INSERT INTO detection_rules (name, category, pattern, severity) VALUES
('Visa Card', 'payment_card', '4[0-9]{12}(?:[0-9]{3})?', 'critical'),
('Mastercard', 'payment_card', '5[1-5][0-9]{14}', 'critical'),
('SSN', 'pii', '\d{3}-\d{2}-\d{4}', 'critical'),
('IBAN', 'financial', '[A-Z]{2}[0-9]{2}[A-Z0-9]{4}[0-9]{7}', 'high'),
('AWS Key', 'credentials', 'AKIA[0-9A-Z]{16}', 'critical'),
('Email', 'pii', '[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}', 'medium')
ON CONFLICT DO NOTHING;
