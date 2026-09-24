import React from 'react';
import { Star } from 'lucide-react';

interface IRatingStarsProps {
  rating: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg' | number;
  showNumber?: boolean;
  reviewCount?: number;
  className?: string;
}

export default function RatingStars({
  rating = 5,
  max = 5,
  size = 'sm',
  showNumber = false,
  reviewCount,
  className = '',
}: IRatingStarsProps) {
  const getStarSizeClass = () => {
    if (typeof size === 'number') {
      if (size <= 14) return 'w-3.5 h-3.5';
      if (size <= 18) return 'w-4 h-4';
      return 'w-5 h-5';
    }
    const starSizes = {
      sm: 'w-3.5 h-3.5',
      md: 'w-4 h-4',
      lg: 'w-5 h-5',
    };
    return starSizes[size] || starSizes.sm;
  };

  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <div className="flex items-center text-amber-400">
        {Array.from({ length: max }).map((_, i) => {
          const filled = i + 1 <= Math.round(rating);
          return (
            <Star
              key={i}
              className={`${getStarSizeClass()} ${
                filled ? 'fill-amber-400 text-amber-400' : 'fill-slate-200 text-slate-200'
              }`}
            />
          );
        })}
      </div>
      {showNumber && (
        <span className="text-xs font-semibold text-slate-700 ml-0.5">
          {rating ? rating.toFixed(1) : '5.0'}
        </span>
      )}
      {reviewCount !== undefined && (
        <span className="text-xs text-slate-400">({reviewCount})</span>
      )}
    </div>
  );
}
