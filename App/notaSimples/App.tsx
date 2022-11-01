import React, { useEffect } from 'react';
import { View } from "react-native";
import * as Updates from 'expo-updates';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { AuthProvider } from './src/contexts/AuthContext';
import { Routes } from './src/routes';

export default function App() {

  useEffect(() => {
    async function updateApp() {
      const { isAvailable } = await Updates.checkForUpdateAsync();
      if (isAvailable) {
        await Updates.fetchUpdateAsync();
        await Updates.reloadAsync(); // depende da sua estratégia
      }
    }
    updateApp();
  }, []);

  useEffect(() => {
   AsyncStorage.clear()
  }, [])
  return (
    <View style={{ flex: 1}}>
      <AuthProvider>
        <Routes />
      </AuthProvider>
    </View>
  );
}