import { describe, it, expect } from 'vitest';
import { cn, formatRelativeTime, calculateDaysUntil } from './utils';

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
});
