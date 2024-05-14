import { create } from "zustand";

interface AuthState {
  loggedIn: boolean;
  userId: string | null;
  login: (userId: string) => void;
  logout: () => void;
}

const useAuthStore = create<AuthState>((set) => {
  // Check if window is defined to ensure code runs only on the client-side
  if (typeof window !== "undefined") {
    const storedUserId = localStorage.getItem("userId");
    const loggedIn = storedUserId !== null;

    return {
      loggedIn,
      userId: storedUserId,
      login: (userId: string) => {
        set({ loggedIn: true, userId });
        localStorage.setItem("userId", userId);
      },
      logout: () => {
        set({ loggedIn: false, userId: null });
        localStorage.removeItem("userId");
      },
    };
  } else {
    // Return default values for server-side rendering
    return {
      loggedIn: false,
      userId: null,
      login: () => {},
      logout: () => {},
    };
  }
});

export default useAuthStore;
