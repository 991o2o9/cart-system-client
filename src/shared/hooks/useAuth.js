import axios from 'axios';
import { create } from 'zustand';
import { BASE_URL, tokens } from '../constants/constants';
import { $authApi } from '../lib/requester/requester';

export const useAuth = create((set, get) => ({
  isAuth: !!localStorage.getItem(tokens.access),
  isLoggingOut: false,
  isLoadingUser: false,
  user: null,
  justRegistered: false,

  setJustRegistered: (value) => set({ justRegistered: value }),

  setUser: (user) => set({ user }),

  setAuth: (isAuth) => {
    set({ isAuth });
    if (!isAuth) {
      localStorage.removeItem(tokens.access);
      localStorage.removeItem(tokens.refresh);
      set({ user: null });
    }
  },

  setTokens: (accessToken, refreshToken) => {
    localStorage.setItem(tokens.access, accessToken);
    localStorage.setItem(tokens.refresh, refreshToken);
    set({ isAuth: true });
  },

  register: async (data) => {
    try {
      const response = await axios.post(`${BASE_URL}/api/auth/register`, data);
      return response.data;
    } catch (error) {
      return Promise.reject(error);
    }
  },

  activateAccount: async (data) => {
    try {
      const response = await axios.post(`${BASE_URL}/api/auth/activate`, data);
      return response.data;
    } catch (error) {
      return Promise.reject(error);
    }
  },

  login: async (data) => {
    try {
      const response = await axios.post(`${BASE_URL}/api/auth/login`, data);
      const { access_token, refresh_token } = response.data;

      localStorage.setItem(tokens.access, access_token);
      localStorage.setItem(tokens.refresh, refresh_token);

      set({ isAuth: true });

      try {
        await get().fetchUserData();
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    } catch (error) {
      return Promise.reject(error);
    }
  },

  logout: () => {
    set({ isAuth: false, user: null, isLoggingOut: true });
    localStorage.removeItem(tokens.access);
    localStorage.removeItem(tokens.refresh);
    localStorage.removeItem('user');

    $authApi
      .post('/auth/logout')
      .catch((err) => console.error('Error during logout:', err));

    set({ isLoggingOut: false });
  },

  fetchUserData: async () => {
    try {
      set({ isLoadingUser: true });
      const response = await $authApi.get('auth/me');
      const userData = response.data;
      set({ user: userData });
    } catch (error) {
      console.error('Error fetching user data:', error);
      get().setAuth(false);
    } finally {
      set({ isLoadingUser: false });
    }
  },
}));
