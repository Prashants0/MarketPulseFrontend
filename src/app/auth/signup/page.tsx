import React from "react";

import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { UserAuthForm } from "@/app/auth/signup/components/user_auth_form";
import MaxWidthrapper from "@/components/MaxWidthrapper";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Authentication",
  description: "Authentication forms built using the components.",
};

export default function SignIn() {
  return (
    <>
      <Navbar />
      <MaxWidthrapper>
        <div className="container relative  h-[800px] flex-col items-center justify-center grid px-0">
          <Link
            href="/auth/signin"
            className={cn(
              buttonVariants({ variant: "ghost" }),
              "absolute right-4 top-4 md:right-8 md:top-8"
            )}
          >
            Login
          </Link>

          <div className="lg:p-8 sm:p-2">
            <div className="mx-auto flex w-full flex-col justify-center space-y-6 ">
              <div className="flex flex-col space-y-2 text-center">
                <h1 className="text-2xl font-semibold tracking-tight">
                  Create an account
                </h1>
                <p className="text-sm text-muted-foreground">
                  Enter your email below to create your account
                </p>
              </div>
              <UserAuthForm />
              <p className="px-8 text-center text-sm text-muted-foreground">
                By clicking continue, you agree to our{" "}
                <Link
                  href="/terms"
                  className="underline underline-offset-4 hover:text-primary"
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  href="/privacy"
                  className="underline underline-offset-4 hover:text-primary"
                >
                  Privacy Policy
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </MaxWidthrapper>
    </>
  );
}
