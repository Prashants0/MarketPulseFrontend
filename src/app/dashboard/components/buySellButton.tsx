"use client";

import { useSelectedSymbolState } from "@/app/state/select-symbol";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/use-toast";
import { BACKEND_URL, supabase } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import React from "react";
enum BuySellButtonType {
  Buy,
  Sell,
}

const BuySellButton = () => {
  const [dialogOpen, setDialogOpen] = React.useState<boolean>(false);
  const { mutate: buyMutate } = useMutation({
    mutationKey: ["buySell"],
    mutationFn: async () => {
      const user = await supabase.auth.getUser();
      if (user.data.user == undefined) {
        return;
      }
      const { data } = await axios.post(`${BACKEND_URL}/user/buy-order`, {
        symbol: symbol,
        quantity: quantity,
        exchange: exchange,
        userId: user.data.user.id,
      });
      return data;
    },
    onSuccess: (data) => {
      toast({
        variant: "default",
        title: "Success",
        description: "Order placed successfully",
        duration: 2000,
      });
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

  const { mutate: sellMutate } = useMutation({
    mutationKey: ["sell"],
    mutationFn: async () => {
      const user = await supabase.auth.getUser();
      if (user.data.user == undefined) {
        return;
      }
      const { data } = await axios.post(`${BACKEND_URL}/user/sell-order`, {
        symbol: symbol,
        quantity: quantity,
        exchange: exchange,
        userId: user.data.user.id,
      });
      return data;
    },
    onSuccess: (data) => {
      toast({
        variant: "default",
        title: "Success",
        description: "Order placed successfully",
        duration: 2000,
      });
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
  const [buySellButtonType, setBuySellButtonType] =
    React.useState<boolean>(true);
  const { symbol, symbolId, exchange } = useSelectedSymbolState();
  const [quantity, setQuantity] = React.useState<number>(0);
  function handleBuy(): void {
    buyMutate();
    setDialogOpen(false);
  }
  function handleSell(): void {
    sellMutate();
    setDialogOpen(false);
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <div className="flex h-10 w-10 justify-center items-center p-5 rounded-full bg-primary text-primary-foreground hover:bg-primary/80 hover:cursor-pointer absolute z-50 bottom-4 right-4">
          <button className="bg-primary text-primary-foreground hover:bg-primary/80 hover:cursor-pointer">
            B
          </button>
        </div>
      </DialogTrigger>
      <DialogContent>
        <div className="flex flex-col gap-2 pt-3">
          <div className="flex justify-between items-center gap-2">
            <div className="text-lg font-medium">
              {buySellButtonType ? "Buy" : "Sell"}
            </div>
            <div>
              <Switch
                id="airplane-mode"
                checked={buySellButtonType}
                onCheckedChange={(value) => setBuySellButtonType(value)}
              />
            </div>
          </div>
          <div className="flex gap-5 justify-start items-center">
            <div className="text-sm font-medium">Symbol :</div>
            <div className="text-sm font-medium">{symbol}</div>
          </div>
          <div className="flex gap-5 justify-start items-center">
            <div className="text-sm font-medium">Exchange :</div>
            <div className="text-sm font-medium">{exchange}</div>
          </div>
          <div className="flex gap-5 justify-start items-center">
            <div className="text-sm font-medium">Quantity :</div>
            <input
              className="text-sm font-medium rounded-md p-2 text-center items-center hover:cursor-pointer"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
            />
          </div>
          <div className="flex gap-2">
            {buySellButtonType ? (
              <div
                className="text-sm font-medium rounded-md p-2 text-center items-center hover:cursor-pointer bg-primary"
                onClick={() => handleBuy()}
              >
                Buy
              </div>
            ) : (
              <div
                className="text-sm font-medium rounded-md p-2 text-center items-center hover:cursor-pointer bg-destructive"
                onClick={() => handleSell()}
              >
                Sell
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BuySellButton;
