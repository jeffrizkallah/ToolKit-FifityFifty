-- Migration: Add phase_id to resources table
-- This allows resources to be linked directly to phases instead of modules

-- Add phase_id column to resources table
ALTER TABLE resources ADD COLUMN IF NOT EXISTS phase_id INTEGER REFERENCES phases(id);

-- Make module_id nullable (resources can now be linked to phase directly)
ALTER TABLE resources ALTER COLUMN module_id DROP NOT NULL;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_resources_phase_id ON resources(phase_id);

-- Migrate existing resources: set phase_id based on their module's phase_id
UPDATE resources r
SET phase_id = m.phase_id
FROM modules m
WHERE r.module_id = m.id
AND r.phase_id IS NULL;

