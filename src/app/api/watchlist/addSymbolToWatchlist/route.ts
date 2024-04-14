import prisma from "@/lib/prisma";

export async function POST(req: Request, res: Response) {
  const { watchlist_id, symbol } = await req.json();
  console.log(watchlist_id);

  if (!watchlist_id) {
    return new Response("Watchlist Symbol Added", {
      status: 500,
      statusText: "OK",
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
  await prisma.watchlist_items.create({
    data: {
      watchlist_id: watchlist_id,
      symbol_id: symbol,
    },
  });
  return new Response("Watchlist Symbol Added", {
    status: 200,
    statusText: "OK",
    headers: {
      "Content-Type": "application/json",
    },
  });
}
