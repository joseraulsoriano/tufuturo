import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

type AuthUser = {
  id: string;
  name?: string | null;
  email?: string | null;
  photo?: string | null;
  idToken?: string | null;
};

type AuthContextValue = {
  user: AuthUser | null;
  initializing: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  authEnabled: boolean;
  setAuthEnabled: (enabled: boolean) => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const STORAGE_KEY = 'auth:user';
const STORAGE_AUTH_ENABLED_KEY = 'auth:enabled';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [initializing, setInitializing] = useState<boolean>(true);
  const [authEnabled, setAuthEnabledState] = useState<boolean>(true);

  useEffect(() => {
    const init = async () => {
      try {
        const extra = (Constants as any)?.expoConfig?.extra || (Constants as any)?.manifest?.extra || {};
        const webClientId: string | undefined = extra.googleWebClientId;
        const iosClientId: string | undefined = extra.googleIosClientId;
        const defaultAuthEnabled: boolean = typeof extra.authEnabled === 'boolean' ? extra.authEnabled : true;

        // Load persisted override for authEnabled
        const persistedAuthEnabled = await AsyncStorage.getItem(STORAGE_AUTH_ENABLED_KEY);
        const enabled = persistedAuthEnabled != null ? persistedAuthEnabled === 'true' : defaultAuthEnabled;
        setAuthEnabledState(enabled);

        // Configure Google Sign-In only when auth is enabled and not Expo Go
        if (enabled && (Constants as any)?.appOwnership !== 'expo') {
          const { GoogleSignin } = await import('@react-native-google-signin/google-signin');
          GoogleSignin.configure({
            webClientId,
            iosClientId,
            offlineAccess: true,
          });
        }

        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          setUser(JSON.parse(stored));
        }
      } catch (e) {
        console.log('Auth init error:', e);
      } finally {
        setInitializing(false);
      }
    };
    init();
  }, []);

  const signInWithGoogle = async () => {
    // If auth is disabled, set a mock user for development
    if (!authEnabled) {
      const mock: AuthUser = {
        id: 'dev-user',
        name: 'Developer',
        email: 'dev@example.com',
        photo: null,
        idToken: null,
      };
      setUser(mock);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(mock));
      return;
    }

    // This native module will not work in Expo Go. Require dev client or standalone build.
    if ((Constants as any)?.appOwnership === 'expo') {
      throw new Error('Google Sign-In requires a development build or standalone app (not Expo Go).');
    }
    try {
      // Dynamically import native module
      const { GoogleSignin } = await import('@react-native-google-signin/google-signin');

      // Android-specific: ensure Play Services
      try {
        await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      } catch (err) {
        // Continue; on iOS this is not applicable
      }

      // Trigger native sign in
      await GoogleSignin.signIn();

      // Retrieve current user and tokens in a type-safe way
      const current = await GoogleSignin.getCurrentUser();
      const tokens = await GoogleSignin.getTokens().catch(() => null as any);

      const profile = (current as any)?.user ?? null;
      const idToken = tokens?.idToken ?? null;

      const authUser: AuthUser = {
        id: profile?.id ?? 'unknown',
        name: profile?.name ?? null,
        email: profile?.email ?? null,
        photo: profile?.photo ?? null,
        idToken,
      };

      setUser(authUser);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(authUser));
    } catch (e) {
      console.log('Google Sign-In failed:', e);
      throw e;
    }
  };

  const signOut = async () => {
    try {
      if (authEnabled && (Constants as any)?.appOwnership !== 'expo') {
        const { GoogleSignin } = await import('@react-native-google-signin/google-signin');
        await GoogleSignin.signOut();
      }
    } catch (e) {
      // Ignore signOut failures; proceed to clear local state
    }
    setUser(null);
    await AsyncStorage.removeItem(STORAGE_KEY);
  };

  const setAuthEnabled = async (enabled: boolean) => {
    setAuthEnabledState(enabled);
    await AsyncStorage.setItem(STORAGE_AUTH_ENABLED_KEY, enabled ? 'true' : 'false');
  };

  const value = useMemo<AuthContextValue>(
    () => ({ user, initializing, signInWithGoogle, signOut, authEnabled, setAuthEnabled }),
    [user, initializing, authEnabled]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
};