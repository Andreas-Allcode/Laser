-- Update portfolio types and add sale functionality
-- Created: 2025-01-12

-- Add portfolio type and sale fields
ALTER TABLE portfolios ADD COLUMN IF NOT EXISTS portfolio_type TEXT DEFAULT 'purchased' CHECK (portfolio_type IN ('purchased', 'for_sale'));
ALTER TABLE portfolios ADD COLUMN IF NOT EXISTS sale_status TEXT DEFAULT 'not_for_sale' CHECK (sale_status IN ('not_for_sale', 'for_sale', 'under_review', 'sold'));
ALTER TABLE portfolios ADD COLUMN IF NOT EXISTS asking_price DECIMAL(15,2);
ALTER TABLE portfolios ADD COLUMN IF NOT EXISTS sale_date DATE;
ALTER TABLE portfolios ADD COLUMN IF NOT EXISTS buyer_client_id UUID REFERENCES clients(id);
ALTER TABLE portfolios ADD COLUMN IF NOT EXISTS created_by TEXT;
ALTER TABLE portfolios ADD COLUMN IF NOT EXISTS sale_notes TEXT;

-- Update existing portfolios to be 'purchased' type
UPDATE portfolios SET portfolio_type = 'purchased' WHERE portfolio_type IS NULL;

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_portfolios_type ON portfolios(portfolio_type);
CREATE INDEX IF NOT EXISTS idx_portfolios_sale_status ON portfolios(sale_status);
CREATE INDEX IF NOT EXISTS idx_portfolios_buyer ON portfolios(buyer_client_id);