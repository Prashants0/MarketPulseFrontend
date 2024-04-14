import React from "react";
import MaxWidthrapper from "./MaxWidthrapper";
import Link from "next/link";
import { buttonVariants } from "./ui/button";
import Image from "next/image";

function Navbar() {
  return (
    <nav className="sticky h-14 inset-0 z-30 w-full border-b border-gray-200 bg-white/75 backdrop-blur-lg transition-all">
      <MaxWidthrapper>
        <div className="flex h-14 items-center justify-between bordder-b border-zinc-200">
          <Link href="/" className="flex items-center gap-5 z-40 font-semibold">
            <Image
              width={35}
              height={35}
              src="/marketpulse.png"
              alt="marketpulse"
            />
            <Link href="/" className="flex z-40 font-semibold">
              MarketPulse
            </Link>
          </Link>

          <div className="hidden items-center space-x-4 sm:flex">
            <>
              <Link
                href="/auth/signup"
                className={buttonVariants({ variant: "ghost", size: "lg" })}
              >
                Sign In
              </Link>
            </>
          </div>
        </div>
      </MaxWidthrapper>
    </nav>
  );
}

export default Navbar;
