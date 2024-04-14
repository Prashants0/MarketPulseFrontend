"use client";

import Chart from "@/app/dashboard/components/chart/chart";
import { useSymbolListState } from "@/app/state/symbol-list";
import MaxWidthrapper from "@/components/MaxWidthrapper";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { BACKEND_URL, useFilterSymbols } from "@/lib/utils";
import { SymbolEmaRsiData } from "@/types/symbol-types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { ChangeEvent, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import BacktestChart, { StrategyTypeEnum } from "../components/BacktestChart";
import PercentageInput from "@/components/ui/percentage-Input";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";

const Page = ({ params }: { params: { id: string } }) => {
  const { toast } = useToast();
  const { push } = useRouter();
  const [symbol, setSymbol] = React.useState<string>("");
  const [dialogOpen, setDialogOpen] = React.useState<boolean>(false);
  const [symbolId, setSymbolId] = React.useState<string>("");
  const [exchange, setExchange] = React.useState<string>("");
  const [strategyType, setStrategyType] =
    React.useState<string>("Select Strategy");
  const [targetPercentage, setTargetPercentage] = React.useState<string>("0.0");
  const [stopLossPercentage, setStopLossPercentage] =
    React.useState<string>("0.0");
  const [symbolQuery, setSymbolQuery] = useState<string>("");
  const { symbolsList } = useSymbolListState();
  const [strategy, setStrategy] = useState<string>("");
  const [backtestData, setBacktestData] = useState<SymbolEmaRsiData[]>([]);
  const [totalTrades, setTotalTrades] = useState<number>(0);
  const [totalProfitTrades, setTotalProfitTrades] = useState<number>(0);
  const [totalLossTrades, setTotalLossTrades] = useState<number>(0);
  const [quantity, setQuantity] = React.useState<number>(0);

  const { data: filteredSymbolsList, isLoading: filterSymbolsLoading } =
    useFilterSymbols(symbolQuery, symbolsList);

  const { data, mutate } = useMutation({
    mutationKey: ["strategyDeployment", params.id],
    mutationFn: async () => {
      console.log(`${symbol}.${exchange}`);

      const { data }: { data: SymbolEmaRsiData[] } = await axios.post(
        `${BACKEND_URL}/api/strategy/backtest`,
        {
          symbol: symbol,
          exchange: exchange,
          targetPercentage: Number(targetPercentage),
          stopLossPercentage: Number(stopLossPercentage),
          strategyId: 1,
        }
      );

      return data as SymbolEmaRsiData[];
    },
    onSuccess: (data) => {
      setBacktestData(data);
      setTotalTrades(calculateTotalTrades(data));
      setTotalProfitTrades(calculateTotalProfitTrades(data));
      setTotalLossTrades(calculateTotalLossTrades(data));
    },
  });
  async function deployStrategyHandler(): Promise<void> {
    const user = await supabase.auth.getUser();
    if (user.data.user == undefined) {
      push("/auth/signin");
      return;
    }
    if (symbolId == "" || exchange == "") {
      return;
    }
    if (strategyType == "") {
      return;
    }
    if (targetPercentage == "" || stopLossPercentage == "") {
      return;
    }
    if (quantity == 0 || quantity == undefined) {
      return;
    }
    const { data, status } = await axios.post(
      `${BACKEND_URL}/api/strategy/deploy`,
      {
        strategyId: params.id,
        symbolId: symbolId,
        exchange: exchange,
        strategyType: strategyType,
        targetPercentage: Number(targetPercentage),
        stopLossPercentage: Number(stopLossPercentage),
        quantity: quantity,
        userId: user.data.user.id,
      }
    );
    if (status == 200) {
      toast({
        variant: "default",
        title: "Success",
        description: "Strategy deployed successfully",
        duration: 2000,
      });
      push(`/strategies`);
    }
  }

  function handleTargetPercentageChange(
    event: ChangeEvent<HTMLInputElement>
  ): void {
    const value = event.target.value;
    // Regex to allow only numbers, backspaces and one period (.) for decimal values
    const re = /^[0-9\b.]+$/;

    // Validate input and allow a maximum of 100
    if (value === "" || (re.test(value) && parseFloat(value) <= 100)) {
      setTargetPercentage(value);
    }
  }

  function handleStopLossPercentageChange(
    event: ChangeEvent<HTMLInputElement>
  ): void {
    const value = event.target.value;
    // Regex to allow only numbers, backspaces and one period (.) for decimal values
    const re = /^[0-9\b.]+$/;

    // Validate input and allow a maximum of 100
    if (value === "" || (re.test(value) && parseFloat(value) <= 100)) {
      setStopLossPercentage(value);
    }
  }

  function handleQuantityChange(event: ChangeEvent<HTMLInputElement>): void {
    const value = event.target.value;
    // Regex to allow only numbers, backspaces and one period (.) for decimal values
    const re = /^-?\d+$/;

    // Validate input and allow a maximum of 100
    if (value === "" || re.test(value)) {
      setQuantity(Number(value));
    }
  }

  return (
    <MaxWidthrapper className={"px-0 md:px-0"}>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <div className="relative text-xl h-full flex-col p-5 ">
          <div className="text-4xl font-bold pb-8">Deploy Strategy</div>
          <div className="flex items-center gap-5 p-2">
            <div className="text-lg font-medium">Symbol :</div>
            <DialogTrigger>
              <div className="text-base border-2 text-center rounded-sm border-gray-200 px-3 py-0.5 min-w-[100px] min-h-[30px] hover:bg-gray-100 cursor-pointer">
                {symbol}
              </div>
            </DialogTrigger>
            <div className="text-lg font-medium">Strategy :</div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="text-base border-2 text-center rounded-sm border-gray-200 px-3 py-0.5 min-w-[100px] min-h-[30px] hover:bg-gray-100 cursor-pointer">
                  {strategyType}
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 min-w-[100px] min-h-[30px]">
                <DropdownMenuLabel>Strategy</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup
                  value={strategyType}
                  onValueChange={setStrategyType}
                >
                  <DropdownMenuRadioItem value="Momo">
                    Momo
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="EMA, MACD, and Bollinger Bands">
                    EMA, MACD, and Bollinger Bands
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="EMA, RSI">
                    EMA, RSI
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="EMA and Vwap">
                    EMA and Vwap
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            <div className="text-lg font-medium">Quantity :</div>
            <input
              className={`border-2 text-center text-base rounded-sm border-gray-200 px-3 py-0.5 w-[100px] h-[30px]`}
              type="text"
              value={quantity}
              onChange={handleQuantityChange}
              placeholder=""
            />
          </div>

          <div className="flex items-center gap-5 p-2">
            <div className="text-lg font-medium">Target (%) :</div>
            <input
              className={`border-2 text-center rounded-sm border-gray-200 px-3 py-0.5 w-[100px] h-[30px] text-base`}
              type="text"
              value={targetPercentage}
              onChange={handleTargetPercentageChange}
              placeholder=""
            />
            <div className="text-lg font-medium">Stop Loss (%) :</div>
            <input
              className={`border-2 text-center rounded-sm border-gray-200 px-3 py-0.5 w-[100px] h-[30px] text-base`}
              type="text"
              value={stopLossPercentage}
              onChange={handleStopLossPercentageChange}
              placeholder=""
            />
          </div>
          <Button
            variant="default"
            className="mt-5"
            onClick={deployStrategyHandler}
          >
            Deploy Strategy
          </Button>
        </div>
        <Separator />
        <div className="h-full flex-col w-full">
          <div className="flex justify-between w-full  align-middle">
            <div className="text-4xl font-bold p-5">Backtest</div>
            <div className="flex gap-5 align-middle items-center">
              <Label className="text-l p-2">Total Trades :</Label>
              <Label className="text-l w-100 border-2 rounded p-4">
                {totalTrades}
              </Label>
              <Label className="text-l p-2">Total Profit Trades :</Label>
              <Label className="text-l w-100 border-2 rounded p-4">
                {totalProfitTrades}
              </Label>
              <Label className="text-l p-2">Total Loss Trades :</Label>
              <Label className="text-l w-100 border-2 rounded p-4">
                {totalLossTrades}
              </Label>
              <Button
                onClick={() => mutate()}
                variant="default"
                className="mr-10"
              >
                Run Backtest
              </Button>
            </div>
          </div>
          <div className="w-full h-[60vh] flex justify-start self-start items-start">
            {
              <BacktestChart
                symbol={symbol}
                data={backtestData}
                strategyType={StrategyTypeEnum.EMA}
              ></BacktestChart>
            }
          </div>
        </div>
        <DialogContent className="px-0 max-w-none w-[80vh] m-0">
          <DialogHeader className="p-1">
            <DialogTitle>Search Symbol</DialogTitle>
          </DialogHeader>
          <Input
            value={symbolQuery}
            onChange={(e) => setSymbolQuery(e.target.value)}
            className="rounded-none focus-visible:ring-offset-0 focus-visible:ring-0 py-1 my-0"
            placeholder="Symbol name"
          />
          <ScrollArea className="h-[50vh]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Symbol</TableHead>
                  <TableHead>Comapny Name</TableHead>
                  <TableHead>Exchange</TableHead>
                  <TableHead className="text-right"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filterSymbolsLoading ? (
                  <TableRow>
                    <TableCell className="font-medium">Loading...</TableCell>
                  </TableRow>
                ) : (
                  filteredSymbolsList?.map((symbol) => (
                    <TableRow
                      key={symbol.id}
                      onClick={() => {
                        setSymbolId(symbol.id);
                        setExchange(symbol.exchange!);
                        setSymbol(symbol.symbol);
                        setDialogOpen(false);
                      }}
                    >
                      <TableCell className="font-medium">
                        {symbol.symbol}
                      </TableCell>
                      <TableCell>{symbol.security_name}</TableCell>
                      <TableCell>{symbol.exchange}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </MaxWidthrapper>
  );
};

export default Page;
function calculateTotalTrades(data: SymbolEmaRsiData[]) {
  let totalTrades = 0;
  data.forEach((trade) => {
    totalTrades += trade.signal == "buy" ? 1 : 0;
  });
  console.log(totalTrades);
  return totalTrades;
}
const calculateTotalProfitTrades = (data: SymbolEmaRsiData[]) => {
  let totalProfitTrades = 0;
  let positionTakenprice = 0;
  let positionTaken = false;
  data.forEach((trade) => {
    if (trade.signal == "buy" && !positionTaken) {
      positionTakenprice = trade.close;
      positionTaken = true;
    } else if (trade.signal == "sell" && positionTaken) {
      if (trade.close > positionTakenprice) {
        totalProfitTrades += 1;
      }
      positionTaken = false;
    }
  });
  return totalProfitTrades;
};

const calculateTotalLossTrades = (data: SymbolEmaRsiData[]) => {
  let totalLossTrades = 0;
  let positionTakenprice = 0;
  let positionTaken = false;
  data.forEach((trade) => {
    if (trade.signal == "buy" && !positionTaken) {
      positionTakenprice = trade.close;
      positionTaken = true;
    } else if (trade.signal == "sell" && positionTaken) {
      if (trade.close < positionTakenprice) {
        totalLossTrades += 1;
      }
      positionTaken = false;
    }
  });
  return totalLossTrades;
};
