import yahooFinance from "yahoo-finance2";

export async function GET(req: Request, res: Response) {
  const url = new URL(req.url);
  const symbolId = url.searchParams.get("symbol") as string;
  yahooFinance._opts.cookieJar?.removeAllCookiesSync();
  const symbolData = await prisma?.symbol_list.findFirst({
    where: {
      id: symbolId,
    },
  });

  let exchangeSymbol = "NS";
  if (symbolData?.exchange == "NSE") {
    exchangeSymbol = "NS";
  } else if (symbolData?.exchange == "BSE") {
    exchangeSymbol = "BO";
  }
  const symbol = `${symbolData?.symbol}.${exchangeSymbol}`;
  const date = new Date().getTime();
  const currentTimestamp = Math.floor(Date.now() / 1000);

  const secondsIn60Days = 5 * 360 * 24 * 60 * 60;

  const sixMonthsAgo = new Date((currentTimestamp - secondsIn60Days) * 1000);
  const queryOptions = {
    period1: sixMonthsAgo,
  };
  const result = await yahooFinance.chart(`${symbol}`, queryOptions);
  const structedResult = result.quotes.map((data) => {
    return {
      time: data.date.toISOString().split("T")[0],
      high: data.high ?? 0,
      volume: data.volume ?? 0,
      open: data.open ?? 0,
      low: data.low ?? 0,
      close: data.close ?? 0,
      adjclose: data.adjclose ?? 0,
    };
  });

  return new Response(JSON.stringify(structedResult), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
