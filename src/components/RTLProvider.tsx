import { ReactNode } from 'react';
import { useRTL } from '../hooks/useRTL';

interface RTLProviderProps {
  children: ReactNode;
}

export const RTLProvider = ({ children }: RTLProviderProps) => {
  useRTL();
  return <>{children}</>;
};
