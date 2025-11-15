import React, { useEffect, useState } from 'react';
import { CheckCircle, Sparkles } from 'lucide-react';

interface SuccessAnimationProps {
  show: boolean;
  message?: string;
  onComplete?: () => void;
}

const SuccessAnimation: React.FC<SuccessAnimationProps> = ({
  show,
  message = 'Success!',
  onComplete,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        onComplete?.();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      <div className="animate-scale-in-bounce">
        <div className="relative">
          {/* Success circle with checkmark */}
          <div className="bg-white dark:bg-gray-800 rounded-full p-8 shadow-2xl dark:shadow-gray-900/50">
            <CheckCircle className="w-24 h-24 text-green-500 dark:text-green-400 animate-pulse-scale" />
          </div>

          {/* Sparkles */}
          <div className="absolute -top-2 -right-2 animate-wiggle">
            <Sparkles className="w-8 h-8 text-yellow-400 fill-yellow-400" />
          </div>
          <div className="absolute -bottom-2 -left-2 animate-wiggle" style={{ animationDelay: '0.2s' }}>
            <Sparkles className="w-6 h-6 text-blue-400 fill-blue-400" />
          </div>
          <div className="absolute top-4 -left-4 animate-wiggle" style={{ animationDelay: '0.4s' }}>
            <Sparkles className="w-7 h-7 text-purple-400 fill-purple-400" />
          </div>

          {/* Confetti particles */}
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 rounded-full animate-fade-in"
              style={{
                top: '50%',
                left: '50%',
                transform: `rotate(${i * 30}deg) translateY(-60px)`,
                backgroundColor: ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899'][i % 6],
                animation: `fadeInUp 0.8s ease-out ${i * 0.1}s forwards`,
              }}
            />
          ))}
        </div>

        {/* Message */}
        <p className="text-center mt-6 text-2xl font-bold text-gray-900 dark:text-white animate-fade-in-up">
          {message}
        </p>
      </div>
    </div>
  );
};

export default SuccessAnimation;
