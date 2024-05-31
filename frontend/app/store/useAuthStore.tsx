import { create } from "zustand";

interface AuthState {
  loggedIn: boolean;
  userId: string | null;
  token: string | null;
  username: string | null;
  role: string | null;
  subscriptionType: string | null;
  login: (userId: string, token: string, username: string, role: string, subscriptionType: string) => void;
  logout: () => void;
}

const useAuthStore = create<AuthState>((set) => {
  // Check if window is defined to ensure code runs only on the client-side
  if (typeof window !== "undefined") {
    const storedUserId = localStorage.getItem("userId");
    const storedToken = localStorage.getItem("token");
    const storedUsername = localStorage.getItem("username");
    const storedRole = localStorage.getItem("role");
    const storedSubscriptionType = localStorage.getItem("subscriptionType");
    const loggedIn = storedUserId !== null && storedToken !== null;

    return {
      loggedIn,
      userId: storedUserId,
      token: storedToken,
      username: storedUsername,
      role: storedRole,
      subscriptionType: storedSubscriptionType,
      login: (userId: string, token: string, username: string, role: string, subscriptionType: string) => {
        set({ loggedIn: true, userId, token, username, role, subscriptionType });
        localStorage.setItem("userId", userId);
        localStorage.setItem("token", token);
        localStorage.setItem("username", username);
        localStorage.setItem("role", role);
        localStorage.setItem("subscriptionType", subscriptionType);
      },
      logout: () => {
        set({ loggedIn: false, userId: null, token: null, username: null, role: null, subscriptionType: null });
        localStorage.removeItem("userId");
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        localStorage.removeItem("role");
        localStorage.removeItem("subscriptionType");
      },
    };
  } else {
    // Return default values for server-side rendering
    return {
      loggedIn: false,
      userId: null,
      token: null,
      username: null,
      role: null,
      subscriptionType: null,
      login: () => {},
      logout: () => {},
    };
  }
});

export default useAuthStore;
