/**
 * v0 by Vercel.
 * @see https://v0.dev/t/joRUSGCmpVd
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import { Badge } from "@/components/ui/badge";
import { CardContent, Card } from "@/components/ui/card";
import { BarChartIcon, CheckIcon, ClockIcon } from "lucide-react";
import { useRouter } from "next/navigation";

export default function UserStrategy({
  id,
  strategyTypeId,
  symbolName,
  exchange,
  liveStatus,
}: {
  id: string;
  strategyTypeId: number;
  symbolName: string;
  exchange: string;
  liveStatus: boolean;
}) {
  const { push } = useRouter();
  function handleStrategyCardClick(
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ): void {
    push(`/strategies/${id}`);
  }
  let strategyName = "";
  if (strategyTypeId == 1) {
    strategyName = "MOMO";
  } else if (strategyTypeId == 2) {
    strategyName = "EMA, MACD, and Bollinger Bands";
  } else if (strategyTypeId == 3) {
    strategyName = "EMA, RSI";
  } else if (strategyTypeId == 4) {
    strategyName = "EMA and Vwap";
  }
  console.log(symbolName);

  return (
    <Card
      className="w-full max-w-[250px] hover:cursor-pointer"
      onClick={handleStrategyCardClick}
    >
      <CardContent className="p-6">
        <div className="flex items-center">
          <div className="flex items-center">
            <span className="text-lg font-semibold">{strategyName}</span>
          </div>
          {liveStatus ? (
            <Badge className="ml-4 bg-primary dark:bg-gray-800 border-gray-100 dark:border-gray-800 text-gray-900 dark:text-gray-100 justify-between">
              <CheckIcon className="w-3 h-3" />
              Live
            </Badge>
          ) : (
            <Badge className="ml-4 bg-ghost dark:bg-gray-800 border-gray-100 dark:border-gray-800 text-gray-900 dark:text-gray-100 justify-between">
              <CheckIcon className="w-3 h-3" />
              Live
            </Badge>
          )}
        </div>
        <div className="mt-4 grid gap-1.5 text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-1.5">
            <ClockIcon className="text-gray-500 dark:text-gray-400" />
            <span>5 minutes</span>
          </div>
          <div className="flex items-center gap-1.5">
            <BarChartIcon className="text-gray-500 dark:text-gray-400" />
            <span>{symbolName}</span>
            <span className="text-gray-500 dark:text-gray-400">
              ({exchange})
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
