import { IChartApi, ISeriesApi } from "lightweight-charts";
import { create } from "zustand";

type chartApiRefStore = {
  chartSeries: ISeriesApi<"Candlestick"> | undefined;
  setChartSeries: (chartSeries: ISeriesApi<"Candlestick"> | undefined) => void;
};

export const useChartSeriesState = create<chartApiRefStore>()((set) => ({
  chartSeries: undefined,
  setChartSeries: (chartSeries: ISeriesApi<"Candlestick"> | undefined) =>
    set({ chartSeries: chartSeries }),
}));
