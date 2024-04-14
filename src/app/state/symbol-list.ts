import { symbol_list } from "@prisma/client";
import { create } from "zustand";

type SymbolListState = {
  symbolsList: symbol_list[];
  setSymbols: (symbolsList: symbol_list[]) => void;
};

export const useSymbolListState = create<SymbolListState>()((set) => ({
  symbolsList: [],
  setSymbols: (symbols: symbol_list[]) => set({ symbolsList: symbols }),
}));
