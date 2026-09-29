import {
  validateEmail,
  validatePhone,
  validatePassword,
  validateName,
  validateAddress,
  validatePostalCode,
  validateCurrency,
} from '../lib/validations';

describe('Input Validation Utilities (validations.ts)', () => {
  describe('validateEmail', () => {
    it('rejects empty or whitespace email', () => {
      expect(validateEmail('')).toEqual({ isValid: false, errorMessage: 'Email address cannot be empty.' });
      expect(validateEmail('   ')).toEqual({ isValid: false, errorMessage: 'Email address cannot be empty.' });
    });

    it('rejects invalid email formats', () => {
      expect(validateEmail('invalid-email').isValid).toBe(false);
      expect(validateEmail('test@domain').isValid).toBe(false);
    });

    it('accepts valid email addresses', () => {
      expect(validateEmail('user@sriramacycles.com')).toEqual({ isValid: true, errorMessage: null });
      expect(validateEmail('customer.name+test@gmail.com')).toEqual({ isValid: true, errorMessage: null });
    });
  });

  describe('validatePhone', () => {
    it('rejects invalid phone numbers', () => {
      expect(validatePhone('').isValid).toBe(false);
      expect(validatePhone('abc123456789').isValid).toBe(false);
      expect(validatePhone('12345').isValid).toBe(false);
    });

    it('accepts 10-digit Indian mobile numbers', () => {
      expect(validatePhone('9876543210')).toEqual({ isValid: true, errorMessage: null });
      expect(validatePhone('+91 98765 43210')).toEqual({ isValid: true, errorMessage: null });
    });
  });

  describe('validateName', () => {
    it('rejects names with invalid characters or too short', () => {
      expect(validateName('A').isValid).toBe(false);
      expect(validateName('John123').isValid).toBe(false);
    });

    it('accepts valid customer names', () => {
      expect(validateName('Sri Rama').isValid).toBe(true);
      expect(validateName("O'Connor-Smith").isValid).toBe(true);
    });
  });

  describe('validateAddress', () => {
    it('validates complete street addresses', () => {
      expect(validateAddress('Short').isValid).toBe(true);
      expect(validateAddress('Shop #12, Cycle Market, Main Road, Vijayawada').isValid).toBe(true);
    });
  });

  describe('validatePostalCode', () => {
    it('validates Indian 6-digit pincodes', () => {
      expect(validatePostalCode('520001')).toEqual({ isValid: true, errorMessage: null });
      expect(validatePostalCode('invalid!').isValid).toBe(false);
    });
  });

  describe('validateCurrency', () => {
    it('validates order amounts', () => {
      expect(validateCurrency(500).isValid).toBe(true);
      expect(validateCurrency(-10).isValid).toBe(false);
      expect(validateCurrency('abc').isValid).toBe(false);
    });
  });
});
