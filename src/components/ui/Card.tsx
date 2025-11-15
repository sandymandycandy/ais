import React from 'react';
import { cn } from '../../lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hover?: boolean;
}

const Card: React.FC<CardProps> = ({ children, hover = false, className, ...props }) => {
  return (
    <div
      className={cn(
        'bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm dark:shadow-gray-900/20 transition-all duration-200',
        hover && 'hover:shadow-lg dark:hover:shadow-gray-900/40 hover:border-gray-300 dark:hover:border-gray-600 hover:-translate-y-0.5 cursor-pointer',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

const CardHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => {
  return <div className={cn('p-6 border-b border-gray-200 dark:border-gray-700', className)}>{children}</div>;
};

const CardContent: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => {
  return <div className={cn('p-6', className)}>{children}</div>;
};

const CardFooter: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => {
  return <div className={cn('p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50', className)}>{children}</div>;
};

export { Card, CardHeader, CardContent, CardFooter };
