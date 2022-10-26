import { useContext } from 'react';

import { AuthContext } from '../../contexts/AuthContext';

export function loginAuth() {
    const context = useContext(AuthContext);
  
    if (!context) {
      throw new Error('useUsermust be used within an UserProvider');
    }
  
    return context;
}

