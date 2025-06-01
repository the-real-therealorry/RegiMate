import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { PaperProvider } from 'react-native-paper';
import { ClerkProvider } from '@clerk/clerk-expo';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Navigation from './src/navigation';
import { AuthProvider } from './src/context/AuthContext';
import { ThemeProvider } from './src/context/ThemeContext';
import { RegionProvider } from './src/context/RegionContext';
import { SettingsProvider } from './src/context/SettingsContext';
import { FavoritesProvider } from './src/context/FavoritesContext';

// Clerk publish key would go here in a real app
const tokenCache = {
  getToken: (key: string) => {
    return AsyncStorage.getItem(key);
  },
  saveToken: (key: string, value: string) => {
    return AsyncStorage.setItem(key, value);
  },
};

export default function App() {
  return (
    <ClerkProvider tokenCache={tokenCache} publishableKey="YOUR_CLERK_PUBLISHABLE_KEY">
      <AuthProvider>
        <SafeAreaProvider>
          <PaperProvider>
            <ThemeProvider>
              <RegionProvider>
                <SettingsProvider>
                  <FavoritesProvider>
                    <NavigationContainer>
                      <Navigation />
                      <StatusBar style="auto" />
                    </NavigationContainer>
                  </FavoritesProvider>
                </SettingsProvider>
              </RegionProvider>
            </ThemeProvider>
          </PaperProvider>
        </SafeAreaProvider>
      </AuthProvider>
    </ClerkProvider>
  );
}