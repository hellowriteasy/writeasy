
import { create } from 'zustand';

interface AuthState {
  loggedIn: boolean;
  userId: string | null;
  login: (userId: string) => void;
  logout: () => void;
}

const useAuthStore = create<AuthState>((set) => {
  const storedUserId = localStorage.getItem('userId');
  const loggedIn = storedUserId !== null; 

  return {
    loggedIn, 
    userId: storedUserId,
    login: (userId: string) => {
      set({ loggedIn: true, userId });
      localStorage.setItem('userId', userId);
    },
    logout: () => {
      set({ loggedIn: false, userId: null });
      localStorage.removeItem('userId');
    },
  };
});

export default useAuthStore;
