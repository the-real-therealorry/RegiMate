import React, { createContext, useContext, useState, useEffect } from 'react';
import { useClerk, useAuth as useClerkAuth } from '@clerk/clerk-expo';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: () => void;
  signOut: () => void;
  skipAuth: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isLoading: true,
  signIn: () => {},
  signOut: () => {},
  skipAuth: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [authSkipped, setAuthSkipped] = useState(false);
  const { signOut: clerkSignOut } = useClerk();
  const { isSignedIn } = useClerkAuth();

  // Check if auth is required on initial load
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const skipped = await AsyncStorage.getItem('authSkipped');
        if (skipped === 'true' || isSignedIn) {
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Failed to check auth status', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, [isSignedIn]);

  // Function to sign in using Clerk (would be implemented with actual UI)
  const signIn = () => {
    // This would be handled by Clerk UI components
    setIsAuthenticated(true);
  };

  // Function to sign out
  const signOut = async () => {
    try {
      if (isSignedIn) {
        await clerkSignOut();
      }
      await AsyncStorage.removeItem('authSkipped');
      setIsAuthenticated(false);
      setAuthSkipped(false);
    } catch (error) {
      console.error('Failed to sign out', error);
    }
  };

  // Function to skip authentication
  const skipAuth = async () => {
    try {
      await AsyncStorage.setItem('authSkipped', 'true');
      setAuthSkipped(true);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Failed to skip auth', error);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, signIn, signOut, skipAuth }}>
      {children}
    </AuthContext.Provider>
  );
};