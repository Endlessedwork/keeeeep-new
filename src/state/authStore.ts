import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { User } from "../types/bookmark";
import { AuthService } from "../services/authService";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { auth } from "../config/firebase";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../config/firebase";

interface AuthState {
  currentUser: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<boolean>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<boolean>;
  changePassword: (newPassword: string) => Promise<boolean>;
  initializeAuth: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  currentUser: null,
  isAuthenticated: false,
  loading: true,

  login: async (email: string, password: string) => {
    try {
      set({ loading: true });
      const user = await AuthService.loginWithEmail(email, password);
      if (user) {
        set({ currentUser: user, isAuthenticated: true, loading: false });
        return true;
      }
      set({ loading: false });
      return false;
    } catch (error) {
      console.error('Login error in store:', error);
      set({ loading: false });
      return false;
    }
  },

  register: async (email: string, password: string, name: string) => {
    try {
      set({ loading: true });
      const user = await AuthService.registerWithEmail(email, password, name);
      if (user) {
        set({ currentUser: user, isAuthenticated: true, loading: false });
        return true;
      }
      set({ loading: false });
      return false;
    } catch (error) {
      console.error('Registration error in store:', error);
      set({ loading: false });
      return false;
    }
  },

  loginWithGoogle: async () => {
    try {
      set({ loading: true });
      const user = await AuthService.loginWithGoogle();
      if (user) {
        set({ currentUser: user, isAuthenticated: true, loading: false });
        return true;
      }
      set({ loading: false });
      return false;
    } catch (error) {
      console.error('Google login error in store:', error);
      set({ loading: false });
      return false;
    }
  },

  logout: async () => {
    try {
      await AuthService.logout();
      set({ currentUser: null, isAuthenticated: false });
    } catch (error) {
      console.error('Logout error in store:', error);
      throw error;
    }
  },

  resetPassword: async (email: string) => {
    try {
      await AuthService.resetPassword(email);
      return true;
    } catch (error) {
      console.error('Reset password error in store:', error);
      return false;
    }
  },

  changePassword: async (newPassword: string) => {
    try {
      await AuthService.changePassword(newPassword);
      return true;
    } catch (error) {
      console.error('Change password error in store:', error);
      return false;
    }
  },

  initializeAuth: () => {
    onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        try {
          // Get user data from Firestore
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data() as User;
            set({
              currentUser: userData,
              isAuthenticated: true,
              loading: false
            });
          } else {
            set({
              currentUser: null,
              isAuthenticated: false,
              loading: false
            });
          }
        } catch (error) {
          console.error('Auth state change error:', error);
          set({
            currentUser: null,
            isAuthenticated: false,
            loading: false
          });
        }
      } else {
        set({
          currentUser: null,
          isAuthenticated: false,
          loading: false
        });
      }
    });
  },
}));

// Export initializeAuth function for use in App.tsx
export const initializeAuth = () => {
  useAuthStore.getState().initializeAuth();
};
