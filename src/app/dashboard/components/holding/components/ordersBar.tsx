import { TableRow, TableCell } from "@/components/ui/table";
import React from "react";
import { OrderType } from "./orders";

const OrdersBar = ({ order }: { order: OrderType }) => {
  return (
    <>
      <TableRow key={order.symbol}>
        <TableCell>{order.symbol}</TableCell>
        <TableCell>{order.side == 1 ? "Buy" : "Sell"}</TableCell>
        <TableCell>{order.qty}</TableCell>
        <TableCell>{order.status}</TableCell>
        <TableCell>{order.segment}</TableCell>
        <TableCell>{order.limitPrice}</TableCell>
        <TableCell>{order.stopPrice}</TableCell>
        <TableCell>{order.productType}</TableCell>
        <TableCell>{order.orderDateTime}</TableCell>
        <TableCell className="text-red-400">{order.message}</TableCell>
      </TableRow>
    </>
  );
};

export default OrdersBar;
