import { Socket } from "socket.io-client";
import { create } from "zustand";

type fyersSocketApiRefStore = {
  fyersSocket: Socket | undefined;
  setFyersSocket: (fyersSocket: Socket) => void;
};

export const useFyersSocketState = create<fyersSocketApiRefStore>()((set) => ({
  fyersSocket: undefined,
  setFyersSocket: (fyersSocket: Socket) => set({ fyersSocket: fyersSocket }),
}));
