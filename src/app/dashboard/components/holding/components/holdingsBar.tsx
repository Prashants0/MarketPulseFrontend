import { TableCell, TableRow } from "@/components/ui/table";
import React, { useState } from "react";
import { HoldingType } from "./holdings";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { BACKEND_URL } from "@/lib/utils";

const HoldingsBar = ({ holding }: { holding: HoldingType }) => {
  const [symbolChangeStatusCss, setSymbolChangeStatusCss] =
    useState<String>("text-gray-400");
  const [holdingSymbolData, setHoldingSymbolData] =
    useState<HoldingType>(holding);
  const { isLoading } = useQuery({
    queryKey: ["holding", holding.symbol, holding.exchange],
    queryFn: async () => {
      try {
        const { data: qutoe } = await axios.post(
          `${BACKEND_URL}/api/symbol/get_quote`,
          {
            symbol: holding.symbol,
            exchange: holding.exchange,
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
          holding.ltp = qutoe.price;
          holding.dayChange = qutoe.change;
          holding.dayChangePercent = qutoe.changePercent;
          holding.marketValue = qutoe.price * holding.quantity;

          setHoldingSymbolData(holding);
        }
        return holding;
      } catch (error) {
        console.log(error);
      }
    },
    refetchInterval: 300,
  });

  return (
    <>
      <TableRow key={holdingSymbolData.symbol}>
        <TableCell>{holdingSymbolData.symbol}</TableCell>
        <TableCell>{holdingSymbolData.quantity}</TableCell>
        <TableCell className={`${symbolChangeStatusCss}`}>
          {holdingSymbolData.ltp}
        </TableCell>
        <TableCell>{holdingSymbolData.costPrice}</TableCell>
        <TableCell className={`${symbolChangeStatusCss}`}>
          {holdingSymbolData.dayChange}
        </TableCell>
        <TableCell className={`${symbolChangeStatusCss}`}>
          {holdingSymbolData.dayChangePercent} %
        </TableCell>
        <TableCell>{holdingSymbolData.marketValue}</TableCell>
      </TableRow>
    </>
  );
};

export default HoldingsBar;
