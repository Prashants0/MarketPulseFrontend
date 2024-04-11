import { IChartApi } from "lightweight-charts";
import { create } from "zustand";

type chartApiRefStore = {
  chart: IChartApi | undefined;
  setChart: (chartSeries: IChartApi) => void;
};

export const useChartState = create<chartApiRefStore>()((set) => ({
  chart: undefined,
  setChart: (chartSeries: IChartApi) => set({ chart: chartSeries }),
}));
