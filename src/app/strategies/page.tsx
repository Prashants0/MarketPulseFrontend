"use client";

import MaxWidthrapper from "@/components/MaxWidthrapper";
import React from "react";
import UserStrategy from "./components/UserStrategy";
import AddCard from "./components/AddCard";
import StrategyCard from "./components/StrategyCard";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/utils";
import axios from "axios";
import { user_trading_strategy } from "@prisma/client";

type UserStrategyListItem = {
  id: string;
  symbol_id: string;
  security_name: string;
  exchange: string;
  strategy: string;
  strategyType: string;
  targetPercentage: string;
  stopLossPercentage: string;
  quantity: number;
  symbol: string;
  symbolName: string;
  liveStatus: boolean;
};

const strateyList = [
  {
    id: 1,
    name: "Momo",
    description:
      "Momo is a momentum reversal strategy. The idea is to define strong momentum on a price chart that would support the reversal and a price explosion. ",
  },
  {
    id: 2,
    name: "EMA, MACD, and Bollinger Bands",
    description:
      "This is another 5-minute trading strategy. It involves EMA, MACD, and Bollinger Bands. ",
  },
  {
    id: 3,
    name: "EMA, RSI",
    description:
      "The exponential moving average is a beloved indicator for 5-minute trades. For this trading approach, we will add the RSI indicator. Its main purpose is to identify overbought and oversold conditions",
  },
  {
    id: 4,
    name: "EMA and Vwap",
    description:
      "This setup uses the 200 EMA for identifying the trend.It uses a vwap and an RSI to identify the oversold and overbought levels. ",
  },
];

const Page = () => {
  const { data: userStrategiesData } = useQuery({
    queryKey: ["userStrategies"],
    queryFn: async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user == undefined) {
        return;
      }
      const { data } = await axios.get(
        `/api/stratergy/getStrateries?user_id=${user.id}`
      );
      for (let i = 0; i < data.length; i++) {
        const { data: symbolData } = await axios.get(
          `/api/symbol/getSymbolDetail?symbol_id=${data[0].symbol_id}`
        );
        data[i].symbol = symbolData.symbol;
        data[i].security_name = symbolData.security_name;
        data[i].exchange = symbolData.exchange;
        data[i].symbolId = symbolData.id;
      }
      return data as UserStrategyListItem[];
    },
    refetchOnWindowFocus: false,
  });

  return (
    <MaxWidthrapper className="flex flex-col items-center justify-center text-center h-full px-0 md:px-0">
      <div className="h-[30%] w-full border-b ">
        <div className="h-full w-full flex flex-col justify-start self-start items-start">
          <h1 className="text-4xl p-6 h-1/4 font-bold">Live Strategies</h1>
          <div className="h-full flex p-5 justify-between items-start gap-4">
            {userStrategiesData?.map((strategy) => (
              <UserStrategy
                key={strategy.id}
                id={strategy.id}
                strategyTypeId={Number(strategy.strategy!)}
                symbolName={strategy.symbol}
                exchange={strategy.exchange}
              />
            ))}
            <AddCard />
          </div>
        </div>
      </div>
      <div className="h-[70%] w-full">
        <div className="h-full w-full flex flex-col justify-start self-start items-start">
          <h1 className="text-4xl font-bold p-6 h-1/4">List of Strategies</h1>
          <div className="h-full flex p-20 justify items-start gap-20">
            {strateyList.map((strategy) => (
              <StrategyCard
                key={strategy.name}
                StrategyName={strategy.name}
                StrategyDescription={strategy.description}
              />
            ))}
          </div>
        </div>
      </div>
    </MaxWidthrapper>
  );
};

export default Page;
