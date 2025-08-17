import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
  id: string;
  email: string;
  name: string;
  photo?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  checkAuthState: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuthState = async () => {
    try {
      // Check AsyncStorage for saved user data
      const savedUser = await AsyncStorage.getItem('user');
      if (savedUser) {
        const userInfo: User = JSON.parse(savedUser);
        setUser(userInfo);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.log('Error checking auth state:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async () => {
    try {
      setIsLoading(true);
      
      // Simulate Google Sign-In with mock data
      // In a real app, this would integrate with Google OAuth
      const mockUser: User = {
        id: 'mock-user-123',
        email: 'user@example.com',
        name: 'Demo User',
        photo: 'https://via.placeholder.com/150',
      };
      
      // Save user data to AsyncStorage
      await AsyncStorage.setItem('user', JSON.stringify(mockUser));
      
      setUser(mockUser);
      setIsAuthenticated(true);
    } catch (error) {
      console.log('Sign in error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      
      // Clear user data from AsyncStorage
      await AsyncStorage.removeItem('user');
      
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.log('Sign out error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuthState();
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      isLoading,
      signIn,
      signOut,
      checkAuthState,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
