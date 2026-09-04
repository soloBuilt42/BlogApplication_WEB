import { create } from "zustand";

const readUser = () => {
  try {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  } catch {
    localStorage.removeItem("user");
    return null;
  }
};

const useStore = create((set) => ({
  user: readUser(),
  isLoading: false,
  theme: localStorage.getItem("theme") || "light",

  signIn: (data) => {
    localStorage.setItem("user", JSON.stringify(data));
    set({ user: data });
  },

  signOut: () => {
    localStorage.removeItem("user");
    set({ user: null });
  },

  setTheme: (value) => {
    localStorage.setItem("theme", value);
    set({ theme: value });
  },

  setIsLoading: (value) => set({ isLoading: value }),
}));

export default useStore;
