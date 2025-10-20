/**
 * Cookie Consent Management
 * 
 * Implements US5.6 - Privacy Compliance
 * GDPR-compliant cookie consent management with localStorage persistence
 */

const CONSENT_KEY = 'cookie-consent';
const CONSENT_TIMESTAMP_KEY = 'cookie-consent-timestamp';
const CONSENT_EXPIRY_DAYS = 365; // Consent expires after 1 year

export type ConsentStatus = 'accepted' | 'declined' | 'pending';

export interface ConsentData {
  status: ConsentStatus;
  timestamp: number;
  analyticsEnabled: boolean;
}

/**
 * Check if consent is valid (not expired)
 */
function isConsentValid(timestamp: number): boolean {
  const now = Date.now();
  const expiryTime = timestamp + (CONSENT_EXPIRY_DAYS * 24 * 60 * 60 * 1000);
  return now < expiryTime;
}

/**
 * Get current consent status
 */
export function getConsent(): ConsentData | null {
  if (typeof window === 'undefined') return null;

  try {
    const consentStr = localStorage.getItem(CONSENT_KEY);
    const timestampStr = localStorage.getItem(CONSENT_TIMESTAMP_KEY);

    if (!consentStr || !timestampStr) return null;

    const timestamp = parseInt(timestampStr, 10);
    if (!isConsentValid(timestamp)) {
      // Consent expired, clear it
      clearConsent();
      return null;
    }

    const status = consentStr as ConsentStatus;
    const analyticsEnabled = status === 'accepted';

    return {
      status,
      timestamp,
      analyticsEnabled,
    };
  } catch (error) {
    console.error('Error reading consent:', error);
    return null;
  }
}

/**
 * Set consent status
 */
export function setConsent(status: ConsentStatus): void {
  if (typeof window === 'undefined') return;

  try {
    const timestamp = Date.now();
    localStorage.setItem(CONSENT_KEY, status);
    localStorage.setItem(CONSENT_TIMESTAMP_KEY, timestamp.toString());

    // Dispatch custom event for components to react to consent changes
    window.dispatchEvent(new CustomEvent('consentchange', {
      detail: {
        status,
        timestamp,
        analyticsEnabled: status === 'accepted',
      },
    }));
  } catch (error) {
    console.error('Error saving consent:', error);
  }
}

/**
 * Clear consent data
 */
export function clearConsent(): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.removeItem(CONSENT_KEY);
    localStorage.removeItem(CONSENT_TIMESTAMP_KEY);
  } catch (error) {
    console.error('Error clearing consent:', error);
  }
}

/**
 * Check if analytics should be enabled
 */
export function isAnalyticsEnabled(): boolean {
  const consent = getConsent();
  return consent?.analyticsEnabled ?? false;
}

/**
 * Check if consent banner should be shown
 */
export function shouldShowConsentBanner(): boolean {
  return getConsent() === null;
}

