import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BACKEND_URL, supabase } from "@/lib/utils";
import { queryOptions, useQuery } from "@tanstack/react-query";
import axios from "axios";
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useRouter } from "next/navigation";
import PositionBar from "./positionBar";
import { useFyersSocketState } from "@/app/state/fyers-socket";

export type PositionType = {
  qty: number;
  side: number;
  costPrice: number;
  symbol: string;
  ltp: number;
  buyAvg: number;
  sellAvg: number;
  avgPrice: number;
  exchange: number;
  pl: number;
};

const Positions = () => {
  const { fyersSocket } = useFyersSocketState();
  const { push } = useRouter();
  const {
    data: positions,
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ["positions"],
    queryFn: async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user == null) {
        push("/auth/signin");
        return [];
      }
      const holdingsResponse = await axios.get(
        `${BACKEND_URL}/user/positions?userId=${user.id}`
      );
      return holdingsResponse.data as PositionType[];
    },
  });

  useQuery({
    queryKey: ["fyersSocket"],
    queryFn: async () => {
      if (fyersSocket == undefined) {
        return;
      } else {
        fyersSocket.on("positions", (message) => {
          console.log("positions");
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
  console.log(positions);

  return (
    <>
      <ScrollArea className="h-full">
        <Table key={"holdings"} className="h-full">
          <TableHeader>
            <TableRow>
              <TableHead>Symbol</TableHead>
              <TableHead>Qty</TableHead>
              <TableHead>Side</TableHead>
              <TableHead>Cost Price</TableHead>
              <TableHead>LTP</TableHead>
              <TableHead>Buy Avg</TableHead>
              <TableHead>Sell Avg</TableHead>
              <TableHead>Avg Price</TableHead>
              <TableHead>Exchange</TableHead>
              <TableHead>Profit/Loss</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody key={"holdings"}>
            {positions &&
              positions.map((positions) => (
                <PositionBar key={positions.symbol} position={positions} />
              ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </>
  );
};

export default Positions;
