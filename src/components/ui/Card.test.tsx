import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Card, CardHeader, CardContent, CardFooter } from './Card';

describe('Card Components', () => {
  describe('Card', () => {
    it('should render card with children', () => {
      render(<Card>Card Content</Card>);
      expect(screen.getByText('Card Content')).toBeInTheDocument();
    });

    it('should apply default styles', () => {
      const { container } = render(<Card>Test</Card>);
      const card = container.firstChild as HTMLElement;
      expect(card.className).toContain('bg-white');
      expect(card.className).toContain('dark:bg-gray-800');
      expect(card.className).toContain('rounded-lg');
    });

    it('should apply hover styles when hover prop is true', () => {
      const { container } = render(<Card hover>Test</Card>);
      const card = container.firstChild as HTMLElement;
      expect(card.className).toContain('hover:shadow-lg');
      expect(card.className).toContain('cursor-pointer');
    });

    it('should not apply hover styles when hover prop is false', () => {
      const { container } = render(<Card hover={false}>Test</Card>);
      const card = container.firstChild as HTMLElement;
      expect(card.className).not.toContain('cursor-pointer');
    });

    it('should apply custom className', () => {
      const { container } = render(<Card className="custom-class">Test</Card>);
      const card = container.firstChild as HTMLElement;
      expect(card.className).toContain('custom-class');
    });

    it('should have dark mode styles', () => {
      const { container } = render(<Card>Test</Card>);
      const card = container.firstChild as HTMLElement;
      expect(card.className).toContain('dark:bg-gray-800');
      expect(card.className).toContain('dark:border-gray-700');
    });
  });

  describe('CardHeader', () => {
    it('should render header with children', () => {
      render(<CardHeader>Header Content</CardHeader>);
      expect(screen.getByText('Header Content')).toBeInTheDocument();
    });

    it('should apply default styles', () => {
      const { container } = render(<CardHeader>Test</CardHeader>);
      const header = container.firstChild as HTMLElement;
      expect(header.className).toContain('p-6');
      expect(header.className).toContain('border-b');
    });

    it('should have dark mode border', () => {
      const { container } = render(<CardHeader>Test</CardHeader>);
      const header = container.firstChild as HTMLElement;
      expect(header.className).toContain('dark:border-gray-700');
    });
  });

  describe('CardContent', () => {
    it('should render content with children', () => {
      render(<CardContent>Content Text</CardContent>);
      expect(screen.getByText('Content Text')).toBeInTheDocument();
    });

    it('should apply default padding', () => {
      const { container } = render(<CardContent>Test</CardContent>);
      const content = container.firstChild as HTMLElement;
      expect(content.className).toContain('p-6');
    });
  });

  describe('CardFooter', () => {
    it('should render footer with children', () => {
      render(<CardFooter>Footer Content</CardFooter>);
      expect(screen.getByText('Footer Content')).toBeInTheDocument();
    });

    it('should apply footer styles', () => {
      const { container } = render(<CardFooter>Test</CardFooter>);
      const footer = container.firstChild as HTMLElement;
      expect(footer.className).toContain('p-6');
      expect(footer.className).toContain('border-t');
      expect(footer.className).toContain('bg-gray-50');
    });

    it('should have dark mode styles', () => {
      const { container } = render(<CardFooter>Test</CardFooter>);
      const footer = container.firstChild as HTMLElement;
      expect(footer.className).toContain('dark:bg-gray-800/50');
      expect(footer.className).toContain('dark:border-gray-700');
    });
  });
});
