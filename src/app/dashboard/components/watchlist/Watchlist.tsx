"use client";

import { Separator } from "@/components/ui/separator";
import WatchlistSelector from "./components/WatchlistSelector";
import { MinusIcon, PlusCircledIcon } from "@radix-ui/react-icons";
import { useWatchlist } from "../../contexts/watchlist";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Watchlist_items, bse_symbol } from "@prisma/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import SymbolBar from "./components/SymbolBar";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { PlusIcon } from "lucide-react";
import { useSymbolListState } from "@/app/state/symbol-list";
import { useToast } from "@/components/ui/use-toast";
import { useFilterSymbols } from "@/lib/utils";

function Watchlist() {
  //states
  const [showAddSymbolDialog, setShowAddSymbolDialog] =
    useState<boolean>(false);
  const { symbolsList } = useSymbolListState();
  const { toast } = useToast();
  const [symbolQuery, setSymbolQuery] = useState<string>("");
  useState<Set<Watchlist_items>>();

  //watchlist Id state
  const watchlistId = useWatchlist();

  //get symbols of a watchlist from its id
  const { data: watchlistSymbols, refetch: refetchWatchlistSymbols } = useQuery(
    {
      queryKey: ["watchlist", watchlistId],
      queryFn: async () => {
        if (!watchlistId) return [];
        const { data } = await axios.get(
          `/api/watchlist/getWatchlistSymbols?watchlist_id=${watchlistId}`,
          {
            data: {
              watchlistId: watchlistId,
            },
          }
        );
        return data as Watchlist_items[];
      },
    }
  );

  //add a symbol from the watchlist
  const { mutate: addWatchlistSymbol } = useMutation({
    mutationKey: ["addWatchlist"],
    mutationFn: async (symbol: string) => {
      await axios.post("/api/watchlist/addSymbolToWatchlist", {
        watchlist_id: watchlistId,
        symbol: symbol,
      });
    },
    onSuccess: (data) => {
      refetchWatchlistSymbols();
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: error.message,
        duration: 5000,
      });
    },
  });

  //delete a symbol from the watchlist
  const { mutate: deleteWatchlistSymbol } = useMutation({
    mutationKey: ["deleteWatchlist"],
    mutationFn: async (symbol: string) => {
      await axios.delete("/api/watchlist/deleteWatchlistSymbol", {
        data: {
          watchlist_id: watchlistId,
          symbol: symbol,
        },
      });
    },
    onSuccess: (data) => {
      refetchWatchlistSymbols();
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: error.message,
        duration: 5000,
      });
    },
  });

  //filter symbol list based on serach query
  const { data: filteredSymbolsList, isLoading } = useFilterSymbols(
    symbolQuery,
    symbolsList
  );

  //

  return (
    <>
      <Dialog open={showAddSymbolDialog} onOpenChange={setShowAddSymbolDialog}>
        <div className="flex items-center justify-between bg-transparent">
          <WatchlistSelector />
          <DialogTrigger asChild>
            <PlusCircledIcon
              onClick={() => {
                setShowAddSymbolDialog(true);
              }}
              className="w-5 h-5 mr-5 hover:cursor-pointer"
            />
          </DialogTrigger>
        </div>
        <Separator />
        <ScrollArea className="h-full">
          {watchlistSymbols &&
            watchlistSymbols.map((symbol) => (
              <SymbolBar key={symbol.id} symbol_name={symbol.symbol} />
            ))}
        </ScrollArea>
        <DialogContent className="px-0 max-w-none w-[80vh] m-0">
          <DialogHeader className="p-1">
            <DialogTitle>Search Symbol</DialogTitle>
          </DialogHeader>
          <Input
            value={symbolQuery}
            onChange={(e) => setSymbolQuery(e.target.value)}
            className="rounded-none focus-visible:ring-offset-0 focus-visible:ring-0 py-1 my-0"
            placeholder="Watchlist name"
          />
          <ScrollArea className="h-[50vh]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Symbol</TableHead>
                  <TableHead>Comapny Name</TableHead>
                  <TableHead className="text-right"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell className="font-medium">Loading...</TableCell>
                  </TableRow>
                ) : (
                  filteredSymbolsList?.map((symbol) => (
                    <TableRow key={symbol.symbol_Id}>
                      <TableCell className="font-medium">
                        {symbol.symbol_Id}
                      </TableCell>
                      <TableCell>{symbol.issuer_name}</TableCell>
                      <TableCell className="flex items-end justify-end">
                        {watchlistSymbols &&
                        watchlistSymbols.some((watchlistSymbol) => {
                          return symbol.symbol_Id == watchlistSymbol.symbol;
                        }) ? (
                          <Button
                            onClick={() => {
                              deleteWatchlistSymbol(symbol.symbol_Id);
                            }}
                            variant={"destructive"}
                            className=" h-6 rounded-[5px] flex items-center justify-between"
                          >
                            <span className="mr-1">Remove</span>
                            <MinusIcon className="w-3 h-3" />
                          </Button>
                        ) : (
                          <Button
                            onClick={() => addWatchlistSymbol(symbol.symbol_Id)}
                            className=" h-6 rounded-[5px] flex items-center justify-between"
                          >
                            <span className="mr-1">Add</span>
                            <PlusIcon className="w-3 h-3" />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default Watchlist;
