





// AutoLogoutProvider.tsx
import React from 'react';
import { useAuth } from './AuthProvider';
import { useAutoLogout } from './useAutoLogout';

export const AutoLogoutProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const { resetTimer } = useAutoLogout();

  React.useEffect(() => {
    if (isAuthenticated) {
      resetTimer();
    }
  }, [isAuthenticated, resetTimer]);

  return <>{children}</>;
};