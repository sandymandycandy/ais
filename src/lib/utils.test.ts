import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  cn,
  formatDate,
  formatRelativeTime,
  calculateDaysUntil,
  formatNumber,
  scrollToElement,
  scrollToTop,
  debounce,
  formatCurrency,
  copyToClipboard,
  isValidEmail,
  truncate,
  getInitials
} from './utils';

describe('Utility Functions', () => {
  describe('cn (className utility)', () => {
    it('should merge class names', () => {
      const result = cn('text-red-500', 'bg-blue-500');
      expect(result).toContain('text-red-500');
      expect(result).toContain('bg-blue-500');
    });

    it('should handle conditional classes', () => {
      const result = cn('base-class', true && 'conditional-class');
      expect(result).toContain('base-class');
      expect(result).toContain('conditional-class');
    });

    it('should filter out false conditions', () => {
      const result = cn('base-class', false && 'not-included');
      expect(result).toContain('base-class');
      expect(result).not.toContain('not-included');
    });

    it('should handle undefined and null', () => {
      const result = cn('base-class', undefined, null);
      expect(result).toContain('base-class');
    });
  });

  describe('formatRelativeTime', () => {
    it('should format time just now', () => {
      const now = new Date();
      const result = formatRelativeTime(now);
      expect(result).toBe('Just now');
    });

    it('should format minutes ago', () => {
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
      const result = formatRelativeTime(fiveMinutesAgo);
      expect(result).toBe('5m ago');
    });

    it('should format hours ago', () => {
      const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
      const result = formatRelativeTime(twoHoursAgo);
      expect(result).toBe('2h ago');
    });

    it('should format days ago', () => {
      const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
      const result = formatRelativeTime(threeDaysAgo);
      expect(result).toBe('3d ago');
    });

    it('should format older dates with formatDate', () => {
      const twoWeeksAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
      const result = formatRelativeTime(twoWeeksAgo);
      // Should return formatted date, not relative time
      expect(result).toContain('2025');
    });

    it('should format very old dates with formatDate', () => {
      const twoMonthsAgo = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000);
      const result = formatRelativeTime(twoMonthsAgo);
      // Should return formatted date
      expect(result).toContain('2025');
    });
  });

  describe('calculateDaysUntil', () => {
    it('should calculate days until future date', () => {
      const futureDate = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000);
      const result = calculateDaysUntil(futureDate);
      expect(result).toBe(5);
    });

    it('should return 0 for today', () => {
      const today = new Date();
      const result = calculateDaysUntil(today);
      expect(result).toBe(0);
    });

    it('should return negative for past dates', () => {
      const pastDate = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
      const result = calculateDaysUntil(pastDate);
      expect(result).toBeLessThan(0);
    });

    it('should handle string dates', () => {
      const futureDate = new Date(Date.now() + 10 * 24 * 60 * 60 * 1000);
      const result = calculateDaysUntil(futureDate.toISOString());
      expect(result).toBe(10);
    });
  });

  describe('formatDate', () => {
    it('should format date with short month', () => {
      const date = new Date('2025-01-15');
      const result = formatDate(date);
      expect(result).toContain('Jan');
      expect(result).toContain('15');
      expect(result).toContain('2025');
    });

    it('should handle string dates', () => {
      const result = formatDate('2025-03-20');
      expect(result).toContain('Mar');
      expect(result).toContain('20');
      expect(result).toContain('2025');
    });

    it('should format date objects', () => {
      const date = new Date('2025-12-25');
      const result = formatDate(date);
      expect(result).toContain('Dec');
      expect(result).toContain('25');
      expect(result).toContain('2025');
    });
  });

  describe('formatNumber', () => {
    it('should format millions', () => {
      expect(formatNumber(1500000)).toBe('1.5M');
      expect(formatNumber(2000000)).toBe('2.0M');
      expect(formatNumber(10500000)).toBe('10.5M');
    });

    it('should format thousands', () => {
      expect(formatNumber(1500)).toBe('1.5K');
      expect(formatNumber(2000)).toBe('2.0K');
      expect(formatNumber(999999)).toBe('1000.0K');
    });

    it('should return number as string for values under 1000', () => {
      expect(formatNumber(999)).toBe('999');
      expect(formatNumber(100)).toBe('100');
      expect(formatNumber(0)).toBe('0');
    });
  });

  describe('scrollToElement', () => {
    beforeEach(() => {
      document.body.innerHTML = '<div id="test-element"></div>';
      window.scrollTo = vi.fn();
    });

    afterEach(() => {
      document.body.innerHTML = '';
    });

    it('should scroll to element with default offset', () => {
      scrollToElement('test-element');
      expect(window.scrollTo).toHaveBeenCalledWith(
        expect.objectContaining({
          behavior: 'smooth'
        })
      );
    });

    it('should scroll to element with custom offset', () => {
      scrollToElement('test-element', 100);
      expect(window.scrollTo).toHaveBeenCalledWith(
        expect.objectContaining({
          behavior: 'smooth'
        })
      );
    });

    it('should handle non-existent element', () => {
      scrollToElement('non-existent');
      // Should not throw error
      expect(window.scrollTo).not.toHaveBeenCalled();
    });
  });

  describe('scrollToTop', () => {
    beforeEach(() => {
      window.scrollTo = vi.fn();
    });

    it('should scroll to top of page', () => {
      scrollToTop();
      expect(window.scrollTo).toHaveBeenCalledWith({
        top: 0,
        behavior: 'smooth'
      });
    });
  });

  describe('debounce', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('should debounce function calls', () => {
      const func = vi.fn();
      const debouncedFunc = debounce(func, 100);

      debouncedFunc();
      debouncedFunc();
      debouncedFunc();

      expect(func).not.toHaveBeenCalled();

      vi.advanceTimersByTime(100);

      expect(func).toHaveBeenCalledTimes(1);
    });

    it('should pass arguments to debounced function', () => {
      const func = vi.fn();
      const debouncedFunc = debounce(func, 100);

      debouncedFunc('test', 123);

      vi.advanceTimersByTime(100);

      expect(func).toHaveBeenCalledWith('test', 123);
    });

    it('should reset timer on subsequent calls', () => {
      const func = vi.fn();
      const debouncedFunc = debounce(func, 100);

      debouncedFunc();
      vi.advanceTimersByTime(50);
      debouncedFunc();
      vi.advanceTimersByTime(50);

      expect(func).not.toHaveBeenCalled();

      vi.advanceTimersByTime(50);

      expect(func).toHaveBeenCalledTimes(1);
    });
  });

  describe('formatCurrency', () => {
    it('should format currency with default rupee symbol', () => {
      expect(formatCurrency(1000)).toBe('₹1,000');
      expect(formatCurrency(1000000)).toBe('₹10,00,000');
    });

    it('should format currency with custom symbol', () => {
      expect(formatCurrency(1000, '$')).toBe('$1,000');
      expect(formatCurrency(5000, '€')).toBe('€5,000');
    });

    it('should handle zero', () => {
      expect(formatCurrency(0)).toBe('₹0');
    });

    it('should format large numbers', () => {
      expect(formatCurrency(9999999)).toBe('₹99,99,999');
    });
  });

  describe('copyToClipboard', () => {
    it('should copy text to clipboard successfully', async () => {
      const writeText = vi.fn().mockResolvedValue(undefined);
      Object.assign(navigator, {
        clipboard: {
          writeText,
        },
      });

      const result = await copyToClipboard('test text');

      expect(writeText).toHaveBeenCalledWith('test text');
      expect(result).toBe(true);
    });

    it('should return false on error', async () => {
      const writeText = vi.fn().mockRejectedValue(new Error('Failed'));
      Object.assign(navigator, {
        clipboard: {
          writeText,
        },
      });

      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

      const result = await copyToClipboard('test text');

      expect(result).toBe(false);
      expect(consoleError).toHaveBeenCalled();

      consoleError.mockRestore();
    });
  });

  describe('isValidEmail', () => {
    it('should validate correct email addresses', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user.name@domain.co.uk')).toBe(true);
      expect(isValidEmail('test+tag@example.com')).toBe(true);
    });

    it('should reject invalid email addresses', () => {
      expect(isValidEmail('invalid')).toBe(false);
      expect(isValidEmail('invalid@')).toBe(false);
      expect(isValidEmail('@domain.com')).toBe(false);
      expect(isValidEmail('test @example.com')).toBe(false);
      expect(isValidEmail('test@domain')).toBe(false);
    });

    it('should handle empty string', () => {
      expect(isValidEmail('')).toBe(false);
    });
  });

  describe('truncate', () => {
    it('should truncate long text', () => {
      const longText = 'This is a very long text that should be truncated';
      const result = truncate(longText, 20);
      expect(result).toBe('This is a very long ...');
      expect(result.length).toBe(23); // 20 + '...'
    });

    it('should not truncate short text', () => {
      const shortText = 'Short text';
      const result = truncate(shortText, 20);
      expect(result).toBe('Short text');
    });

    it('should handle exact length', () => {
      const text = 'Exactly twenty chars';
      const result = truncate(text, 20);
      expect(result).toBe('Exactly twenty chars');
    });

    it('should handle zero length', () => {
      const result = truncate('test', 0);
      expect(result).toBe('...');
    });
  });

  describe('getInitials', () => {
    it('should get initials from full name', () => {
      expect(getInitials('John Doe')).toBe('JD');
      expect(getInitials('Jane Smith')).toBe('JS');
    });

    it('should handle single name', () => {
      expect(getInitials('John')).toBe('J');
    });

    it('should handle three or more names', () => {
      expect(getInitials('John Michael Doe')).toBe('JM');
    });

    it('should convert to uppercase', () => {
      expect(getInitials('john doe')).toBe('JD');
    });

    it('should handle extra spaces', () => {
      expect(getInitials('John  Doe')).toBe('JD');
    });
  });
});
