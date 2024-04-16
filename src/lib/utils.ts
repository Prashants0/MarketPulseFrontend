import { symbol_list } from "@prisma/client";
import { createBrowserClient } from "@supabase/ssr";
import { useQuery } from "@tanstack/react-query";
import { type ClassValue, clsx } from "clsx";
import exp from "constants";
import { twMerge } from "tailwind-merge";

export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL!;

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function uuidv4() {
  return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (c) =>
    (
      +c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (+c / 4)))
    ).toString(16)
  );
}

export function useFilterSymbols(symbolQuery: string, symbols: symbol_list[]) {
  return useQuery({
    queryKey: ["symbols", symbolQuery],
    queryFn: async () => {
      if (symbolQuery == "") return [];
      const filteredSymbolsList = symbols.filter(
        (symbol) =>
          symbol.symbol.toLowerCase().includes(symbolQuery.toLowerCase()) ||
          symbol.security_name.toLowerCase().includes(symbolQuery.toLowerCase())
      );

      return filteredSymbolsList.slice(0, 30);
    },
  });
}
export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
