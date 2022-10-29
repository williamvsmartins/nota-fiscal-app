import { View } from "react-native";

import { AuthProvider } from './src/contexts/AuthContext';
import { Routes } from './src/routes';

export default function App() {
  return (
    <View style={{ flex: 1}}>
      <AuthProvider>
        <Routes />
      </AuthProvider>
    </View>
  );
}