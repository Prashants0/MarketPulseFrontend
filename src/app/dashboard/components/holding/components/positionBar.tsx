import { TableCell, TableRow } from "@/components/ui/table";
import React, { useState } from "react";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { BACKEND_URL } from "@/lib/utils";
import { PositionType } from "./postions";

const PositionBar = ({ position }: { position: PositionType }) => {
  const [symbolChangeStatusCss, setSymbolChangeStatusCss] =
    useState<String>("text-gray-400");
  const [positionSymbolData, setPositionSymbolData] =
    useState<PositionType>(position);
  const { isLoading } = useQuery({
    queryKey: ["position", position.symbol, position.exchange],
    queryFn: async () => {
      try {
        let exchangeSymbol = "NSE";
        if (position.exchange == 10) {
          exchangeSymbol = "NSE";
        } else if (position.exchange == 12) {
          exchangeSymbol = "BSE";
        }
        const { data: qutoe } = await axios.post(
          `${BACKEND_URL}/api/symbol/get_quote`,
          {
            symbol: position.symbol,
            exchange: position.exchange,
            type: "holding",
          }
        );
        {
          if (qutoe.change > 0) {
            setSymbolChangeStatusCss("text-green-400");
          }
          if (qutoe.change < 0) {
            setSymbolChangeStatusCss("text-red-400");
          }
          if (qutoe.change === 0) {
            setSymbolChangeStatusCss("text-gray-400");
          }
          position.ltp = qutoe.price;
          position.costPrice = qutoe.price * position.qty;
          position.pl = qutoe.price - position.avgPrice;

          setPositionSymbolData(position);
        }
        return position;
      } catch (error) {
        console.log(error);
      }
    },
    refetchInterval: 300,
  });

  return (
    <>
      <TableRow key={positionSymbolData.symbol}>
        <TableCell>{positionSymbolData.symbol}</TableCell>
        <TableCell>{positionSymbolData.qty}</TableCell>
        <TableCell>{positionSymbolData.side == 1 ? "Buy" : "Sell"}</TableCell>
        <TableCell>{positionSymbolData.costPrice}</TableCell>
        <TableCell>{positionSymbolData.ltp}</TableCell>
        <TableCell>{positionSymbolData.buyAvg}</TableCell>
        <TableCell>{positionSymbolData.sellAvg}</TableCell>
        <TableCell>{positionSymbolData.avgPrice}</TableCell>
        <TableCell>
          {positionSymbolData.exchange == 10 ? "NSE" : "BSE"}
        </TableCell>
        <TableCell>{positionSymbolData.pl}</TableCell>
      </TableRow>
    </>
  );
};

export default PositionBar;
