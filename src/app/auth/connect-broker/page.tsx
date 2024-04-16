import MaxWidthrapper from "@/components/MaxWidthrapper";
import React from "react";
import BrokerSelection from "./components/BrokerSelection";
import Navbar from "@/components/Navbar";

const page = () => {
  return (
    <>
      <Navbar />
      <MaxWidthrapper>
        <div className="container relative h-[800px]  flex-col items-center justify-center grid px-0">
          <div className="lg:p-8 sm:p-2 w-[50vh]">
            <div className="mx-auto flex w-full flex-col justify-center space-y-6 ">
              <div className="flex flex-col space-y-2 text-center">
                <h2 className="text-2xl font-semibold tracking-tight py-8">
                  Connect to your Broker
                </h2>
                <BrokerSelection />
              </div>
            </div>
          </div>
        </div>
      </MaxWidthrapper>
    </>
  );
};

export default page;
