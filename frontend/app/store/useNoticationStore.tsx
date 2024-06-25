import create from 'zustand';

const useAuthStore = create((set) => ({
    isSubscriptionActive: false,
  setSubscriptionActive: (status:boolean) => set({ isSubscriptionActive: status }),
}));

export default useAuthStore;
