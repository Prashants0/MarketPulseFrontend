export type SymbolCandlesData = {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  adjclose: number;
};

export type SymbolEmaRsiData = {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  adjclose: number;
  ema1: number;
  ema2: number;
  ema3: number;
  rsi: number;
  signal: string;
};

export type SymbolEmaVwapData = {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  adjclose: number;
  ema1: number;
  vwap: number;
  signal: string;
};
