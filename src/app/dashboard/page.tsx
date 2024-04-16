"use client";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useRef, useState } from "react";
import Watchlist from "./components/watchlist/Watchlist";
import { SelectedSymbolProvider } from "./contexts/selectedSymbol";
import { WatchlistProvider } from "./contexts/watchlist";
import { useQuery } from "@tanstack/react-query";
import { useSelectedSymbolState } from "../state/select-symbol";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BACKEND_URL, cn, supabase, useFilterSymbols } from "@/lib/utils";
import { useSymbolListState } from "../state/symbol-list";
import Holding from "./components/holding/holding";
import ChartPanel, { ChartPanelRef } from "./components/chart/chartPanel";
import { connect, io } from "socket.io-client";
import { useUser } from "../state/user-state";
import { OrderType } from "./components/holding/components/orders";
import { useFyersSocketState } from "../state/fyers-socket";
import { Nav } from "@/components/Nav";
import BuySellButton from "./components/buySellButton";
import { toast } from "sonner";

export default function Dashboard() {
  const { user, setUser } = useUser();

  const { setSymbol, setExchange, setSymbolId } = useSelectedSymbolState();

  const [symbolQuery, setSymbolQuery] = useState<string>("");

  const { symbolsList } = useSymbolListState();

  const { data: filteredSymbolsList, isLoading: filterSymbolsLoading } =
    useFilterSymbols(symbolQuery, symbolsList);

  const chartPanelRef = useRef<ChartPanelRef>(null);

  useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user == undefined) {
        return;
      }

      setUser(user.id);
      return user;
    },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
  const { setFyersSocket } = useFyersSocketState();
  useQuery({
    queryKey: ["fyersSocket", user],
    queryFn: async () => {
      if (user == undefined) {
        return;
      } else {
        const fyersSocket = io(BACKEND_URL + "/fyers-socket", {
          auth: { userId: user },
        });
        setFyersSocket(fyersSocket);
        fyersSocket.on("connect", () => {
          console.log("connected");
        });
        fyersSocket.on("live-trade", (message) => {
          console.log("live-trade");
          console.log(message);
          toast("Live Trade", {
            description: `Symbol :${message.symbol} \n Type:${message.typeName} \n Quantity: ${message.quantity}`,
          });
        });
      }
    },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  function handlePanelResize(size: number, prevSize: number | undefined): void {
    chartPanelRef.current?.handlePanelResize();
  }

  return (
    <Dialog>
      <div className="flex justify-center items-start h-full">
        <Nav />
        <div>
          <BuySellButton />
        </div>
        <WatchlistProvider>
          <SelectedSymbolProvider>
            <ResizablePanelGroup
              className="h-full "
              direction={"horizontal"}
              onLayout={(sizes: number[]) => {
                document.cookie = `react-resizable-panels:layout=${JSON.stringify(
                  sizes
                )}`;
              }}
            >
              <ResizablePanel
                className=" border-grey"
                defaultSize={200}
                onResize={handlePanelResize}
                key={"chart"}
              >
                <ResizablePanelGroup
                  direction={"vertical"}
                  onLayout={(sizes: number[]) => {
                    document.cookie = `react-resizables-panels:layout=${JSON.stringify(
                      sizes
                    )}`;
                  }}
                >
                  <ResizablePanel
                    className="border-grey h-full "
                    defaultSize={200}
                    key={"chart"}
                    onResize={handlePanelResize}
                  >
                    <ChartPanel ref={chartPanelRef} />
                  </ResizablePanel>
                  <ResizableHandle withHandle className="border-black " />
                  <Holding />
                </ResizablePanelGroup>
              </ResizablePanel>
              <ResizableHandle withHandle className="border-black " />
              <ResizablePanel defaultSize={20} minSize={20}>
                <Watchlist key={user} />
              </ResizablePanel>
            </ResizablePanelGroup>
          </SelectedSymbolProvider>
        </WatchlistProvider>
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
          <DialogFooter></DialogFooter>
        </DialogContent>
      </div>
    </Dialog>
  );
}
