import { create } from "zustand";

interface AuthState {
  loggedIn: boolean;
  userId: string | null;
  token: string | null;
  login: (userId: string, token: string) => void;
  logout: () => void;
}

const useAuthStore = create<AuthState>((set) => {
  // Check if window is defined to ensure code runs only on the client-side
  if (typeof window !== "undefined") {
    const storedUserId = localStorage.getItem("userId");
    const storedToken = localStorage.getItem("token");
    const loggedIn = storedUserId !== null && storedToken !== null;

    return {
      loggedIn,
      userId: storedUserId,
      token: storedToken,
      login: (userId: string, token: string) => {
        set({ loggedIn: true, userId, token });
        localStorage.setItem("userId", userId);
        localStorage.setItem("token", token);
      },
      logout: () => {
        set({ loggedIn: false, userId: null, token: null });
        localStorage.removeItem("userId");
        localStorage.removeItem("token");
      },
    };
  } else {
    // Return default values for server-side rendering
    return {
      loggedIn: false,
      userId: null,
      token: null,
      login: () => {},
      logout: () => {},
    };
  }
});

export default useAuthStore;
