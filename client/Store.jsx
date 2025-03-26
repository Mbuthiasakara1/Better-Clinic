import { create } from "zustand";

const useStore = create((set) => ({
  Session: [],
  setSession: (value) => set({ Session: value }),
}));


export default useStore;
