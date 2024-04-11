import { bse_symbol } from "@prisma/client";
import { create } from "zustand";

type SelectedSymbolState = {
  symbol: string;
  setSymbol: (symbol: string) => void;
};

export const useSelectedSymbolState = create<SelectedSymbolState>()((set) => ({
  symbol: "HDFCBANK",
  setSymbol: (symbol: string) => set({ symbol: symbol }),
}));
