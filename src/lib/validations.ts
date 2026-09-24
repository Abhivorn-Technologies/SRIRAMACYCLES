/**
 * @file validations.ts
 * @description Centralized input validation utilities for Sri Rama Cycles.
 * Migrated from @organization-wide-standards/input-validations (private repo).
 */

// Shared result type
export interface ValidationResult {
  isValid: boolean;
  errorMessage: string | null;
}

const ok = (): ValidationResult => ({ isValid: true, errorMessage: null });
const fail = (msg: string): ValidationResult => ({ isValid: false, errorMessage: msg });

// Email
export const validateEmail = (email: string): ValidationResult => {
  if (!email || email.trim() === '') return fail('Email address cannot be empty.');
  if (email.length > 254) return fail('Email address is too long. Please limit to 254 characters.');
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!regex.test(email)) return fail('Please enter a valid email address (e.g., name@company.com).');
  return ok();
};

// Phone Number
export const validatePhone = (phone: string): ValidationResult => {
  if (!phone || phone.trim() === '') return fail('Phone number cannot be empty.');
  const cleaned = phone.replace(/[\s\-()+]/g, '');
  if (!/^[0-9]+$/.test(cleaned)) return fail('Phone number can only contain numbers.');
  if (cleaned.length < 10) return fail('Phone number must be at least 10 digits.');
  if (cleaned.length > 15) return fail('Phone number is too long. Please check your country code.');
  return ok();
};

// Password
export const validatePassword = (password: string): ValidationResult => {
  if (!password || password.trim() === '') return fail('Password cannot be empty.');
  if (password.length < 8) return fail('Password must be at least 8 characters long.');
  if (!/[A-Z]/.test(password)) return fail('Password must contain at least one uppercase letter.');
  if (!/[!@#$%^&*(),.?":{}|<>\-_+=]/.test(password))
    return fail('Password must contain at least one special character.');
  return ok();
};

// Full Name
export const validateName = (name: string): ValidationResult => {
  if (!name || name.trim() === '') return fail('Name cannot be empty.');
  const t = name.trim();
  if (t.length < 2) return fail('Name must be at least 2 characters long.');
  if (t.length > 50) return fail('Name is too long. Please limit to 50 characters.');
  if (!/^[a-zA-Z\s\-']+$/.test(t))
    return fail('Name can only contain letters, spaces, hyphens, and apostrophes.');
  return ok();
};

// First Name (no spaces allowed)
export const validateFirstName = (firstName: string): ValidationResult => {
  if (!firstName || firstName.trim() === '') return fail('First name cannot be empty.');
  const t = firstName.trim();
  if (t.length < 2) return fail('First name must be at least 2 characters long.');
  if (t.length > 30) return fail('First name is too long. Please limit to 30 characters.');
  if (!/^[a-zA-Z\-']+$/.test(t))
    return fail('First name can only contain letters, hyphens, and apostrophes (no spaces).');
  return ok();
};

// Address
export const validateAddress = (address: string): ValidationResult => {
  if (!address || address.trim() === '') return fail('Address cannot be empty.');
  const t = address.trim();
  if (t.length < 5) return fail('Address is too short. Please enter a complete address.');
  if (t.length > 150) return fail('Address is too long. Please limit to 150 characters.');
  if (!/^[a-zA-Z0-9\s,.\-#/]+$/.test(t))
    return fail('Address contains invalid characters. Use only letters, numbers, and , . - # /');
  return ok();
};

// Postal Code / Pincode
export const validatePostalCode = (code: string): ValidationResult => {
  if (!code || code.trim() === '') return fail('Pincode cannot be empty.');
  const t = code.trim();
  if (t.length < 3 || t.length > 10) return fail('Postal code must be between 3 and 10 characters.');
  if (!/^[A-Za-z0-9\s\-]+$/.test(t))
    return fail('Please enter a valid postal code (letters, numbers, spaces, and hyphens only).');
  return ok();
};

// GSTIN (India)
export const validateGSTIN = (gstin: string): ValidationResult => {
  if (!gstin || gstin.trim() === '') return fail('GSTIN cannot be empty.');
  const t = gstin.trim().toUpperCase();
  if (t.length !== 15) return fail('GSTIN must be exactly 15 characters long.');
  const regex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
  if (!regex.test(t))
    return fail('Invalid GSTIN format (e.g., 22AAAAA0000A1Z5).');
  return ok();
};

// Username
export const validateUsername = (username: string): ValidationResult => {
  if (!username || username.trim() === '') return fail('Username cannot be empty.');
  const t = username.trim().toLowerCase();
  if (t.length < 3 || t.length > 20) return fail('Username must be between 3 and 20 characters.');
  if (!/^[a-z0-9_]+$/.test(t))
    return fail('Username can only contain letters, numbers, and underscores (no spaces).');
  return ok();
};

// URL
export const validateUrl = (url: string): ValidationResult => {
  if (!url || url.trim() === '') return fail('URL cannot be empty.');
  try {
    const parsed = new URL(url.trim());
    if (!['http:', 'https:'].includes(parsed.protocol))
      return fail('URL must start with http:// or https://');
  } catch {
    return fail('Please enter a valid URL (e.g., https://example.com).');
  }
  return ok();
};

// Currency / Amount
export const validateCurrency = (value: string | number): ValidationResult => {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num)) return fail('Please enter a valid amount.');
  if (num < 0) return fail('Amount cannot be negative.');
  if (num > 10000000) return fail('Amount is too large. Please check and re-enter.');
  return ok();
};

// Generic required field
export const validateRequired = (value: string, label = 'This field'): ValidationResult => {
  if (!value || value.trim() === '') return fail(`${label} cannot be empty.`);
  return ok();
};
