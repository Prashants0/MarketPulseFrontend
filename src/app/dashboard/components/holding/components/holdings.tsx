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
import HoldingsBar from "./holdingsBar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useUser } from "@/app/state/user-state";
import { useRouter } from "next/navigation";

export type HoldingType = {
  quantity: number;
  costPrice: number;
  symbol: string;
  ltp: number;
  dayChange: number;
  dayChangePercent: number;
  marketValue: number;
  exchange: string;
};

const Holdings = () => {
  const { push } = useRouter();
  const { data: holdings, isLoading } = useQuery({
    queryKey: ["holdings"],
    queryFn: async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user == null) {
        push("/auth/signin");
        return [];
      }
      const holdingsResponse = await axios.get(
        `${BACKEND_URL}/user/holdings?userId=${user.id}`
      );
      return holdingsResponse.data as HoldingType[];
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
              <TableHead>Quantity</TableHead>
              <TableHead>LTP</TableHead>
              <TableHead>Avg. Price</TableHead>
              <TableHead>{"Day's change"}</TableHead>
              <TableHead>{"Day's change( % )"}</TableHead>
              <TableHead>Market Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {holdings &&
              holdings.map((holding) => (
                <HoldingsBar key={holding.symbol} holding={holding} />
              ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </>
  );
};

export default Holdings;
