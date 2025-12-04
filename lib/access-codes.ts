/**
 * Access Code System - Database Operations
 * 
 * Handles access code validation and user registration for site access.
 */

import { sql } from '@vercel/postgres';

export interface AccessCode {
  id: number;
  code: string;
  description: string | null;
  max_uses: number | null;
  is_active: boolean;
  expires_at: Date | null;
  created_at: Date;
}

// Age range options
export const AGE_RANGES = [
  'Under 18',
  '18-24',
  '25-34',
  '35-44',
  '45-54',
  '55+',
] as const;

export type AgeRange = typeof AGE_RANGES[number];

export interface AccessRegistration {
  id: number;
  code_id: number;
  full_name: string;
  age_range: string;
  contact_number: string;
  email_address: string;
  electoral_district: string;
  current_address: string;
  privacy_consent: boolean;
  created_at: Date;
}

// ============================================================================
// Access Code Operations
// ============================================================================

/**
 * Generate a unique access code
 */
export function generateAccessCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Removed confusing chars (0,O,1,I)
  let code = 'TOOLKIT-';
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  code += '-';
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

/**
 * Verify if an access code is valid
 */
export async function verifyAccessCode(code: string): Promise<{ valid: boolean; codeData?: AccessCode; error?: string }> {
  try {
    const { rows } = await sql`
      SELECT * FROM access_codes WHERE code = ${code.toUpperCase().trim()}
    `;

    if (rows.length === 0) {
      return { valid: false, error: 'Invalid access code' };
    }

    const codeData = rows[0] as AccessCode;

    // Check if code is active
    if (!codeData.is_active) {
      return { valid: false, error: 'This access code has been disabled' };
    }

    // Check if code has expired
    if (codeData.expires_at && new Date(codeData.expires_at) < new Date()) {
      return { valid: false, error: 'This access code has expired' };
    }

    // Check max uses
    if (codeData.max_uses !== null) {
      const { rows: usageRows } = await sql`
        SELECT COUNT(*) as count FROM access_registrations WHERE code_id = ${codeData.id}
      `;
      const usageCount = parseInt(usageRows[0].count, 10);
      if (usageCount >= codeData.max_uses) {
        return { valid: false, error: 'This access code has reached its maximum number of uses' };
      }
    }

    return { valid: true, codeData };
  } catch (error) {
    console.error('Error verifying access code:', error);
    return { valid: false, error: 'Failed to verify access code' };
  }
}

/**
 * Register a user with an access code
 */
export async function registerWithCode(
  codeId: number,
  fullName: string,
  ageRange: string,
  contactNumber: string,
  emailAddress: string,
  electoralDistrict: string,
  currentAddress: string,
  privacyConsent: boolean
): Promise<{ success: boolean; registrationId?: number; error?: string }> {
  try {
    const { rows } = await sql`
      INSERT INTO access_registrations (code_id, full_name, age_range, contact_number, email_address, electoral_district, current_address, privacy_consent)
      VALUES (${codeId}, ${fullName}, ${ageRange}, ${contactNumber}, ${emailAddress}, ${electoralDistrict}, ${currentAddress}, ${privacyConsent})
      RETURNING id
    `;

    return { success: true, registrationId: rows[0].id };
  } catch (error) {
    console.error('Error registering user:', error);
    return { success: false, error: 'Failed to complete registration' };
  }
}

/**
 * Validate email address format
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate phone number (basic validation - allows various formats)
 */
export function validatePhoneNumber(phone: string): boolean {
  // Allow various phone formats with at least 8 digits
  const cleaned = phone.replace(/[\s\-\(\)]/g, '');
  return /^\+?[0-9]{8,15}$/.test(cleaned);
}

// ============================================================================
// Admin Operations
// ============================================================================

/**
 * Get all access codes
 */
export async function getAllAccessCodes(): Promise<AccessCode[]> {
  const { rows } = await sql`
    SELECT * FROM access_codes ORDER BY created_at DESC
  `;
  return rows as AccessCode[];
}

/**
 * Get access code by ID
 */
export async function getAccessCodeById(id: number): Promise<AccessCode | null> {
  const { rows } = await sql`
    SELECT * FROM access_codes WHERE id = ${id}
  `;
  return rows[0] as AccessCode || null;
}

/**
 * Create a new access code
 */
export async function createAccessCode(
  description?: string,
  maxUses?: number,
  expiresAt?: Date
): Promise<{ success: boolean; code?: AccessCode; error?: string }> {
  try {
    const code = generateAccessCode();
    const expiresAtStr = expiresAt ? expiresAt.toISOString() : null;
    
    const { rows } = await sql`
      INSERT INTO access_codes (code, description, max_uses, expires_at)
      VALUES (${code}, ${description || null}, ${maxUses || null}, ${expiresAtStr})
      RETURNING *
    `;

    return { success: true, code: rows[0] as AccessCode };
  } catch (error) {
    console.error('Error creating access code:', error);
    return { success: false, error: 'Failed to create access code' };
  }
}

/**
 * Update access code status
 */
export async function updateAccessCodeStatus(id: number, isActive: boolean): Promise<boolean> {
  try {
    await sql`
      UPDATE access_codes SET is_active = ${isActive} WHERE id = ${id}
    `;
    return true;
  } catch (error) {
    console.error('Error updating access code:', error);
    return false;
  }
}

/**
 * Delete an access code
 */
export async function deleteAccessCode(id: number): Promise<boolean> {
  try {
    await sql`
      DELETE FROM access_codes WHERE id = ${id}
    `;
    return true;
  } catch (error) {
    console.error('Error deleting access code:', error);
    return false;
  }
}

/**
 * Get registrations for a specific code
 */
export async function getRegistrationsByCodeId(codeId: number): Promise<AccessRegistration[]> {
  const { rows } = await sql`
    SELECT * FROM access_registrations WHERE code_id = ${codeId} ORDER BY created_at DESC
  `;
  return rows as AccessRegistration[];
}

/**
 * Get registration count for a code
 */
export async function getRegistrationCount(codeId: number): Promise<number> {
  const { rows } = await sql`
    SELECT COUNT(*) as count FROM access_registrations WHERE code_id = ${codeId}
  `;
  return parseInt(rows[0].count, 10);
}

/**
 * Get all registrations with code info
 */
export async function getAllRegistrations(): Promise<(AccessRegistration & { code: string })[]> {
  const { rows } = await sql`
    SELECT ar.*, ac.code 
    FROM access_registrations ar
    JOIN access_codes ac ON ar.code_id = ac.id
    ORDER BY ar.created_at DESC
  `;
  return rows as (AccessRegistration & { code: string })[];
}

/**
 * Get registration statistics for a code
 */
export async function getCodeStatistics(codeId: number): Promise<{
  totalRegistrations: number;
  districtBreakdown: Record<string, number>;
  ageBreakdown: Record<string, number>;
}> {
  const registrations = await getRegistrationsByCodeId(codeId);
  
  const districtBreakdown: Record<string, number> = {};
  const ageBreakdown: Record<string, number> = {};
  
  for (const reg of registrations) {
    districtBreakdown[reg.electoral_district] = (districtBreakdown[reg.electoral_district] || 0) + 1;
    ageBreakdown[reg.age_range] = (ageBreakdown[reg.age_range] || 0) + 1;
  }
  
  return {
    totalRegistrations: registrations.length,
    districtBreakdown,
    ageBreakdown,
  };
}

