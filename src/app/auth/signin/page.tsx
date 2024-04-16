import MaxWidthrapper from "@/components/MaxWidthrapper";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";
import { UserLogInForm } from "@/app/auth/signin/components/user_sign_in_form";
import Navbar from "@/components/Navbar";

export default function SignIn() {
  return (
    <>
      <Navbar />
      <MaxWidthrapper>
        <div className="container relative  h-[800px] flex-col items-center justify-center grid px-0">
          <Link
            href={"/auth/signup"}
            className={cn(
              buttonVariants({ variant: "ghost" }),
              "absolute top-4 right-4  md:top-8 md:right-8"
            )}
          >
            Sign Up
          </Link>

          <div className="lg:p-8 sm:p-2">
            <div className="mx-auto flex w-full flex-col justify-center space-y-6 ">
              <div className="flex flex-col space-y-2 text-center">
                <h1 className="text-2xl font-semibold tracking-tight">
                  Log in to your account
                </h1>
                <p className="text-sm text-muted-foreground">
                  Enter your email below to log in to your account.
                </p>
              </div>
              <UserLogInForm />
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
