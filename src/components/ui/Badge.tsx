import React from 'react';
import { cn } from '../../lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'secondary' | 'outline' | 'success' | 'warning' | 'danger' | 'info';
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({ children, variant = 'default', className }) => {
  const variants = {
    default: 'bg-gray-100 text-gray-800',
    primary: 'bg-indigo-100 text-indigo-800',
    secondary: 'bg-purple-100 text-purple-800',
    outline: 'bg-white text-gray-700 border border-gray-300',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
};

export default Badge;
