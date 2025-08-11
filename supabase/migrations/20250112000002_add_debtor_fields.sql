-- Add credit scores and homeowner field to debtor info
-- Created: 2025-01-12

-- Note: These fields are stored in the debtor_info JSONB column
-- No schema changes needed as JSONB is flexible
-- This migration serves as documentation for the new fields:

-- debtor_info will now include:
-- - score_recovery_bankcard (INTEGER)
-- - score_recovery_retail (INTEGER) 
-- - homeowner (BOOLEAN)

-- Add index for homeowner searches
CREATE INDEX IF NOT EXISTS idx_debts_homeowner ON debts USING GIN ((debtor_info->'homeowner'));