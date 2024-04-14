import { ResizablePanel } from "@/components/ui/resizable";
import { useState } from "react";
import Holdings from "./components/holdings";
import Orders from "./components/orders";
import PortfolioOptionChecker from "./components/portfolioOptionChecker";

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
      <div className="border-b-2 flex">
        <div className="flex-row flex justify-betweens">
          <span
            onClick={() => setSelectedHoldingOption(HoldingOption.Holdings)}
            className={`text-center text-md hover:bg-slate-200 hover:cursor-pointer px-4 py-2 flex-auto border-l-2 ${
              selectedHoldingOption == HoldingOption.Holdings
                ? "bg-gray-200 border-b"
                : ""
            }`}
          >
            Holdings
          </span>
          <span
            onClick={() => setSelectedHoldingOption(HoldingOption.Positions)}
            className={`text-center text-md hover:bg-gray-200 hover:cursor-pointer px-4 py-2 flex-auto border-l-2 border-x-black  ${
              selectedHoldingOption == HoldingOption.Positions
                ? "bg-gray-200 border-b"
                : ""
            }`}
          >
            Positions
          </span>
          <span
            onClick={() => setSelectedHoldingOption(HoldingOption.Orders)}
            className={`text-center text-md hover:bg-gray-200 hover:cursor-pointer px-4 py-2 flex-auto border-l-2 border-x-black  ${
              selectedHoldingOption == HoldingOption.Orders
                ? "bg-gray-200 border-b"
                : ""
            }`}
          >
            Orders
          </span>
        </div>
      </div>
      <div className="h-full">
        <PortfolioOptionChecker holdingOption={selectedHoldingOption} />
      </div>
    </ResizablePanel>
  );
};

export default Holding;
