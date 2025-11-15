import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Input from './Input';

describe('Input Component', () => {
  it('should render input field', () => {
    render(<Input placeholder="Enter text" />);
    const input = screen.getByPlaceholderText('Enter text');
    expect(input).toBeInTheDocument();
  });

  it('should render with label', () => {
    render(<Input label="Username" />);
    expect(screen.getByText('Username')).toBeInTheDocument();
  });

  it('should show required asterisk when required', () => {
    render(<Input label="Email" required />);
    const asterisk = screen.getByText('*');
    expect(asterisk).toBeInTheDocument();
    expect(asterisk).toHaveClass('text-red-500');
  });

  it('should display error message', () => {
    render(<Input error="This field is required" />);
    expect(screen.getByText('This field is required')).toBeInTheDocument();
  });

  it('should show error icon when error is present', () => {
    const { container } = render(<Input error="Error message" />);
    const errorIcon = container.querySelector('svg');
    expect(errorIcon).toBeInTheDocument();
  });

  it('should show success icon when success is true', () => {
    const { container } = render(<Input success />);
    const successIcon = container.querySelector('svg');
    expect(successIcon).toBeInTheDocument();
  });

  it('should display help text when provided', () => {
    render(<Input helpText="Enter at least 8 characters" />);
    expect(screen.getByText('Enter at least 8 characters')).toBeInTheDocument();
  });

  it('should not show help text when error is present', () => {
    render(<Input helpText="Help text" error="Error message" />);
    expect(screen.queryByText('Help text')).not.toBeInTheDocument();
    expect(screen.getByText('Error message')).toBeInTheDocument();
  });

  it('should apply error styles when error prop is set', () => {
    render(<Input error="Error" />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('border-red-300', 'focus:ring-red-500', 'bg-red-50');
  });

  it('should apply success styles when success prop is set', () => {
    render(<Input success />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('border-green-300', 'focus:ring-green-500', 'bg-green-50');
  });

  it('should not show success icon when both error and success are present', () => {
    const { container } = render(<Input success error="Error" />);
    // Only one icon should be present (the error icon)
    const icons = container.querySelectorAll('svg');
    expect(icons.length).toBe(1);
  });

  it('should forward additional props to input element', () => {
    render(<Input type="email" name="email" />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('type', 'email');
    expect(input).toHaveAttribute('name', 'email');
  });

  it('should apply custom className', () => {
    render(<Input className="custom-class" />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('custom-class');
  });

  it('should handle disabled state', () => {
    render(<Input disabled />);
    const input = screen.getByRole('textbox');
    expect(input).toBeDisabled();
  });

  it('should handle different input types', () => {
    const { container, rerender } = render(<Input type="password" />);
    let input = container.querySelector('input') as HTMLInputElement;
    expect(input.type).toBe('password');

    rerender(<Input type="number" />);
    input = container.querySelector('input') as HTMLInputElement;
    expect(input.type).toBe('number');

    rerender(<Input type="email" />);
    input = container.querySelector('input') as HTMLInputElement;
    expect(input.type).toBe('email');
  });
});
