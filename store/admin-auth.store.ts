import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AdminUser } from '../lib/types';

interface AdminAuthState {
  admin: AdminUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  setCredentials: (admin: AdminUser, accessToken: string) => void;
  updateAdmin: (partial: Partial<AdminUser>) => void;
  logout: () => void;
  clearCredentials: () => void;
}

export const useAdminAuthStore = create<AdminAuthState>()(
  persist(
    (set) => ({
      admin: null,
      accessToken: null,
      isAuthenticated: false,
      setCredentials: (admin, accessToken) => set({ admin, accessToken, isAuthenticated: true }),
      updateAdmin: (partial) =>
        set((state) => ({
          admin: state.admin ? { ...state.admin, ...partial } : null,
        })),
      logout: () => set({ admin: null, accessToken: null, isAuthenticated: false }),
      clearCredentials: () => set({ admin: null, accessToken: null, isAuthenticated: false }),
    }),
    {
      name: 'admin-auth-storage', // Used in admin-api interceptor dynamically
    }
  )
);
