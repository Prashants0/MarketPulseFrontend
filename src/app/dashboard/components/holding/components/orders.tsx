import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  Table,
} from "@/components/ui/table";
import { BACKEND_URL, supabase } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React, { use, useEffect } from "react";
import { useRouter } from "next/navigation";
import OrdersBar from "./ordersBar";
import { useFyersSocketState } from "@/app/state/fyers-socket";

export type OrderType = {
  symbol: string;
  qty: number;
  side: number;
  segment: number;
  message: string;
  status: number;
  limitPrice: number;
  stopPrice: number;
  productType: String;
  orderDateTime: String;
  id: number;
};

const Orders = () => {
  const { push } = useRouter();
  const { fyersSocket } = useFyersSocketState();
  const {
    data: orders,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user == null) {
        push("/auth/signin");
        return [];
      }
      const ordersResponse = await axios.get(
        `${BACKEND_URL}/user/orders?userId=${user.id}`
      );
      for (let i = 0; i < ordersResponse.data.length; i++) {
        ordersResponse.data[i].id = i;
      }
      return ordersResponse.data as OrderType[];
    },
  });

  useQuery({
    queryKey: ["fyersSocket"],
    queryFn: async () => {
      if (fyersSocket == undefined) {
        return;
      } else {
        fyersSocket.on("orders", (message) => {
          console.log("orders");
          refetch();
        });
      }
    },
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }
  return (
    <>
      <ScrollArea className="h-full">
        <Table key={"orders"}>
          <TableHeader>
            <TableRow>
              <TableHead>Symbol</TableHead>
              <TableHead>Buy/Sell</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Segment</TableHead>
              <TableHead>Limit Price</TableHead>
              <TableHead>Stop Price</TableHead>
              <TableHead>Product Type</TableHead>
              <TableHead>Order DateTime</TableHead>
              <TableHead>Message</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody key={"orders"}>
            {orders &&
              orders.map((order) => <OrdersBar key={order.id} order={order} />)}
          </TableBody>
        </Table>
      </ScrollArea>
    </>
  );
};

export default Orders;
