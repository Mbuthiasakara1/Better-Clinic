import { create } from "zustand";

const useStore = create((set) => ({
  Session: null,
  setSession: (sessionId) => {
    if (!sessionId) {
      return;
    }
    set({ Session: sessionId });
  },
  user: null,
  setUser: (user) => set({ user }),
}));

export default useStore;
