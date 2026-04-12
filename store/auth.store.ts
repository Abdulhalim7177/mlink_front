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
  isAuthenticated: boolean;
  setCredentials: (user: User, accessToken: string) => void;
  updateUser: (partial: Partial<User>) => void;
  logout: () => void;
  /** @alias logout — backward compatibility with Sidebar */
  clearCredentials: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      setCredentials: (user, accessToken) => set({ user, accessToken, isAuthenticated: true }),
      updateUser: (partial) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...partial } : null,
        })),
      logout: () => set({ user: null, accessToken: null, isAuthenticated: false }),
      clearCredentials: () => set({ user: null, accessToken: null, isAuthenticated: false }),
    }),
    {
      name: 'auth-storage', // Used in api interceptor to dynamically inject the token
    }
  )
);
