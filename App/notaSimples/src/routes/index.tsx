import React from 'react';
import { NavigationContainer } from '@react-navigation/native';

import { PublicRoutes } from './public.stack.routes';
import { PrivateRoutes } from './private.stack.routes';

import { loginAuth } from '../hooks';

export const Routes = () => {
    const { isAuth, isLoading} = loginAuth();

    return (
        <NavigationContainer>
            {isAuth ? <PrivateRoutes /> : <PublicRoutes /> }
        </NavigationContainer>
    )
}