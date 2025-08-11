-- Initial Laser schema migration
-- Created: 2025-01-11
-- Debt Collection and Buyback System Schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Clients table
CREATE TABLE clients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_name TEXT NOT NULL,
    client_type TEXT NOT NULL CHECK (client_type IN ('debt_buyer', 'debt_seller', 'collection_agency', 'debt_settlement')),
    contact_person TEXT,
    email TEXT NOT NULL,
    phone TEXT,
    address JSONB,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending_review')),
    feature_access TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Portfolios table
CREATE TABLE portfolios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    debt_seller_client_id UUID NOT NULL REFERENCES clients(id),
    purchase_date DATE NOT NULL,
    purchase_price DECIMAL(15,2),
    original_face_value DECIMAL(15,2),
    account_count INTEGER DEFAULT 0,
    status TEXT DEFAULT 'pending_scrub' CHECK (status IN ('active_collections', 'closed', 'in_review', 'pending_scrub')),
    kpis JSONB DEFAULT '{}',
    top_states JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Debts table
CREATE TABLE debts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    portfolio_id UUID NOT NULL REFERENCES portfolios(id),
    debtor_id TEXT NOT NULL,
    original_account_number TEXT,
    original_creditor TEXT,
    current_balance DECIMAL(15,2) NOT NULL,
    original_balance DECIMAL(15,2),
    charge_off_date DATE,
    last_payment_date DATE,
    last_payment_amount DECIMAL(15,2),
    debtor_info JSONB DEFAULT '{}',
    status TEXT DEFAULT 'active_internal' CHECK (status IN ('active_internal', 'placed_external', 'resolved_paid', 'resolved_settled', 'uncollectible_bankruptcy', 'uncollectible_deceased', 'action_cease_desist', 'buyback_pending', 'buyback_approved', 'buyback_declined')),
    assigned_agency_id UUID REFERENCES clients(id),
    placement_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Saved searches table
CREATE TABLE saved_searches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    query_parameters JSONB NOT NULL,
    column_configuration JSONB,
    shared_with TEXT[] DEFAULT '{}',
    created_by TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notifications table
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'error', 'action_required')),
    category TEXT CHECK (category IN ('placement', 'payment', 'scrub', 'buyback', 'remittance', 'system_alert', 'shared_search')),
    recipient_email TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    related_entity_link TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Account notes table
CREATE TABLE account_notes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    debtor_id TEXT NOT NULL,
    note_type TEXT NOT NULL CHECK (note_type IN ('general', 'payment', 'contact', 'legal', 'bankruptcy', 'cease_desist', 'deceased')),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    is_internal BOOLEAN DEFAULT TRUE,
    follow_up_date DATE,
    created_by TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payments table
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    debtor_id TEXT NOT NULL,
    payment_amount DECIMAL(15,2) NOT NULL,
    payment_date DATE NOT NULL,
    payment_method TEXT NOT NULL CHECK (payment_method IN ('credit_card', 'debit_card', 'ach', 'check', 'money_order', 'cash')),
    payment_type TEXT NOT NULL CHECK (payment_type IN ('full_settlement', 'partial_payment', 'payment_plan', 'lump_sum')),
    reference_number TEXT,
    processed_by TEXT,
    notes TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processed', 'failed', 'refunded')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payment plans table
CREATE TABLE payment_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    debtor_id TEXT NOT NULL,
    plan_name TEXT NOT NULL,
    total_amount DECIMAL(15,2) NOT NULL,
    monthly_payment DECIMAL(15,2) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    payment_day INTEGER NOT NULL CHECK (payment_day BETWEEN 1 AND 31),
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'defaulted', 'cancelled')),
    payments_made INTEGER DEFAULT 0,
    total_payments INTEGER,
    next_payment_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- File upload templates table
CREATE TABLE file_upload_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    template_name TEXT NOT NULL,
    description TEXT,
    file_format TEXT NOT NULL CHECK (file_format IN ('csv', 'xlsx', 'txt', 'xls')),
    field_mappings JSONB NOT NULL,
    default_portfolio_id UUID REFERENCES portfolios(id),
    default_client_id UUID REFERENCES clients(id),
    validation_rules JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- File uploads table
CREATE TABLE file_uploads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    file_name TEXT NOT NULL,
    file_size INTEGER,
    file_format TEXT NOT NULL CHECK (file_format IN ('csv', 'xlsx', 'txt', 'xls')),
    template_id UUID REFERENCES file_upload_templates(id),
    portfolio_id UUID NOT NULL REFERENCES portfolios(id),
    client_id UUID NOT NULL REFERENCES clients(id),
    upload_status TEXT DEFAULT 'uploading' CHECK (upload_status IN ('uploading', 'processing', 'mapping', 'validating', 'importing', 'completed', 'failed')),
    total_records INTEGER,
    processed_records INTEGER,
    failed_records INTEGER,
    validation_errors JSONB DEFAULT '[]',
    import_summary JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Widgets table
CREATE TABLE widgets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    widget_type TEXT NOT NULL CHECK (widget_type IN ('portfolio_overview', 'alerts_notifications', 'recent_activity', 'kpi_summary', 'scrub_status', 'collection_performance')),
    title TEXT NOT NULL,
    position JSONB NOT NULL,
    config JSONB,
    is_visible BOOLEAN DEFAULT TRUE,
    refresh_interval INTEGER DEFAULT 300,
    user_email TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Media files table
CREATE TABLE media_files (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    file_name TEXT NOT NULL,
    file_type TEXT NOT NULL CHECK (file_type IN ('pdf', 'jpg', 'png', 'doc', 'docx', 'txt', 'csv')),
    file_size INTEGER,
    file_url TEXT NOT NULL,
    portfolio_id UUID NOT NULL REFERENCES portfolios(id),
    debtor_id TEXT,
    category TEXT CHECK (category IN ('legal_document', 'correspondence', 'payment_proof', 'identity_verification', 'medical_records', 'other')),
    upload_method TEXT CHECK (upload_method IN ('manual_upload', 'batch_import', 'vendor_submission')),
    vendor_source TEXT,
    status TEXT DEFAULT 'pending_association' CHECK (status IN ('pending_association', 'associated', 'duplicate', 'error')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Scrub jobs table
CREATE TABLE scrub_jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    portfolio_id UUID NOT NULL REFERENCES portfolios(id),
    vendor_sequence JSONB NOT NULL,
    total_accounts INTEGER NOT NULL,
    processed_accounts INTEGER DEFAULT 0,
    results_summary JSONB DEFAULT '{}',
    status TEXT DEFAULT 'queued' CHECK (status IN ('queued', 'processing', 'completed', 'failed', 'cancelled')),
    cost_estimate DECIMAL(15,2),
    actual_cost DECIMAL(15,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Activity logs table
CREATE TABLE activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    activity_type TEXT NOT NULL CHECK (activity_type IN ('saved_search', 'created_placement', 'updated_debt_status', 'added_note', 'uploaded_file', 'scrub_initiated', 'payment_recorded')),
    description TEXT NOT NULL,
    entity_type TEXT NOT NULL CHECK (entity_type IN ('debt', 'portfolio', 'client', 'search', 'payment', 'scrub_job')),
    entity_id TEXT,
    metadata JSONB,
    user_email TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Buy backs table
CREATE TABLE buy_backs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    debtor_id TEXT NOT NULL,
    portfolio_id UUID NOT NULL REFERENCES portfolios(id),
    collection_agency_id UUID REFERENCES clients(id),
    trigger_reason TEXT NOT NULL CHECK (trigger_reason IN ('bankruptcy_found', 'deceased_found', 'cease_desist', 'agency_request', 'manual_review')),
    trigger_source TEXT NOT NULL CHECK (trigger_source IN ('scrub_result', 'agency_update', 'manual_entry')),
    trigger_date DATE NOT NULL,
    current_balance DECIMAL(15,2) NOT NULL,
    original_placement_amount DECIMAL(15,2),
    collections_to_date DECIMAL(15,2),
    status TEXT DEFAULT 'pending_review' CHECK (status IN ('pending_review', 'under_review', 'approved', 'declined', 'completed')),
    bayview_decision TEXT DEFAULT 'pending' CHECK (bayview_decision IN ('pending', 'approved', 'declined')),
    bayview_reason TEXT,
    agency_comments TEXT,
    supporting_documents TEXT[] DEFAULT '{}',
    review_deadline DATE,
    reviewed_by TEXT,
    reviewed_date DATE,
    buyback_amount DECIMAL(15,2),
    is_frozen BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Remittances table
CREATE TABLE remittances (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    collection_agency_id UUID NOT NULL REFERENCES clients(id),
    agency_name TEXT NOT NULL,
    submission_date DATE NOT NULL,
    period_start_date DATE,
    period_end_date DATE,
    file_url TEXT,
    total_collected DECIMAL(15,2) NOT NULL,
    commission_rate DECIMAL(5,4),
    commission_amount DECIMAL(15,2),
    net_remittance DECIMAL(15,2) NOT NULL,
    status TEXT DEFAULT 'pending_verification' CHECK (status IN ('pending_verification', 'verified', 'exceptions_found', 'accepted', 'paid')),
    exception_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Remittance exceptions table
CREATE TABLE remittance_exceptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    remittance_id UUID NOT NULL REFERENCES remittances(id),
    debtor_id TEXT NOT NULL,
    payment_amount DECIMAL(15,2),
    exception_type TEXT NOT NULL CHECK (exception_type IN ('unauthorized_collection', 'incorrect_amount', 'account_frozen', 'account_not_placed')),
    description TEXT,
    status TEXT DEFAULT 'open' CHECK (status IN ('open', 'resolved', 'disputed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notification configs table
CREATE TABLE notification_configs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    notification_type TEXT NOT NULL CHECK (notification_type IN ('payment_received', 'placement_created', 'remit_submitted', 'buy_back_triggered', 'scrub_completed', 'file_uploaded', 'account_updated', 'bankruptcy_found', 'deceased_found', 'cease_desist_received')),
    recipient_type TEXT NOT NULL CHECK (recipient_type IN ('bayview_user', 'collection_agency', 'debt_seller_client')),
    delivery_method TEXT[] NOT NULL,
    is_enabled BOOLEAN DEFAULT TRUE,
    template_content JSONB,
    conditions JSONB,
    frequency_limit TEXT DEFAULT 'immediate' CHECK (frequency_limit IN ('immediate', 'daily_digest', 'weekly_digest', 'once_per_event')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Letter templates table
CREATE TABLE letter_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    template_name TEXT NOT NULL,
    template_type TEXT NOT NULL CHECK (template_type IN ('initial_demand', 'second_notice', 'final_notice', 'settlement_offer', 'payment_plan_offer', 'bankruptcy_notice', 'deceased_notice', 'cease_desist_response', 'validation_letter')),
    subject TEXT,
    content TEXT NOT NULL,
    variables JSONB DEFAULT '[]',
    letterhead_config JSONB,
    footer_content TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    compliance_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Debt statuses table
CREATE TABLE debt_statuses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    status_code TEXT NOT NULL UNIQUE,
    status_name TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('active', 'placed', 'resolved', 'uncollectible', 'legal_action', 'special_handling')),
    can_collect BOOLEAN DEFAULT TRUE,
    can_place BOOLEAN DEFAULT TRUE,
    requires_approval BOOLEAN DEFAULT FALSE,
    next_action_required TEXT,
    color_code TEXT,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_debts_portfolio_id ON debts(portfolio_id);
CREATE INDEX idx_debts_debtor_id ON debts(debtor_id);
CREATE INDEX idx_debts_status ON debts(status);
CREATE INDEX idx_portfolios_client_id ON portfolios(debt_seller_client_id);
CREATE INDEX idx_payments_debtor_id ON payments(debtor_id);
CREATE INDEX idx_account_notes_debtor_id ON account_notes(debtor_id);
CREATE INDEX idx_buy_backs_debtor_id ON buy_backs(debtor_id);
CREATE INDEX idx_buy_backs_status ON buy_backs(status);
CREATE INDEX idx_notifications_recipient ON notifications(recipient_email);
CREATE INDEX idx_activity_logs_entity ON activity_logs(entity_type, entity_id);

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_portfolios_updated_at BEFORE UPDATE ON portfolios FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_debts_updated_at BEFORE UPDATE ON debts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_saved_searches_updated_at BEFORE UPDATE ON saved_searches FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_notifications_updated_at BEFORE UPDATE ON notifications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_account_notes_updated_at BEFORE UPDATE ON account_notes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payment_plans_updated_at BEFORE UPDATE ON payment_plans FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_file_upload_templates_updated_at BEFORE UPDATE ON file_upload_templates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_file_uploads_updated_at BEFORE UPDATE ON file_uploads FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_widgets_updated_at BEFORE UPDATE ON widgets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_media_files_updated_at BEFORE UPDATE ON media_files FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_scrub_jobs_updated_at BEFORE UPDATE ON scrub_jobs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_buy_backs_updated_at BEFORE UPDATE ON buy_backs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_remittances_updated_at BEFORE UPDATE ON remittances FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_remittance_exceptions_updated_at BEFORE UPDATE ON remittance_exceptions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_notification_configs_updated_at BEFORE UPDATE ON notification_configs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_letter_templates_updated_at BEFORE UPDATE ON letter_templates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_debt_statuses_updated_at BEFORE UPDATE ON debt_statuses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
