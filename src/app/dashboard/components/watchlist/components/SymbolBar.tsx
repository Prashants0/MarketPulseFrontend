"use client";
import { useSelectedSymbolState } from "@/app/state/select-symbol";
import { Separator } from "@/components/ui/separator";
import { BACKEND_URL } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React from "react";

function SymbolBar({ symbol_id }: { symbol_id: string }) {
  const { setSymbolId } = useSelectedSymbolState();

  const [symbolPositiveStatusCSS, setSymbolPositiveStatusCSS] =
    React.useState<string>("text-green-400");
  const { data: symbol_data, isLoading } = useQuery({
    queryKey: ["symbol", symbol_id],
    queryFn: async () => {
      const { data } = await axios.post(`${BACKEND_URL}/api/symbol/get_quote`, {
        symbol: symbol_id,
      });
      if (data.change > 0) {
        setSymbolPositiveStatusCSS("text-green-400");
      }
      if (data.change < 0) {
        setSymbolPositiveStatusCSS("text-red-400");
      }
      if (data.change === 0) {
        setSymbolPositiveStatusCSS("text-gray-400");
      }
      return data;
    },
    refetchInterval: 300,
    refetchIntervalInBackground: true,
  });
  if (isLoading) {
    return <div>Loading...</div>;
  }
  return (
    <>
      <div
        className="justify-between flex py-0 px-2 hover:cursor-pointer"
        onClick={(e) => {
          setSymbolId(symbol_id);
        }}
      >
        <div className="flex-col items-center gap-2">
          <div>{symbol_data.symbol}</div>
          <div className="text-sm text-gray-400">{symbol_data.exchange}</div>
        </div>
        <div className="grid  p-0.5 grid-cols-2 justify-items-end  text-sm">
          <span className="col-span-2">{symbol_data.price}</span>
          <span className={`text-xs p-0.5 ${symbolPositiveStatusCSS}`}>
            {symbol_data.change}
          </span>
          <span className={`text-xs p-0.5 ${symbolPositiveStatusCSS}`}>
            ( {symbol_data.changePercent} % )
          </span>
        </div>
      </div>
      <Separator />
    </>
  );
}

export default SymbolBar;
