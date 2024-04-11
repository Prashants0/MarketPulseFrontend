import { bse_symbol } from "@prisma/client";
import { createBrowserClient } from "@supabase/ssr";
import { useQuery } from "@tanstack/react-query";
import { type ClassValue, clsx } from "clsx";
import exp from "constants";
import { twMerge } from "tailwind-merge";

export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function useFilterSymbols(symbolQuery: string, symbols: bse_symbol[]) {
  return useQuery({
    queryKey: ["symbols", symbolQuery],
    queryFn: async () => {
      if (symbolQuery == "") return [];
      const filteredSymbolsList = symbols.filter(
        (symbol) =>
          symbol.symbol_Id.toLowerCase().includes(symbolQuery.toLowerCase()) ||
          symbol.issuer_name.toLowerCase().includes(symbolQuery.toLowerCase())
      );

      return filteredSymbolsList.slice(0, 30);
    },
  });
}
export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
