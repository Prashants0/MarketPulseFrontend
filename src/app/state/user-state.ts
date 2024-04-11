import { create } from "zustand";

type userState = {
  user: string | undefined;
  setUser: (user: string) => void;
};

export const useUser = create<userState>((set) => ({
  user: undefined,
  setUser: (user) => set(() => ({ user })),
}));
