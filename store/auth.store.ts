import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Profile, VerificationStatus, UserTier, UserRole } from '../lib/types';

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  verificationStatus: VerificationStatus;
  tier: UserTier;
  role: UserRole;
  badgeLevel?: number;
  readinessScore?: number;
  profile?: Profile | null;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null; // Add refresh token
  isAuthenticated: boolean;
  isLoading: boolean;
  setCredentials: (user: User, accessToken: string, refreshToken: string) => void;
  updateUser: (partial: Partial<User>) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  /** @alias logout — backward compatibility with Sidebar */
  clearCredentials: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null, // Add refresh token
      isAuthenticated: false,
      isLoading: true, // Start as loading to prevent flash
      setCredentials: (user, accessToken, refreshToken) => set({ user, accessToken, refreshToken, isAuthenticated: true, isLoading: false }),
      updateUser: (partial) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...partial } : null,
        })),
      logout: () => set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false, isLoading: false }),
      setLoading: (loading) => set({ isLoading: loading }),
      clearCredentials: () => set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false, isLoading: false }),
    }),
    {
      name: 'auth-storage', // Used in api interceptor to dynamically inject the token
      onRehydrateStorage: () => (state) => {
        // After rehydration, set loading to false
        if (state) {
          state.isLoading = false;
        }
      },
    }
  )
);
