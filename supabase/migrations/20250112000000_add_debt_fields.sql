-- Add additional debt fields
-- Created: 2025-01-12

ALTER TABLE debts ADD COLUMN IF NOT EXISTS beam_id TEXT;
ALTER TABLE debts ADD COLUMN IF NOT EXISTS issuer_account_number TEXT;
ALTER TABLE debts ADD COLUMN IF NOT EXISTS seller_account_number TEXT;
ALTER TABLE debts ADD COLUMN IF NOT EXISTS account_open_date DATE;
ALTER TABLE debts ADD COLUMN IF NOT EXISTS total_paid DECIMAL(15,2) DEFAULT 0;
ALTER TABLE debts ADD COLUMN IF NOT EXISTS charge_off_amount DECIMAL(15,2);
ALTER TABLE debts ADD COLUMN IF NOT EXISTS delinquency_date DATE;

-- Add indexes for new fields
CREATE INDEX IF NOT EXISTS idx_debts_beam_id ON debts(beam_id);
CREATE INDEX IF NOT EXISTS idx_debts_account_open_date ON debts(account_open_date);
CREATE INDEX IF NOT EXISTS idx_debts_delinquency_date ON debts(delinquency_date);