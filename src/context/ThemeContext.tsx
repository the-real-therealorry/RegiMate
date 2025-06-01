import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  card: string;
  text: string;
  border: string;
  accent: string;
  success: string;
  warning: string;
  error: string;
}

interface Theme {
  dark: boolean;
  colors: ThemeColors;
}

const lightTheme: Theme = {
  dark: false,
  colors: {
    primary: '#2563eb',
    secondary: '#64748b',
    background: '#ffffff',
    card: '#f8fafc',
    text: '#0f172a',
    border: '#e2e8f0',
    accent: '#3b82f6',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
  },
};

const darkTheme: Theme = {
  dark: true,
  colors: {
    primary: '#3b82f6',
    secondary: '#64748b',
    background: '#0f172a',
    card: '#1e293b',
    text: '#f8fafc',
    border: '#334155',
    accent: '#60a5fa',
    success: '#34d399',
    warning: '#fbbf24',
    error: '#f87171',
  },
};

interface ThemeContextType {
  theme: Theme;
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: lightTheme,
  isDarkMode: false,
  toggleTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const theme = isDarkMode ? darkTheme : lightTheme;

  useEffect(() => {
    // Load theme preference from storage
    const loadThemePreference = async () => {
      try {
        const storedTheme = await AsyncStorage.getItem('themePref');
        if (storedTheme !== null) {
          setIsDarkMode(storedTheme === 'dark');
        }
      } catch (error) {
        console.error('Failed to load theme preference', error);
      }
    };

    loadThemePreference();
  }, []);

  const toggleTheme = async () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    
    // Save theme preference to storage
    try {
      await AsyncStorage.setItem('themePref', newMode ? 'dark' : 'light');
    } catch (error) {
      console.error('Failed to save theme preference', error);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};