import prisma from "@/lib/prisma";

export async function GET(req: Request, res: Response) {
  try {
    const url: URL = new URL(req.url);
    const symbol_id: string = url.searchParams.get("symbol_id") as string;

    const symbolDetail = await prisma.symbol_list.findUnique({
      where: {
        id: symbol_id,
      },
    });

    return new Response(JSON.stringify(symbolDetail), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.log(error);
    return new Response("Error", {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
