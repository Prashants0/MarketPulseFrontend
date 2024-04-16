import MaxWidthrapper from "@/components/MaxWidthrapper";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Nav } from "@/components/Nav";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <>
      <MaxWidthrapper className="mb-12 mt-28 md:mt14 flex flex-col items-center justify-center text-center">
        <Navbar />
        <div className="mx-auto mb-4 flex max-w-fit items-center justify-center space-x-2 overflow-hidden rounded-full border border-gray-200 bg-white px-7 py-2 shadow-md backdrop-blur transition-all hover:border-gray-300 hover:bg-white/50">
          <p className="text-sm font-semibold text-gray-700">FinFlow</p>
        </div>
        <h1 className="max-w-4xl text-4xl font-bold md:text-6xl lg:text-7xl">
          Automated <span className="text-blue-700">trading </span>in made
          simple
        </h1>
        <p className="mt-5 max-w-prose text-zinc-700 sm:text-lg"></p>
        <Link
          className={buttonVariants({
            size: "lg",
            className: "mt-5",
          })}
          href="/dashboard"
          target="_blank"
        >
          Get Started <ArrowRight className="ml-2 h-5 w-2" />
        </Link>
      </MaxWidthrapper>
    </>
  );
}
