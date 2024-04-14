"use client";

import { useRef, useEffect } from "react";
import {
  createChart,
  ColorType,
  ISeriesApi,
  SeriesMarker,
  Time,
} from "lightweight-charts";
import { SymbolCandlesData, SymbolEmaRsiData } from "@/types/symbol-types";
import { useChartSeriesState } from "@/app/state/useChartSeriesState";
import { useChartState } from "@/app/state/Chart-state";

export enum StrategyTypeEnum {
  EMA = 1,
  MACD = 2,
  RSI = 3,
  VWAP = 4,
}

const BacktestChart = (props: {
  data: SymbolEmaRsiData[];
  symbol: string;
  strategyType: StrategyTypeEnum;
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
  const { setChart } = useChartState();

  useEffect(() => {
    const handleResize = () => {
      chart.applyOptions({
        width: chartContainerRef.current!.clientWidth,
        height: chartContainerRef.current!.clientHeight,
      });
    };

    const markers = [] as SeriesMarker<Time>[];
    let ema1 = [];
    let ema2 = [];
    let ema3 = [];
    let rsi = [];
    if (props.strategyType == StrategyTypeEnum.EMA) {
      for (let i = 0; i < data.length; i++) {
        console.log(data[i].signal);

        if (data[i].signal == "buy") {
          markers.push({
            time: data[i].time,
            position: "belowBar",
            color: "#2196F3",
            shape: "arrowUp",
            text: "Buy",
          });
        } else if (data[i].signal == "sell") {
          markers.push({
            time: data[i].time,
            position: "aboveBar",
            color: "#e91e63",
            shape: "arrowDown",
            text: "Sell",
          });
        }
        ema1.push({ time: data[i].time, value: data[i].ema1 });
        ema2.push({ time: data[i].time, value: data[i].ema2 });
        ema3.push({ time: data[i].time, value: data[i].ema3 });
        rsi.push({ time: data[i].time, value: data[i].rsi });
      }
    }

    const chart = createChart(chartContainerRef.current!, {
      layout: {
        background: { type: ColorType.Solid, color: backgroundColor },
        textColor,
      },
      width: chartContainerRef.current!.clientWidth,
      height: chartContainerRef.current!.clientHeight - 40,
      timeScale: {
        timeVisible: true,
        secondsVisible: true,
      },
    });

    setChart(chart);

    chart.timeScale().applyOptions({
      rightOffset: 20,
    });

    const ema1Series = chart.addLineSeries({ color: "#2962FF", lineWidth: 1 });
    ema1Series.setData(ema1);

    const ema2Series = chart.addLineSeries({ color: "#26a69a", lineWidth: 1 });
    ema2Series.setData(ema2);

    const ema3Series = chart.addLineSeries({ color: "#ef5350", lineWidth: 1 });
    ema3Series.setData(ema3);

    const newSeries = chart.addCandlestickSeries({
      upColor: "#26a69a",
      downColor: "#ef5350",
      borderVisible: false,
      wickUpColor: "#26a69a",
      wickDownColor: "#ef5350",
    });
    setChartSeries(newSeries);

    newSeries.setData(data as SymbolEmaRsiData[]);
    newSeries.setMarkers(markers);

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      setChartSeries(undefined);
      chart.remove();
    };
  }, [
    setChartSeries,
    symbol,
    data,
    setChart,
    backgroundColor,
    textColor,
    props.strategyType,
  ]);
  return (
    <>
      <div
        className="w-full relative h-full"
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

export default BacktestChart;
