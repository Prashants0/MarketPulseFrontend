import { user_trading_strategy } from "@prisma/client";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  const url: URL = new URL(req.url);
  const user_id: string = url.searchParams.get("user_id") as string;
  const strategy_id: string = url.searchParams.get("strategy_id") as string;

  const strategy: user_trading_strategy | null =
    await prisma.user_trading_strategy.findFirst({
      where: {
        id: strategy_id,
        usersId: user_id,
      },
    });
  console.log(strategy);
  console.log(strategy_id);
  console.log(user_id);

  if (!strategy) {
    return new Response("Strategy not found", {
      status: 400,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
  return new Response(JSON.stringify(strategy), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
