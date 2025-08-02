import React from 'react';
import { Heart } from 'lucide-react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-64">
      <div className="relative">
        <Heart className="h-12 w-12 text-rose-500 animate-pulse" />
        <div className="absolute inset-0 h-12 w-12 rounded-full border-2 border-rose-200 border-t-rose-500 animate-spin"></div>
      </div>
    </div>
  );
};

export default LoadingSpinner;