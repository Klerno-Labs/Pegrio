-- ========================================
-- VERCEL POSTGRES DATABASE SCHEMA
-- Stores all quote submissions and customer data
-- ========================================

-- Create quotes table
CREATE TABLE IF NOT EXISTS quotes (
    id SERIAL PRIMARY KEY,

    -- Customer Information
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    business_name VARCHAR(255),
    phone VARCHAR(50),

    -- Quote Details
    package VARCHAR(100) NOT NULL,
    package_price INTEGER NOT NULL, -- in cents
    payment_type VARCHAR(50) NOT NULL, -- 'full', 'deposit', 'installment'
    message TEXT,

    -- Payment Information
    stripe_session_id VARCHAR(255),
    stripe_payment_intent_id VARCHAR(255),
    payment_status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'paid', 'failed', 'refunded'
    amount_paid INTEGER, -- in cents

    -- Metadata
    source VARCHAR(100), -- 'website', 'referral', etc.
    utm_source VARCHAR(100),
    utm_medium VARCHAR(100),
    utm_campaign VARCHAR(100),
    ip_address VARCHAR(45),
    user_agent TEXT,

    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    paid_at TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_quotes_email ON quotes(customer_email);
CREATE INDEX IF NOT EXISTS idx_quotes_status ON quotes(payment_status);
CREATE INDEX IF NOT EXISTS idx_quotes_created_at ON quotes(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_quotes_stripe_session ON quotes(stripe_session_id);

-- Create projects table (for future Phase 3)
CREATE TABLE IF NOT EXISTS projects (
    id SERIAL PRIMARY KEY,
    quote_id INTEGER REFERENCES quotes(id),

    -- Project Details
    project_name VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'discovery', -- 'discovery', 'design', 'development', 'testing', 'launched'

    -- Timeline
    estimated_completion DATE,
    actual_completion DATE,

    -- Files
    design_files TEXT[], -- Array of file URLs
    source_code_url VARCHAR(500),
    live_site_url VARCHAR(500),

    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create contacts table (for email marketing)
CREATE TABLE IF NOT EXISTS contacts (
    id SERIAL PRIMARY KEY,

    -- Contact Information
    email VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    business_name VARCHAR(255),
    phone VARCHAR(50),

    -- Segmentation
    lead_source VARCHAR(100), -- 'quote', 'lead-magnet', 'newsletter', etc.
    tags TEXT[], -- Array of tags

    -- Email Marketing
    convertkit_subscriber_id VARCHAR(100),
    email_status VARCHAR(50) DEFAULT 'subscribed', -- 'subscribed', 'unsubscribed', 'bounced'

    -- Engagement
    last_email_opened_at TIMESTAMP,
    last_link_clicked_at TIMESTAMP,

    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for contacts
CREATE INDEX IF NOT EXISTS idx_contacts_email ON contacts(email);
CREATE INDEX IF NOT EXISTS idx_contacts_lead_source ON contacts(lead_source);

-- Create admin users table (simple authentication)
CREATE TABLE IF NOT EXISTS admin_users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL, -- bcrypt hash
    email VARCHAR(255),
    role VARCHAR(50) DEFAULT 'admin', -- 'admin', 'viewer'
    last_login_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default admin user (password: 'changeme123' - MUST BE CHANGED!)
-- Run this manually after setup with a secure password
-- INSERT INTO admin_users (username, password_hash, email, role)
-- VALUES ('admin', '$2b$10$HASH_HERE', 'your-email@example.com', 'admin');

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_quotes_updated_at BEFORE UPDATE ON quotes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contacts_updated_at BEFORE UPDATE ON contacts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- EXAMPLE QUERIES
-- ========================================

-- Get all pending quotes
-- SELECT * FROM quotes WHERE payment_status = 'pending' ORDER BY created_at DESC;

-- Get all paid quotes in last 30 days
-- SELECT * FROM quotes WHERE payment_status = 'paid' AND created_at > NOW() - INTERVAL '30 days';

-- Get total revenue
-- SELECT SUM(amount_paid) / 100.0 AS total_revenue FROM quotes WHERE payment_status = 'paid';

-- Get conversion rate
-- SELECT
--     COUNT(*) FILTER (WHERE payment_status = 'paid') * 100.0 / COUNT(*) AS conversion_rate
-- FROM quotes;

-- Get popular packages
-- SELECT package, COUNT(*) as count FROM quotes GROUP BY package ORDER BY count DESC;

-- Get quotes by date
-- SELECT DATE(created_at) as date, COUNT(*) as quotes, SUM(amount_paid) / 100.0 as revenue
-- FROM quotes
-- GROUP BY DATE(created_at)
-- ORDER BY date DESC;
