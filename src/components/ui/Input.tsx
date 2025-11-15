import React from 'react';
import { cn } from '../../lib/utils';
import { CheckCircle2, AlertCircle } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  success?: boolean;
  helpText?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, success, helpText, className, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            className={cn(
              'w-full px-3 py-2 border rounded-lg transition-all duration-200',
              'focus:outline-none focus:ring-2 focus:border-transparent',
              'placeholder:text-gray-400',
              error && 'border-red-300 focus:ring-red-500 bg-red-50',
              success && 'border-green-300 focus:ring-green-500 bg-green-50',
              !error && !success && 'border-gray-300 focus:ring-blue-500 hover:border-gray-400',
              (error || success) && 'pr-10',
              className
            )}
            {...props}
          />
          {error && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <AlertCircle className="h-5 w-5 text-red-500" />
            </div>
          )}
          {success && !error && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
            </div>
          )}
        </div>
        {error && (
          <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1 animate-in slide-in-from-top-1">
            {error}
          </p>
        )}
        {helpText && !error && (
          <p className="mt-1.5 text-sm text-gray-500">{helpText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
