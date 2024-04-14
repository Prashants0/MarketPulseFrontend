import React from "react";
import { HoldingOption } from "../holding";
import Holdings from "./holdings";
import Orders from "./orders";

const PortfolioOptionChecker = ({
  holdingOption,
}: {
  holdingOption: HoldingOption;
}) => {
  if (holdingOption == HoldingOption.Holdings) {
    console.log("Holdings");

    return <Holdings />;
  }
  if (holdingOption == HoldingOption.Positions) {
    console.log("Positions");

    return <div>Positions</div>;
  }
  if (holdingOption == HoldingOption.Orders) {
    console.log("Orders");
    return <Orders />;
  }
};

export default PortfolioOptionChecker;
