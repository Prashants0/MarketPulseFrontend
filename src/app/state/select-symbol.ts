import { create } from "zustand";

type SelectedSymbolState = {
  symbol: string;
  symbolId: string;
  exchange: string;
  setSymbol: (symbol: string) => void;
  setSymbolId: (symbolId: string) => void;
  setExchange: (exchange: string) => void;
};

export const useSelectedSymbolState = create<SelectedSymbolState>()((set) => ({
  symbolId: "ab46973a-d361-471d-b2ff-8b5cd879cf5b",
  symbol: "HDFCBANK",
  exchange: "NSE",
  setSymbol: (symbol: string) => set({ symbol: symbol }),
  setSymbolId: (symbolId: string) => set({ symbolId: symbolId }),
  setExchange: (exchange: string) => set({ exchange: exchange }),
}));
