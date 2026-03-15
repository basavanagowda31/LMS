import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../lib/api';

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,

      setAuth: (user, accessToken) => set({
        user,
        accessToken,
        isAuthenticated: !!user
      }),
      
      setAccessToken: (accessToken) => set({ accessToken }),

      logout: async () => {
        try {
          await api.post('/auth/logout');
        } catch (err) {} // ignore fail
        set({ user: null, accessToken: null, isAuthenticated: false });
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);
