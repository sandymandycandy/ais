import React from 'react';
import { AlertCircle } from 'lucide-react';
import Button from './Button';
import { Card } from './Card';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
  loading?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'info',
  loading = false,
}) => {
  if (!isOpen) return null;

  const getVariantStyles = () => {
    switch (variant) {
      case 'danger':
        return {
          icon: 'text-red-600',
          button: 'danger' as const,
        };
      case 'warning':
        return {
          icon: 'text-yellow-600',
          button: 'primary' as const,
        };
      default:
        return {
          icon: 'text-blue-600',
          button: 'primary' as const,
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
      <Card className="max-w-md w-full p-6 animate-scale-in">
        <div className="flex items-start gap-4 mb-4">
          <AlertCircle className={`w-6 h-6 ${styles.icon} flex-shrink-0 mt-0.5`} />
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">{title}</h2>
            <p className="text-gray-600">{message}</p>
          </div>
        </div>

        <div className="flex gap-3 justify-end">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            {cancelText}
          </Button>
          <Button variant={styles.button} onClick={onConfirm} disabled={loading}>
            {loading ? 'Processing...' : confirmText}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ConfirmDialog;
