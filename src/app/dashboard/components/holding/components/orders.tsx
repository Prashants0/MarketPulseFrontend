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
import React from "react";
import { useRouter } from "next/navigation";
import OrdersBar from "./ordersBar";

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
  const { data: orders, isLoading } = useQuery({
    queryKey: ["holdings"],
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
  if (isLoading) {
    return <div>Loading...</div>;
  }
  return (
    <>
      <ScrollArea className="h-full">
        <Table>
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
          <TableBody>
            {orders &&
              orders.map((order) => <OrdersBar key={order.id} order={order} />)}
          </TableBody>
        </Table>
      </ScrollArea>
    </>
  );
};

export default Orders;
