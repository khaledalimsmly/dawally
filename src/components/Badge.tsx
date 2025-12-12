interface BadgeProps {
  children: React.ReactNode;
  variant: 'low' | 'medium' | 'high' | 'bullish' | 'bearish' | 'neutral';
  className?: string;
}

export const Badge = ({ children, variant, className = '' }: BadgeProps) => {
  const variantClasses = {
    low: 'bg-green-500/20 text-green-400 border-green-500/30',
    medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    high: 'bg-red-500/20 text-red-400 border-red-500/30',
    bullish: 'bg-green-500/20 text-green-400 border-green-500/30',
    bearish: 'bg-red-500/20 text-red-400 border-red-500/30',
    neutral: 'bg-gray-500/20 text-gray-400 border-gray-500/30'
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-sm font-semibold border ${variantClasses[variant]} ${className}`}
    >
      {children}
    </span>
  );
};
