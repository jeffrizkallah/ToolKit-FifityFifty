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

// Governorate options (Lebanese governorates)
export const GOVERNORATES = [
  { value: 'mount-lebanon-1', labelEn: 'Mount Lebanon 1', labelAr: 'جبل لبنان 1' },
  { value: 'mount-lebanon-2', labelEn: 'Mount Lebanon 2', labelAr: 'جبل لبنان 2' },
  { value: 'mount-lebanon-3', labelEn: 'Mount Lebanon 3', labelAr: 'جبل لبنان 3' },
  { value: 'mount-lebanon-4', labelEn: 'Mount Lebanon 4', labelAr: 'جبل لبنان 4' },
  { value: 'baalbak-hermel', labelEn: 'Baalbak/Hermel', labelAr: 'بعلبك الهرمل' },
  { value: 'north', labelEn: 'North', labelAr: 'الشمال' },
  { value: 'south', labelEn: 'South', labelAr: 'الجنوب' },
  { value: 'bekaa', labelEn: 'Bekaa', labelAr: 'البقاع' },
  { value: 'beirut', labelEn: 'Beirut', labelAr: 'بيروت' },
] as const;

// Electoral District options (Lebanese electoral districts)
export const ELECTORAL_DISTRICTS = [
  { value: 'akkar', labelEn: 'Akkar', labelAr: 'عكار' },
  { value: 'aley', labelEn: 'Aley', labelAr: 'عاليه' },
  { value: 'baabda', labelEn: 'Baabda', labelAr: 'بعبدا' },
  { value: 'baalback', labelEn: 'Baalback', labelAr: 'بعلبك' },
  { value: 'batroun', labelEn: 'Batroun', labelAr: 'البترون' },
  { value: 'bcharre', labelEn: 'Bcharre', labelAr: 'بشري' },
  { value: 'beirut', labelEn: 'Beirut', labelAr: 'بيروت' },
  { value: 'bint-jbeil', labelEn: 'Bint Jbeil', labelAr: 'بنت جبيل' },
  { value: 'chouf', labelEn: 'Chouf', labelAr: 'الشوف' },
  { value: 'el-metn', labelEn: 'El Metn', labelAr: 'المتن' },
  { value: 'hasbaya', labelEn: 'Hasbaya', labelAr: 'حاصبيا' },
  { value: 'hermel', labelEn: 'Hermel', labelAr: 'الهرمل' },
  { value: 'jbeil', labelEn: 'Jbeil', labelAr: 'جبيل' },
  { value: 'jezzine', labelEn: 'Jezzine', labelAr: 'جزين' },
  { value: 'kesserwan', labelEn: 'Kesserwan', labelAr: 'كسروان' },
  { value: 'koura', labelEn: 'Koura', labelAr: 'الكورة' },
  { value: 'marjaayoun', labelEn: 'Marjaayoun', labelAr: 'مرجعيون' },
  { value: 'minnieh-donniyeh', labelEn: 'Minnieh-Donniyeh', labelAr: 'المنية - الضنية' },
  { value: 'nabatieh', labelEn: 'Nabatieh', labelAr: 'النبطية' },
  { value: 'rashaya', labelEn: 'Rashaya', labelAr: 'راشيا' },
  { value: 'rashaya-al-fekhar', labelEn: 'Rashaya Al Fekhar', labelAr: 'راشيا الفخار' },
  { value: 'saida', labelEn: 'Saida', labelAr: 'صيدا' },
  { value: 'sour', labelEn: 'Sour', labelAr: 'صور' },
  { value: 'tripoli', labelEn: 'Tripoli', labelAr: 'طرابلس' },
  { value: 'west-beqaa', labelEn: 'West Beqaa', labelAr: 'البقاع الغربي' },
  { value: 'zahle', labelEn: 'Zahle', labelAr: 'زحلة' },
  { value: 'zgharta', labelEn: 'Zgharta', labelAr: 'زغرتا' },
] as const;

export type Governorate = typeof GOVERNORATES[number]['value'];
export type ElectoralDistrict = typeof ELECTORAL_DISTRICTS[number]['value'];

export interface AccessRegistration {
  id: number;
  code_id: number;
  full_name: string;
  age: number;
  contact_number: string;
  email_address: string;
  governorate: string;
  electoral_district: string;
  current_address: string;
  privacy_consent: boolean;
  created_at: Date;
}

// ============================================================================
// Access Code Operations
// ============================================================================

/**
 * The default/standard access code for the FiftyFifty Toolkit 2025
 */
export const DEFAULT_ACCESS_CODE = 'TOOLKIT-FF-2025';

/**
 * Generate a unique access code with a random suffix
 * Format: TOOLKIT-FF-XXXX where XXXX is a random alphanumeric string
 */
export function generateAccessCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Removed confusing chars (0,O,1,I)
  let suffix = '';
  for (let i = 0; i < 4; i++) {
    suffix += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `TOOLKIT-FF-${suffix}`;
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
  age: number,
  contactNumber: string,
  emailAddress: string,
  governorate: string,
  electoralDistrict: string,
  currentAddress: string,
  privacyConsent: boolean
): Promise<{ success: boolean; registrationId?: number; error?: string }> {
  try {
    const { rows } = await sql`
      INSERT INTO access_registrations (code_id, full_name, age, contact_number, email_address, governorate, electoral_district, current_address, privacy_consent)
      VALUES (${codeId}, ${fullName}, ${age}, ${contactNumber}, ${emailAddress}, ${governorate}, ${electoralDistrict}, ${currentAddress}, ${privacyConsent})
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
 * Validate age (must be between 16 and 120)
 */
export function validateAge(age: number): boolean {
  return Number.isInteger(age) && age >= 16 && age <= 120;
}

/**
 * Get registration statistics for a code
 */
export async function getCodeStatistics(codeId: number): Promise<{
  totalRegistrations: number;
  governorateBreakdown: Record<string, number>;
  districtBreakdown: Record<string, number>;
  averageAge: number;
}> {
  const registrations = await getRegistrationsByCodeId(codeId);
  
  const governorateBreakdown: Record<string, number> = {};
  const districtBreakdown: Record<string, number> = {};
  let totalAge = 0;
  
  for (const reg of registrations) {
    governorateBreakdown[reg.governorate] = (governorateBreakdown[reg.governorate] || 0) + 1;
    districtBreakdown[reg.electoral_district] = (districtBreakdown[reg.electoral_district] || 0) + 1;
    totalAge += reg.age;
  }
  
  return {
    totalRegistrations: registrations.length,
    governorateBreakdown,
    districtBreakdown,
    averageAge: registrations.length > 0 ? Math.round(totalAge / registrations.length) : 0,
  };
}

