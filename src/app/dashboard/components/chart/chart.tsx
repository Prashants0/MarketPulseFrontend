"use client";

import { useRef, useEffect } from "react";
import { createChart, ColorType } from "lightweight-charts";
import { SymbolCandlesData } from "@/types/symbol-types";
import { useChartSeriesState } from "@/app/state/useChartSeriesState";

const Chart = (props: {
  symbol: string;
  data: any;
  colors?:
    | {
        backgroundColor?: "white" | undefined;
        lineColor?: "#2962FF" | undefined;
        textColor?: "black" | undefined;
        areaTopColor?: "#2962FF" | undefined;
        areaBottomColor?: "rgba(41, 98, 255, 0.28)" | undefined;
      }
    | undefined;
}) => {
  const {
    symbol,
    data,
    colors: {
      backgroundColor = "white",
      lineColor = "#2962FF",
      textColor = "black",
      areaTopColor = "#2962FF",
      areaBottomColor = "rgba(41, 98, 255, 0.28)",
    } = {},
  } = props;

  const chartContainerRef = useRef<HTMLDivElement>();
  const chartLegendRef = useRef<HTMLDivElement>();
  const { setChartSeries } = useChartSeriesState();

  useEffect(() => {
    const handleResize = () => {
      chart.applyOptions({ width: chartContainerRef.current!.clientWidth });
    };

    const chart = createChart(chartContainerRef.current!, {
      layout: {
        background: { type: ColorType.Solid, color: backgroundColor },
        textColor,
      },
      width: chartContainerRef.current!.clientWidth,
      height: chartContainerRef.current!.clientHeight,
    });

    const newSeries = chart.addCandlestickSeries({
      upColor: "#26a69a",
      downColor: "#ef5350",
      borderVisible: false,
      wickUpColor: "#26a69a",
      wickDownColor: "#ef5350",
    });

    setChartSeries(newSeries);

    newSeries.setData(data as SymbolCandlesData[]);

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);

      chart.remove();
    };
  }, [
    setChartSeries,
    data,
    backgroundColor,
    lineColor,
    textColor,
    areaTopColor,
    areaBottomColor,
  ]);
  return (
    <>
      <div
        className="w-full h-[80vh] parent relative"
        ref={chartContainerRef as React.RefObject<HTMLDivElement>}
      >
        <div
          className="absolute top-5 left-5 z-10 font-bold text-md"
          ref={chartLegendRef as React.RefObject<HTMLDivElement>}
        >
          {symbol}
        </div>
      </div>
    </>
  );
};

export default Chart;
