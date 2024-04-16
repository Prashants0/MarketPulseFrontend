import { DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
} from "@radix-ui/react-dialog";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { Label } from "@radix-ui/react-label";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { Table } from "lucide-react";
import React, {
  Ref,
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import Chart from "./chart";
import { SymbolCandlesData } from "@/types/symbol-types";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useChartState } from "@/app/state/Chart-state";
import { useChartSeriesState } from "@/app/state/useChartSeriesState";
import { useSelectedSymbolState } from "@/app/state/select-symbol";

export type ChartPanelRef = {
  handlePanelResize: () => void;
};

const ChartPanel = forwardRef<ChartPanelRef>((props, ref) => {
  const { symbol, symbolId, exchange } = useSelectedSymbolState();

  const { chartSeries } = useChartSeriesState();
  const { chart } = useChartState();

  const chartContainerRef = useRef<HTMLDivElement>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["chart", symbolId],
    queryFn: async () => {
      const { data }: { data: SymbolCandlesData[] } = await axios.get(
        `/api/symbol/getSymbolChart?symbol=${symbolId}`
      );
      if (data.length == 0) {
        return [];
      }
      return data as SymbolCandlesData[];
    },
  });

  useQuery({
    queryKey: ["chartSeries"],
    queryFn: async () => {
      if (chartSeries != undefined) {
        const { data }: { data: SymbolCandlesData[] } = await axios.get(
          `/api/symbol/getSymbolChart?symbol=${symbolId}`
        );

        chartSeries.update(data[data.length - 1]);
        return data as SymbolCandlesData[];
      }
      return [];
    },
    refetchInterval: 300,
  });

  function handlePanelResize(): void {
    if (chart != undefined && chartContainerRef.current != undefined) {
      chart.applyOptions({
        width: chartContainerRef.current.clientWidth,
        height: chartContainerRef.current.clientHeight - 40,
      });
    }
  }

  useImperativeHandle(ref, () => ({
    handlePanelResize: handlePanelResize,
  }));

  return (
    <>
      <div id="chart-toolbar" className="border-b-4 p-1">
        <DialogTrigger>
          <Label className="text-md flex items-center gap-1 cursor-pointer hover:bg-gray-200 w-fit pr-2 pt-1 pl-1 pb-1">
            <MagnifyingGlassIcon className="w-5 h-5" /> {symbol}
          </Label>
        </DialogTrigger>
      </div>
      <div className="h-full" ref={chartContainerRef}>
        {isLoading ? <h1>Loading</h1> : <Chart symbol={symbol} data={data} />}
      </div>
    </>
  );
});

ChartPanel.displayName = "ChartPanel";

export default ChartPanel;
