import { user_trading_strategy } from "@prisma/client";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  const url: URL = new URL(req.url);
  const user_id: string = url.searchParams.get("user_id") as string;

  let data: user_trading_strategy[] =
    await prisma.user_trading_strategy.findMany({
      where: {
        usersId: user_id,
      },
    });
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
