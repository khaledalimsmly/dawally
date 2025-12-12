interface ConfidenceGaugeProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
}

export const ConfidenceGauge = ({ score, size = 'md' }: ConfidenceGaugeProps) => {
  const sizeClasses = {
    sm: 'w-24 h-24',
    md: 'w-32 h-32',
    lg: 'w-40 h-40'
  };

  const strokeWidth = size === 'sm' ? 6 : size === 'md' ? 8 : 10;
  const radius = size === 'sm' ? 40 : size === 'md' ? 54 : 68;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const getColor = (score: number) => {
    if (score >= 80) return '#27D3B8';
    if (score >= 60) return '#3B82F6';
    if (score >= 40) return '#F59E0B';
    return '#EF4444';
  };

  const color = getColor(score);

  return (
    <div className={`relative ${sizeClasses[size]} mx-auto`}>
      <svg className="transform -rotate-90" width="100%" height="100%">
        <circle
          cx="50%"
          cy="50%"
          r={radius}
          stroke="rgba(75, 85, 99, 0.3)"
          strokeWidth={strokeWidth}
          fill="none"
        />
        <circle
          cx="50%"
          cy="50%"
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-1000 ease-out"
          style={{
            filter: `drop-shadow(0 0 8px ${color}40)`
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold text-white">{score}%</span>
        <span className="text-xs text-gray-400 mt-1">Confidence</span>
      </div>
    </div>
  );
};
