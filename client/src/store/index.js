import {create} from "zustand";

const useStore = create((set) => ({
     user:JSON.parse(localStorage.getItem("user")),
     isLoading:false,

     theme : localStorage.getItem("theme") || "light",
     signIn: (data) => set(() => ({ user: data })),
     setTheme : (value) => set({ theme:value}),
     signOut : ()=>set({ user :{}}),
     setIsLoading : (val) => set({isLoading:val}),

}));

export default useStore;