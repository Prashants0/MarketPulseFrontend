/**
 * v0 by Vercel.
 * @see https://v0.dev/t/LmwmpH0MGde
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import { CardContent, Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ClockIcon, InfoCircledIcon } from "@radix-ui/react-icons";
import { TrendingUpIcon } from "lucide-react";

export default function StrategyCard() {
  return (
    <Card className="w-full max-w-xs">
      <CardContent className="flex justify-between text-left gap-1.5 p-3 items-center">
        <div className="text-lg font-bold">Breakout</div>
        <div className="flex gap-2">
          <div className="text-sm">Long</div>
          <TrendingUpIcon className="w-4 h-4 text-gray-500" />
        </div>
      </CardContent>
      <Separator />
      <CardContent className="flex justify-between items-start gap-1.5 p-4">
        <div className="flex items-center gap-2">
          <ClockIcon className="w-4 h-4 text-gray-500" />
          <div className="text-sm font-medium">Time frame</div>
        </div>
        <div className="text-sm">1H (1 hour)</div>
      </CardContent>
      <Separator />
      <CardContent className="flex flex-col text-left gap-1.5 p-4">
        <div className="flex items-center gap-2">
          <InfoCircledIcon className="w-4 h-4 text-gray-500" />
          <div className="text-sm font-medium">Description</div>
        </div>
        <div className="text-sm">
          The breakout strategy aims to take advantage of significant price
          movements following periods of consolidation.
        </div>
      </CardContent>
    </Card>
  );
}
