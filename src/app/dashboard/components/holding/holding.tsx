import { ResizablePanel } from "@/components/ui/resizable";
import { useState } from "react";
import Holdings from "./components/holdings";
import Orders from "./components/orders";

enum holdingOption {
  Holdings = "Holdings",
  Positions = "Positions",
  Orders = "Orders",
}

const Holding = () => {
  const [selectedHoldingOption, setSelectedHoldingOption] =
    useState<holdingOption>(holdingOption.Holdings);
  return (
    <ResizablePanel
      className="border-grey flex flex-col h-full"
      defaultSize={100}
      key={"holdings"}
    >
      <div className="border-b-2 flex">
        <div className="flex-row flex justify-betweens">
          <span
            onClick={() => setSelectedHoldingOption(holdingOption.Holdings)}
            className={`text-center text-md hover:bg-slate-200 hover:cursor-pointer px-4 py-2 flex-auto border-l-2 ${
              selectedHoldingOption == holdingOption.Holdings
                ? "bg-gray-200 border-b"
                : ""
            }`}
          >
            Holdings
          </span>
          <span
            onClick={() => setSelectedHoldingOption(holdingOption.Positions)}
            className={`text-center text-md hover:bg-gray-200 hover:cursor-pointer px-4 py-2 flex-auto border-l-2 border-x-black  ${
              selectedHoldingOption == holdingOption.Positions
                ? "bg-gray-200 border-b"
                : ""
            }`}
          >
            Positions
          </span>
          <span
            onClick={() => setSelectedHoldingOption(holdingOption.Orders)}
            className={`text-center text-md hover:bg-gray-200 hover:cursor-pointer px-4 py-2 flex-auto border-l-2 border-x-black  ${
              selectedHoldingOption == holdingOption.Orders
                ? "bg-gray-200 border-b"
                : ""
            }`}
          >
            Orders
          </span>
        </div>
      </div>
      <div className="h-full">
        {selectedHoldingOption == holdingOption.Holdings && <Holdings />}
        {selectedHoldingOption == holdingOption.Positions && (
          <div>Positions</div>
        )}
        {selectedHoldingOption == holdingOption.Orders && <Orders />}
      </div>
    </ResizablePanel>
  );
};

export default Holding;
