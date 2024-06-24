import create from 'zustand';

const useAuthStore = create((set) => ({
    isSubscriptionActive: false,
  setSubscriptionActive: (status) => set({ isSubscriptionActive: status }),
}));

export default useAuthStore;
