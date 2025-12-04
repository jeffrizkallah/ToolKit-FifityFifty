-- Access Code System Migration
-- Run this SQL in your Neon console to create the access code tables

-- Access codes (multi-use, can be linked to events/workshops)
CREATE TABLE IF NOT EXISTS access_codes (
  id SERIAL PRIMARY KEY,
  code VARCHAR(50) UNIQUE NOT NULL,
  description VARCHAR(255),
  max_uses INTEGER,
  is_active BOOLEAN DEFAULT true,
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- User registrations (one per person who enters a code)
CREATE TABLE IF NOT EXISTS access_registrations (
  id SERIAL PRIMARY KEY,
  code_id INTEGER REFERENCES access_codes(id) ON DELETE CASCADE,
  full_name VARCHAR(255) NOT NULL,
  age_range VARCHAR(50) NOT NULL,
  contact_number VARCHAR(50) NOT NULL,
  email_address VARCHAR(255) NOT NULL,
  electoral_district VARCHAR(255) NOT NULL,
  current_address TEXT NOT NULL,
  privacy_consent BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_access_codes_code ON access_codes(code);
CREATE INDEX IF NOT EXISTS idx_access_codes_is_active ON access_codes(is_active);
CREATE INDEX IF NOT EXISTS idx_registrations_code_id ON access_registrations(code_id);
CREATE INDEX IF NOT EXISTS idx_registrations_email ON access_registrations(email_address);
CREATE INDEX IF NOT EXISTS idx_registrations_district ON access_registrations(electoral_district);

