import { create } from "zustand";
import { axiosInstance } from "../utils/config/axios";

interface AuthState {
  loggedIn: boolean;
  userId: string | null;
  token: string | null;
  username: string | null;
  email: string | null;
  role: string | null;
  status?: string;
  subscriptionType: string | null;
  subscriptionRemainingDays?: number | null;
  profile_picture?: string | null;
  isSubcriptionActive?: boolean;
  subscriptionStatus?: "trialing" | "active";
  login: (userId: string, token: string) => void;
  logout: () => void;
}

const useAuthStore = create<AuthState>((set) => {
  // Check if window is defined to ensure code runs only on the client-side
  if (typeof window !== "undefined") {
    const storedUserId = localStorage.getItem("userId");
    const loggedIn = storedUserId !== null;
    const AxiosIns = axiosInstance("");
    const fetchUserDetails = async (userId: string) => {
      try {
        const response = await AxiosIns.get(`/auth/user/${userId}`);
        if (response.status === 200) {
          const {
            username,
            role,
            subscriptionType,
            isSubcriptionActive,
            subscriptionRemainingDays,
            profile_picture,
            email,
            status,
            subscriptionStatus,
          } = response.data.message;
          set({
            username,
            role,
            subscriptionType,
            isSubcriptionActive,
            subscriptionRemainingDays,
            profile_picture,
            subscriptionStatus,
            email,
            status,
          });
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
      email: null,
      status: "",
      subscriptionType: null,
      login: async (userId: string, token: string) => {
        localStorage.setItem("userId", userId);
        set({ loggedIn: true, userId, token });

        // Fetch user details
        await fetchUserDetails(userId);
      },
      logout: () => {
        set({
          loggedIn: false,
          userId: null,
          token: null,
          username: null,
          role: null,
          isSubcriptionActive: false,
          email: null,

          subscriptionType: null,
        });
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
      email: null,
      subscriptionType: null,
      login: () => {},
      logout: () => {},
    };
  }
});

export default useAuthStore;
