import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import Skeleton from './Skeleton';

describe('Skeleton Component', () => {
  it('should render with default rectangular variant', () => {
    const { container } = render(<Skeleton />);
    const skeleton = container.firstChild as HTMLElement;
    expect(skeleton).toHaveClass('rounded-lg');
  });

  it('should apply text variant styles', () => {
    const { container } = render(<Skeleton variant="text" />);
    const skeleton = container.firstChild as HTMLElement;
    expect(skeleton).toHaveClass('rounded');
  });

  it('should apply circular variant styles', () => {
    const { container } = render(<Skeleton variant="circular" />);
    const skeleton = container.firstChild as HTMLElement;
    expect(skeleton).toHaveClass('rounded-full');
  });

  it('should apply pulse animation by default', () => {
    const { container } = render(<Skeleton />);
    const skeleton = container.firstChild as HTMLElement;
    expect(skeleton).toHaveClass('animate-pulse');
  });

  it('should apply wave animation', () => {
    const { container } = render(<Skeleton animation="wave" />);
    const skeleton = container.firstChild as HTMLElement;
    expect(skeleton).toHaveClass('animate-shimmer');
  });

  it('should apply no animation', () => {
    const { container } = render(<Skeleton animation="none" />);
    const skeleton = container.firstChild as HTMLElement;
    expect(skeleton).not.toHaveClass('animate-pulse');
    expect(skeleton).not.toHaveClass('animate-shimmer');
  });

  it('should apply custom width', () => {
    const { container } = render(<Skeleton width={200} />);
    const skeleton = container.firstChild as HTMLElement;
    expect(skeleton.style.width).toBe('200px');
  });

  it('should apply custom width as string', () => {
    const { container } = render(<Skeleton width="50%" />);
    const skeleton = container.firstChild as HTMLElement;
    expect(skeleton.style.width).toBe('50%');
  });

  it('should apply custom height', () => {
    const { container } = render(<Skeleton height={100} />);
    const skeleton = container.firstChild as HTMLElement;
    expect(skeleton.style.height).toBe('100px');
  });

  it('should apply custom height as string', () => {
    const { container } = render(<Skeleton height="2rem" />);
    const skeleton = container.firstChild as HTMLElement;
    expect(skeleton.style.height).toBe('2rem');
  });

  it('should default to 100% width when not specified', () => {
    const { container } = render(<Skeleton />);
    const skeleton = container.firstChild as HTMLElement;
    expect(skeleton.style.width).toBe('100%');
  });

  it('should use 1em height for text variant by default', () => {
    const { container } = render(<Skeleton variant="text" />);
    const skeleton = container.firstChild as HTMLElement;
    expect(skeleton.style.height).toBe('1em');
  });

  it('should apply custom className', () => {
    const { container } = render(<Skeleton className="custom-class" />);
    const skeleton = container.firstChild as HTMLElement;
    expect(skeleton).toHaveClass('custom-class');
  });

  it('should have base skeleton styles', () => {
    const { container } = render(<Skeleton />);
    const skeleton = container.firstChild as HTMLElement;
    expect(skeleton).toHaveClass('bg-gray-200');
  });

  it('should render as div element', () => {
    const { container } = render(<Skeleton />);
    const skeleton = container.firstChild;
    expect(skeleton?.nodeName).toBe('DIV');
  });

  it('should allow overriding text variant height', () => {
    const { container } = render(<Skeleton variant="text" height={50} />);
    const skeleton = container.firstChild as HTMLElement;
    expect(skeleton.style.height).toBe('50px');
  });

  it('should combine all props correctly', () => {
    const { container } = render(
      <Skeleton
        variant="circular"
        animation="wave"
        width={100}
        height={100}
        className="my-custom-class"
      />
    );
    const skeleton = container.firstChild as HTMLElement;
    expect(skeleton).toHaveClass('rounded-full', 'animate-shimmer', 'my-custom-class');
    expect(skeleton.style.width).toBe('100px');
    expect(skeleton.style.height).toBe('100px');
  });
});
