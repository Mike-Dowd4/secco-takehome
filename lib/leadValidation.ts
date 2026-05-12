export const MAX_NAME_LENGTH = 100;
export const MAX_EMAIL_LENGTH = 254;
export const MAX_COMPANY_LENGTH = 100;
export const MAX_MESSAGE_LENGTH = 300;

export const LEAD_SOURCES = ['Google', 'Referral', 'Social', 'Other'] as const;

export function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}