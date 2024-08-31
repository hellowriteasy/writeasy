import { create } from "zustand";

interface TAdminSidebarState {
  adminSidebarOpen: boolean;
  toggleSidebar: () => void;
}

// Create a Zustand store
const useAdminSidebarStore = create<TAdminSidebarState>((set) => ({
  adminSidebarOpen: false,
  toggleSidebar: () => {
    set((state) => ({ adminSidebarOpen: !state.adminSidebarOpen }));
  },
}));

export default useAdminSidebarStore;
