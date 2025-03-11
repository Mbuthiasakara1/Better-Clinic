import { create } from "zustand";

const useStore = create((set) => ({
    isPressed: false,
    setIsPressed: (val) => set({ isPressed: val }),
    formData:{
      firstName: '',
      lastName: '',
      email: '',
      gender: '',
      phone_number: '',
    },
    setFormData: (data) => set({ formData: data }),
    setStep: (data) => set({ step: data }),
    isSuccessful: false,
    setIsSuccessful: (val) => set({ isSuccessful: val }),
    setScore: (data) => set({ score: data }),
  }));

export default useStore;