import { create } from "zustand";

const useStore = create((set) => ({
  Session: null,
  setSession: (sessionId) => {
    if (!sessionId) {
      console.error("Attempting to set an invalid session ID");
      return;
    }
    set({ Session: sessionId });
    console.log("Session ID set successfully:", sessionId);
  },
  user: null,
  setUser: (user) => set({ user }),
}));

export default useStore;
