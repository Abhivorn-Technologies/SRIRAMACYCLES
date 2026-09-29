import {
  formatPrice,
  calculateDiscountPercent,
  generateOrderNumber,
  slugify,
  formatDate,
  formatDateTime,
} from '../lib/utils';

describe('Utility Functions (utils.ts)', () => {
  describe('formatPrice', () => {
    it('formats null or undefined as ₹0', () => {
      expect(formatPrice(null)).toBe('₹0');
      expect(formatPrice(undefined)).toBe('₹0');
    });

    it('formats numeric values into Indian Rupee format', () => {
      expect(formatPrice(1000)).toMatch(/₹\s?1,000/);
      expect(formatPrice(14999)).toMatch(/₹\s?14,999/);
    });

    it('formats string amounts correctly', () => {
      expect(formatPrice('2500')).toMatch(/₹\s?2,500/);
      expect(formatPrice('invalid')).toBe('₹0');
    });
  });

  describe('calculateDiscountPercent', () => {
    it('returns 0 if salePrice is missing or greater/equal to regularPrice', () => {
      expect(calculateDiscountPercent(1000)).toBe(0);
      expect(calculateDiscountPercent(1000, 1000)).toBe(0);
      expect(calculateDiscountPercent(1000, 1200)).toBe(0);
    });

    it('calculates correct discount percentage', () => {
      expect(calculateDiscountPercent(1000, 800)).toBe(20);
      expect(calculateDiscountPercent(10000, 7500)).toBe(25);
    });
  });

  describe('generateOrderNumber', () => {
    it('generates an order number starting with SRC-', () => {
      const orderNum = generateOrderNumber();
      expect(orderNum).toMatch(/^SRC-\d{10}$/);
    });
  });

  describe('slugify', () => {
    it('converts strings into URL-friendly slugs', () => {
      expect(slugify('Mountain Bikes')).toBe('mountain-bikes');
      expect(slugify('Disc Brake Cycles! #1')).toBe('disc-brake-cycles-1');
      expect(slugify('  Ladies  Bicycles  ')).toBe('ladies-bicycles');
    });
  });

  describe('formatDate & formatDateTime', () => {
    it('returns empty string if date is missing', () => {
      expect(formatDate(undefined)).toBe('');
      expect(formatDateTime(undefined)).toBe('');
    });

    it('formats valid dates correctly', () => {
      const dateStr = '2026-09-29T10:00:00.000Z';
      expect(formatDate(dateStr)).toContain('2026');
      expect(formatDateTime(dateStr)).toContain('2026');
    });
  });
});
