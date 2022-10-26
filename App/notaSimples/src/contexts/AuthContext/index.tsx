import React, { createContext, useEffect, useState } from 'react';

import { AuthContextData, AuthProviderProps, Data } from './types';
import { saveLoginStorage, getLoginStorage, Login } from '../../libs/storage';

export const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: AuthProviderProps) {
    const [isLoading, setIsloading] = useState(true);
    const [login, setLogin] = useState<Login | null>(null);
  
    useEffect(() => {
      (async function () {
        const data = await getLoginStorage();
  
        
        setLogin(data);
        setIsloading(false);
      })()
}, [])

    async function handleAuth(user: Data) {
        await saveLoginStorage(user);

        setLogin(user);
    }

    return (
        <AuthContext.Provider
          value={{
            login,
            isAuth: !!login?.cnpj && !login?.password,
            isLoading,
            handleAuth
          }}
        >
          {children}
        </AuthContext.Provider>
      )
}