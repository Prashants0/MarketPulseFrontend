import { user_trading_strategy } from "@prisma/client";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  const { strategy_id, user_id } = await req.json();

  let data: user_trading_strategy = await prisma.user_trading_strategy.create({
    data: {
      usersId: user_id as string,
      id: strategy_id,
      strategy: 1,
    },
  });
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
