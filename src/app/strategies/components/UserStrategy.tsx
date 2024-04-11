/**
 * v0 by Vercel.
 * @see https://v0.dev/t/joRUSGCmpVd
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import { Badge } from "@/components/ui/badge";
import { CardContent, Card } from "@/components/ui/card";
import { BarChartIcon, CheckIcon, ClockIcon } from "lucide-react";

export default function UserStrategy() {
  return (
    <Card className="w-full max-w-[250px] ">
      <CardContent className="p-6">
        <div className="flex items-center">
          <div className="flex items-center">
            <span className="text-lg font-semibold">EMA Crossover</span>
          </div>
          <Badge className="ml-4 bg-gray-100 dark:bg-gray-800 border-gray-100 dark:border-gray-800 text-gray-900 dark:text-gray-100 justify-between">
            <CheckIcon className="w-3 h-3" />
            Live
          </Badge>
        </div>
        <div className="mt-4 grid gap-1.5 text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-1.5">
            <ClockIcon className="text-gray-500 dark:text-gray-400" />
            <span>15 minutes</span>
          </div>
          <div className="flex items-center gap-1.5">
            <BarChartIcon className="text-gray-500 dark:text-gray-400" />
            <span>ETH/USDT</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
