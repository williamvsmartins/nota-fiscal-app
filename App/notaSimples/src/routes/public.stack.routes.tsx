import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { Login } from '../pages/Login';

const StackRoutes = createNativeStackNavigator();

export const PublicRoutes = () => (
    <StackRoutes.Navigator
      screenOptions={{
        headerShown: false
      }}
    >
      <StackRoutes.Screen name="Login" component={Login} />
    
  </StackRoutes.Navigator>
);