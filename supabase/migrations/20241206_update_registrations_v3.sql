-- Access Code System Migration v3
-- Updates registration fields:
-- - age_range -> age (integer)
-- - adds governorate field
-- - electoral_district now uses dropdown values

-- Drop existing tables and recreate (WARNING: This will delete existing data)
DROP TABLE IF EXISTS access_registrations;
DROP TABLE IF EXISTS access_codes;

-- Access codes table
CREATE TABLE IF NOT EXISTS access_codes (
  id SERIAL PRIMARY KEY,
  code VARCHAR(50) UNIQUE NOT NULL,
  description VARCHAR(255),
  max_uses INTEGER,
  is_active BOOLEAN DEFAULT true,
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Access registrations table with updated fields
CREATE TABLE IF NOT EXISTS access_registrations (
  id SERIAL PRIMARY KEY,
  code_id INTEGER REFERENCES access_codes(id) ON DELETE CASCADE,
  full_name VARCHAR(255) NOT NULL,
  age INTEGER NOT NULL,
  contact_number VARCHAR(50) NOT NULL,
  email_address VARCHAR(255) NOT NULL,
  governorate VARCHAR(100) NOT NULL,
  electoral_district VARCHAR(100) NOT NULL,
  current_address TEXT NOT NULL,
  privacy_consent BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_access_codes_code ON access_codes(code);
CREATE INDEX IF NOT EXISTS idx_access_codes_is_active ON access_codes(is_active);
CREATE INDEX IF NOT EXISTS idx_registrations_code_id ON access_registrations(code_id);
CREATE INDEX IF NOT EXISTS idx_registrations_email ON access_registrations(email_address);
CREATE INDEX IF NOT EXISTS idx_registrations_governorate ON access_registrations(governorate);
CREATE INDEX IF NOT EXISTS idx_registrations_district ON access_registrations(electoral_district);

-- Insert default access code
INSERT INTO access_codes (code, description, is_active)
VALUES ('TOOLKIT-FF-2025', 'FiftyFifty Toolkit 2025 Access Code', true)
ON CONFLICT (code) DO NOTHING;

