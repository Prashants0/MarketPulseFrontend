import MaxWidthrapper from "@/components/MaxWidthrapper";
import React from "react";
import UserStrategy from "./components/UserStrategy";
import AddCard from "./components/AddCard";
import StrategyCard from "./components/StrategyCard";

const Page = () => {
  return (
    <MaxWidthrapper className="flex flex-col items-center justify-center text-center h-full px-0 md:px-0">
      <div className="h-[30%] w-full border-b ">
        <div className="h-full w-full flex flex-col justify-start self-start items-start">
          <h1 className="text-4xl p-6 h-1/4 font-bold">Live Strategies</h1>
          <div className="h-full flex p-5 justify-between items-start gap-4">
            <UserStrategy />
            <UserStrategy />
            <AddCard />
          </div>
        </div>
      </div>
      <div className="h-[70%] w-full">
        <div className="h-full w-full flex flex-col justify-start self-start items-start">
          <h1 className="text-4xl font-bold p-6 h-1/4">List of Strategies</h1>
          <div className="h-full flex p-3 justify items-start gap-4">
            <StrategyCard />
          </div>
        </div>
      </div>
    </MaxWidthrapper>
  );
};

export default Page;
