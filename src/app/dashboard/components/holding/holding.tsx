import { ResizablePanel } from "@/components/ui/resizable";
import { useState } from "react";
import Holdings from "./components/holdings";
import Orders from "./components/orders";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Positions from "./components/postions";

export enum HoldingOption {
  Holdings = "Holdings",
  Positions = "Positions",
  Orders = "Orders",
}

const Holding = () => {
  const [selectedHoldingOption, setSelectedHoldingOption] =
    useState<HoldingOption>(HoldingOption.Holdings);
  return (
    <ResizablePanel
      className="border-grey flex flex-col h-full"
      defaultSize={100}
      key={"holdings"}
    >
      <div className="h-full w-full">
        <Tabs defaultValue="holdings" className="w-full h-full">
          <TabsList>
            <TabsTrigger value="holdings">Holdings</TabsTrigger>
            <TabsTrigger value="positions">Positions</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
          </TabsList>
          <TabsContent value="holdings" className="h-[80%]">
            <Holdings />
          </TabsContent>
          <TabsContent value="positions" className="h-full">
            <Positions />
          </TabsContent>
          <TabsContent value="orders" className="h-[80%]">
            <Orders />
          </TabsContent>
        </Tabs>
      </div>
    </ResizablePanel>
  );
};

export default Holding;
