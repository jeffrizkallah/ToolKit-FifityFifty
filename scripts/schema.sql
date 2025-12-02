-- FiftyFifty ToolKit Database Schema
-- Run this SQL in your Neon console to create the database tables

-- Enable UUID extension (optional, for future use)
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- Phases Table
-- ============================================================================
CREATE TABLE IF NOT EXISTS phases (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  title_ar VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  description_ar TEXT,
  "order" INTEGER NOT NULL DEFAULT 0,
  phase_number INTEGER NOT NULL,
  header_video_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- Modules Table
-- ============================================================================
CREATE TABLE IF NOT EXISTS modules (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  title_ar VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  summary TEXT,
  summary_ar TEXT,
  video_url VARCHAR(500),
  video_duration VARCHAR(50),
  video_subtitle_url_en VARCHAR(500),
  video_subtitle_url_ar VARCHAR(500),
  key_takeaways TEXT,
  key_takeaways_ar TEXT,
  "order" INTEGER NOT NULL DEFAULT 0,
  phase_id INTEGER REFERENCES phases(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- Resources Table
-- ============================================================================
CREATE TABLE IF NOT EXISTS resources (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  title_ar VARCHAR(255) NOT NULL,
  description TEXT,
  description_ar TEXT,
  file_url VARCHAR(500),
  file_type VARCHAR(50) NOT NULL DEFAULT 'PDF',
  file_size VARCHAR(50),
  "order" INTEGER NOT NULL DEFAULT 0,
  module_id INTEGER REFERENCES modules(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- Testimonials Table
-- ============================================================================
CREATE TABLE IF NOT EXISTS testimonials (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  name_ar VARCHAR(255) NOT NULL,
  quote TEXT NOT NULL,
  quote_ar TEXT NOT NULL,
  role VARCHAR(255),
  role_ar VARCHAR(255),
  photo_url VARCHAR(500),
  "order" INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- Settings Table (singleton - only one row)
-- ============================================================================
CREATE TABLE IF NOT EXISTS settings (
  id SERIAL PRIMARY KEY,
  site_title VARCHAR(255) NOT NULL,
  site_title_ar VARCHAR(255),
  hero_headline VARCHAR(500),
  hero_headline_ar VARCHAR(500),
  hero_description TEXT,
  hero_description_ar TEXT,
  hero_video_url VARCHAR(500),
  footer_text TEXT,
  footer_text_ar TEXT,
  social_links JSONB DEFAULT '[]',
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- Indexes for better query performance
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_phases_order ON phases("order");
CREATE INDEX IF NOT EXISTS idx_phases_slug ON phases(slug);
CREATE INDEX IF NOT EXISTS idx_modules_order ON modules("order");
CREATE INDEX IF NOT EXISTS idx_modules_slug ON modules(slug);
CREATE INDEX IF NOT EXISTS idx_modules_phase_id ON modules(phase_id);
CREATE INDEX IF NOT EXISTS idx_resources_order ON resources("order");
CREATE INDEX IF NOT EXISTS idx_resources_module_id ON resources(module_id);
CREATE INDEX IF NOT EXISTS idx_testimonials_order ON testimonials("order");

