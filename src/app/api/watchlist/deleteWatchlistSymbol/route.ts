import prisma from "@/lib/prisma";

export async function DELETE(req: Request, res: Response) {
  const {
    watchlist_id,
    symbol,
  }: {
    watchlist_id: string;
    symbol: string;
  } = await req.json();
  const watchlist_items = await prisma.watchlist_items.findFirst({
    where: {
      watchlist_id: watchlist_id,
      symbol_id: symbol,
    },
  });
  if (watchlist_items == null) {
    return new Response("Watchlist Symbol Deleted", {
      status: 400,
      statusText: "OK",
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
  await prisma.watchlist_items.delete({
    where: {
      id: watchlist_items.id,
    },
  });
  return new Response("Watchlist Symbol Deleted", {
    status: 200,
    statusText: "OK",
    headers: {
      "Content-Type": "application/json",
    },
  });
}
