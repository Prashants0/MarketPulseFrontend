import prisma from "@/lib/prisma";
import { symbol_list } from "@prisma/client";

export async function GET(req: Request, res: Response) {
  const symbloList = (await prisma.symbol_list.findMany()) as symbol_list[];

  return new Response(
    JSON.stringify({
      symbloList,
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}
