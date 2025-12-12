import { useState } from 'react';

interface PriceChartProps {
  data: Array<{
    day: string;
    price: number;
    upperBound?: number;
    lowerBound?: number;
  }>;
  showConfidenceBands?: boolean;
}

export const PriceChart = ({ data, showConfidenceBands = true }: PriceChartProps) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const width = 800;
  const height = 300;
  const padding = { top: 20, right: 30, bottom: 40, left: 60 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const prices = data.map(d => d.price);
  const allValues = showConfidenceBands
    ? [...prices, ...data.map(d => d.upperBound || 0), ...data.map(d => d.lowerBound || 0)]
    : prices;
  const minValue = Math.min(...allValues) * 0.95;
  const maxValue = Math.max(...allValues) * 1.05;
  const valueRange = maxValue - minValue;

  const getX = (index: number) => {
    return padding.left + (index / (data.length - 1)) * chartWidth;
  };

  const getY = (value: number) => {
    return padding.top + chartHeight - ((value - minValue) / valueRange) * chartHeight;
  };

  const pricePath = data
    .map((d, i) => {
      const x = getX(i);
      const y = getY(d.price);
      return i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`;
    })
    .join(' ');

  const priceAreaPath = pricePath + ` L ${getX(data.length - 1)} ${height - padding.bottom} L ${getX(0)} ${height - padding.bottom} Z`;

  let confidencePath = '';
  if (showConfidenceBands) {
    const upperPath = data.map((d, i) => {
      const x = getX(i);
      const y = getY(d.upperBound || d.price);
      return i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`;
    }).join(' ');

    const lowerPath = data.slice().reverse().map((d, i) => {
      const x = getX(data.length - 1 - i);
      const y = getY(d.lowerBound || d.price);
      return `L ${x} ${y}`;
    }).join(' ');

    confidencePath = upperPath + ' ' + lowerPath + ' Z';
  }

  const yTicks = 5;
  const yTickValues = Array.from({ length: yTicks }, (_, i) => {
    return minValue + (valueRange / (yTicks - 1)) * i;
  });

  return (
    <div className="relative w-full ltr" style={{ height: '300px' }} dir="ltr">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-full"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#27D3B8" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#27D3B8" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="confidenceGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.15} />
            <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
          </linearGradient>
        </defs>

        {yTickValues.map((value, i) => (
          <g key={i}>
            <line
              x1={padding.left}
              y1={getY(value)}
              x2={width - padding.right}
              y2={getY(value)}
              stroke="#374151"
              strokeOpacity={0.3}
              strokeDasharray="3 3"
            />
            <text
              x={padding.left - 10}
              y={getY(value)}
              textAnchor="end"
              alignmentBaseline="middle"
              fill="#9CA3AF"
              fontSize="12"
            >
              {value.toFixed(0)}
            </text>
          </g>
        ))}

        {data.map((d, i) => (
          <text
            key={i}
            x={getX(i)}
            y={height - padding.bottom + 20}
            textAnchor="middle"
            fill="#9CA3AF"
            fontSize="12"
          >
            {d.day}
          </text>
        ))}

        {showConfidenceBands && confidencePath && (
          <path
            d={confidencePath}
            fill="url(#confidenceGradient)"
            strokeWidth={0}
          />
        )}

        <path
          d={priceAreaPath}
          fill="url(#priceGradient)"
          strokeWidth={0}
        />

        <path
          d={pricePath}
          fill="none"
          stroke="#27D3B8"
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            filter: 'drop-shadow(0 0 8px rgba(39, 211, 184, 0.3))'
          }}
        />

        {data.map((d, i) => (
          <g key={i}>
            <circle
              cx={getX(i)}
              cy={getY(d.price)}
              r={hoveredIndex === i ? 6 : 4}
              fill="#27D3B8"
              stroke="#1F2937"
              strokeWidth={2}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="cursor-pointer transition-all duration-200"
              style={{
                filter: hoveredIndex === i ? 'drop-shadow(0 0 8px rgba(39, 211, 184, 0.6))' : 'none'
              }}
            />
          </g>
        ))}
      </svg>

      {hoveredIndex !== null && (
        <div
          className="absolute bg-gray-800 border border-gray-700 rounded-lg p-3 shadow-xl pointer-events-none z-10"
          style={{
            left: `${(hoveredIndex / (data.length - 1)) * 100}%`,
            top: '10px',
            transform: 'translateX(-50%)'
          }}
        >
          <p className="text-gray-400 text-sm mb-1">{data[hoveredIndex].day}</p>
          <p className="text-white font-bold text-lg">
            {data[hoveredIndex].price.toFixed(2)} SAR
          </p>
          {showConfidenceBands && data[hoveredIndex].upperBound && (
            <div className="text-xs text-gray-400 mt-2 space-y-1">
              <p>High: {data[hoveredIndex].upperBound.toFixed(2)} SAR</p>
              <p>Low: {data[hoveredIndex].lowerBound?.toFixed(2)} SAR</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
