import React from 'react';
import { cn } from '../../lib/utils';

interface LoadingSkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular' | 'card';
  lines?: number;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  className,
  variant = 'rectangular',
  lines = 1,
}) => {
  const baseClasses = 'animate-pulse bg-gray-200 rounded';

  const variantClasses = {
    text: 'h-4 w-full',
    circular: 'rounded-full w-12 h-12',
    rectangular: 'h-32 w-full',
    card: 'h-48 w-full rounded-lg',
  };

  if (variant === 'text' && lines > 1) {
    return (
      <div className="space-y-3">
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={cn(baseClasses, variantClasses.text, className)}
            style={{ width: index === lines - 1 ? '70%' : '100%' }}
          />
        ))}
      </div>
    );
  }

  return <div className={cn(baseClasses, variantClasses[variant], className)} />;
};

export const CardSkeleton: React.FC = () => {
  return (
    <div className="border border-gray-200 rounded-lg p-6 space-y-4">
      <div className="flex items-start justify-between">
        <div className="space-y-2 flex-1">
          <LoadingSkeleton variant="text" className="w-3/4" />
          <LoadingSkeleton variant="text" className="w-1/2 h-3" />
        </div>
        <LoadingSkeleton variant="circular" className="w-10 h-10" />
      </div>
      <LoadingSkeleton variant="text" lines={3} />
      <div className="flex gap-2">
        <LoadingSkeleton className="h-6 w-16 rounded-full" />
        <LoadingSkeleton className="h-6 w-20 rounded-full" />
      </div>
    </div>
  );
};

export const TableSkeleton: React.FC<{ rows?: number }> = ({ rows = 5 }) => {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
          <LoadingSkeleton variant="circular" className="w-12 h-12" />
          <div className="flex-1 space-y-2">
            <LoadingSkeleton variant="text" className="w-3/4" />
            <LoadingSkeleton variant="text" className="w-1/2 h-3" />
          </div>
          <LoadingSkeleton className="h-10 w-24 rounded-md" />
        </div>
      ))}
    </div>
  );
};

export const PageSkeleton: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div className="space-y-2">
          <LoadingSkeleton className="h-8 w-64" />
          <LoadingSkeleton className="h-4 w-96" />
        </div>
        <LoadingSkeleton className="h-10 w-32 rounded-md" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <CardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
};

export default LoadingSkeleton;
