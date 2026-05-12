import { LeadFormData } from "@/types/lead";

export const MAX_NAME_LENGTH = 100;
export const MAX_EMAIL_LENGTH = 254;
export const MAX_COMPANY_LENGTH = 100;
export const MAX_MESSAGE_LENGTH = 300;

export const MAX_LENGTHS = {
  fullName: MAX_NAME_LENGTH,
  email: MAX_EMAIL_LENGTH,
  company: MAX_COMPANY_LENGTH,
  message: MAX_MESSAGE_LENGTH,
};

export const LEAD_SOURCES = ["Google", "Referral", "Social", "Other"] as const;

export function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isValidSource(
  source: string | undefined,
): source is (typeof LEAD_SOURCES)[number] {
  return LEAD_SOURCES.includes(source as (typeof LEAD_SOURCES)[number]);
}

export function validateMaxLength(
  value: string,
  name: keyof typeof MAX_LENGTHS,
) {
  if (value.length > MAX_LENGTHS[name]) {
    return `${name} must be less than ${MAX_LENGTHS[name]} characters.`;
  }
  return null;
}

export function validateFormData(formData: LeadFormData) {
  const fullName = formData.fullName.trim();
  const email = formData.email.trim();
  const company = formData.company.trim();
  const message = formData.message.trim();
  const source = formData.source.trim();

  if (!fullName) {
    return "Full name is required.";
  }

  if (!email || !isValidEmail(email)) {
    return "A valid email is required.";
  }

  if (!isValidSource(source)) {
    return "Invalid value for referral source.";
  }

  return (
    validateMaxLength(fullName, "fullName") ||
    validateMaxLength(email, "email") ||
    validateMaxLength(company, "company") ||
    validateMaxLength(message, "message")
  );
}
