"use client";

import Link from "next/link";
import { CandlestickChart, Home, LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type LinksType = {
  title: string;
  label?: string;
  icon: LucideIcon;
  link: string;
};

export function Nav() {
  const links: LinksType[] = [
    {
      title: "Dashboard",
      icon: Home,
      link: "/dashboard",
    },
    {
      title: "Strategies",
      icon: CandlestickChart,
      link: "/strategies",
    },
  ];
  return (
    <TooltipProvider>
      <div className="group flex flex-col gap-6 py-2 items-center border-r h-screen">
        <nav className="flex-col flex gap-4 px-2 justify-center self-center items-center">
          {links.map((link, index) => (
            <Tooltip key={index} delayDuration={0}>
              <TooltipTrigger asChild>
                <Link
                  href={link.link}
                  className={cn(
                    buttonVariants({
                      variant: window.location.href.includes(link.link)
                        ? "default"
                        : "ghost",
                      size: "icon",
                    }),
                    "h-11 w-11",
                    "dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white"
                  )}
                >
                  <link.icon className="h-5 w-5" />
                  <span className="sr-only">{link.title}</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right" className="flex items-center gap-4">
                {link.title}
                {link.label && (
                  <span className="ml-auto text-muted-foreground">
                    {link.label}
                  </span>
                )}
              </TooltipContent>
            </Tooltip>
          ))}
        </nav>
      </div>
    </TooltipProvider>
  );
}
