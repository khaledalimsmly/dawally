import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  dir?: 'ltr' | 'rtl';
}

export const Card = ({ children, className = '', hover = false, dir }: CardProps) => {
  const hoverClass = hover
    ? 'hover:border-teal-400/50 hover:shadow-lg hover:shadow-teal-500/20 hover:-translate-y-1 cursor-pointer'
    : '';

  return (
    <div
      className={`bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 transition-all duration-300 ${hoverClass} ${className}`}
      dir={dir}
    >
      {children}
    </div>
  );
};
