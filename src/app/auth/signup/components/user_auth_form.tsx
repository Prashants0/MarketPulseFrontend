"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { Icons } from "@/components/ui/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault();
    setIsLoading(true);
    await signUpNewUser(email, password);
    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  }
  async function signInWithGoogle() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${origin}/api/auth/callback`,
      },
    });
  }

  async function signUpNewUser(email: string, password: string) {
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });
    if (error) {
      console.log(error);
    } else {
    }
  }

  // Password input
  const [showPassword, setShowPassword] = useState<boolean>(false);

  // Password input type
  const [passwordInputType, setPasswordInputType] =
    useState<string>("password");

  // Confirm password input
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);

  // Confirm password input type
  const [confirmPasswordInputType, setConfirmPasswordInputType] =
    useState("password");

  // Toggle password visibility
  const togglePasswordVisibility = (
    showPasswordText: boolean,
    setShowState: Function,
    setInputType: Function
  ) => {
    setShowState(showPasswordText);
    setInputType(showPasswordText ? "text" : "password");
  };

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <form onSubmit={onSubmit}>
        <div className="grid gap-6">
          <div className="grid gap-2">
            <Label htmlFor="email">Email :</Label>
            <Input
              id="email"
              placeholder="Email"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isLoading}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
            <Label htmlFor="password">Password :</Label>
            <div className="relative">
              <Input
                id="password"
                placeholder="password"
                type={passwordInputType}
                autoCapitalize="none"
                autoComplete="password"
                autoCorrect="off"
                disabled={isLoading}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2"
                onClick={() =>
                  togglePasswordVisibility(
                    !showPassword,
                    setShowPassword,
                    setPasswordInputType
                  )
                }
              >
                {showPassword ? (
                  <Icons.eyeOff className="h-4 w-4 text-gray-500" />
                ) : (
                  <Icons.eye className="h-4 w-4 text-gray-500" />
                )}
              </button>
            </div>
            <Label htmlFor="confirm-password">Confirm Password :</Label>
            <div className="relative">
              <Input
                id="password-confirm"
                placeholder="password"
                type={confirmPasswordInputType}
                autoCapitalize="none"
                autoComplete="password"
                autoCorrect="off"
                disabled={isLoading}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2"
                onClick={() =>
                  togglePasswordVisibility(
                    !showConfirmPassword,
                    setShowConfirmPassword,
                    setConfirmPasswordInputType
                  )
                }
              >
                {showConfirmPassword ? (
                  <Icons.eyeOff className="h-4 w-4 text-gray-500" />
                ) : (
                  <Icons.eye className="h-4 w-4 text-gray-500" />
                )}
              </button>
            </div>
          </div>
          <Button disabled={isLoading}>
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Sign In with Email
          </Button>
        </div>
      </form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      <Button
        onClick={signInWithGoogle}
        variant="outline"
        type="button"
        disabled={isLoading}
      >
        {isLoading ? (
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Icons.google className="m-3 h-5 w-5" />
        )}{" "}
        Google
      </Button>
    </div>
  );
}
