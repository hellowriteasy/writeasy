import { create } from "zustand";
import axios from "axios";

interface AuthState {
  loggedIn: boolean;
  userId: string | null;
  token: string | null;
  username: string | null;
  role: string | null;
  subscriptionType: string | null;
  isSubcriptionActive?: boolean;
  login: (userId: string, token: string) => void;
  logout: () => void;
}

const useAuthStore = create<AuthState>((set) => {
  // Check if window is defined to ensure code runs only on the client-side
  if (typeof window !== "undefined") {
    const storedUserId = localStorage.getItem("userId");
    const loggedIn = storedUserId !== null;

    const fetchUserDetails = async (userId: string) => {
      try {
        const response = await axios.get(`http://localhost:8000/api/auth/user/${userId}`);
        if (response.status === 200) {
          const { username, role, subscriptionType ,isSubcriptionActive} = response.data.message;
          set({ username, role, subscriptionType, isSubcriptionActive });
        } else {
          throw new Error(`Error: ${response.status}`);
        }
      } catch (error) {
        console.error("Failed to fetch user details", error);
      }
    };

    if (loggedIn && storedUserId) {
      fetchUserDetails(storedUserId);
    }


    return {
      loggedIn,
      userId: storedUserId,
      token: null,
      username: null,
      role: null,
      subscriptionType: null,
      login: async (userId: string, token: string) => {
        localStorage.setItem("userId", userId);
        set({ loggedIn: true, userId, token });

        // Fetch user details
        await fetchUserDetails(userId);
      },
      logout: () => {
        set({ loggedIn: false, userId: null, token: null, username: null, role: null, isSubcriptionActive:false, subscriptionType: null });
        localStorage.removeItem("userId");
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
