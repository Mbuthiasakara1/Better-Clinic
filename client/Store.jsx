import { create } from "zustand";

const useStore = create((set) => ({
  isPressed: false,
  setIsPressed: (val) => set({ isPressed: val }),
  formData: {
    first_name: "",
    last_name: "",
    email: "",
    gender: "",
    mobile_number: "",
    age_group: "",
  },
  setFormData: (data) => set({ formData: data }),
  setStep: (data) => set({ step: data }),
  isSuccessful: false,
  setIsSuccessful: (val) => set({ isSuccessful: val }),
  setScore: (data) => set({ score: data }),
}));

export default useStore;