import { useEffect, useRef } from "react";
import { createChart, ColorType, CrosshairMode, CandlestickSeries } from "lightweight-charts";

export function ChartFund(props: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
  colors?: Record<string, string>;
}) {
  const {
    data,
    colors: {
      backgroundColor = "transparent",
      lineColor = "#2962FF",
      textColor = "black",
      areaTopColor = "#2962FF",
      areaBottomColor = "rgba(41, 98, 255, 0.28)",
    } = {},
  } = props;

  const chartContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      chart.applyOptions({ width: chartContainerRef!.current!.clientWidth });
    };

    const chart = createChart(chartContainerRef!.current!, {
      layout: {
        attributionLogo: false,
        textColor: "white",
        background: {
          type: ColorType.Solid,
          color: "transparent",
        },
      },
      grid: {
        vertLines: { color: "transparent" },
        horzLines: { color: "transparent" },
      },
      width: chartContainerRef.current!.clientWidth,
      height: chartContainerRef.current!.clientHeight,
    });

    chart.timeScale().applyOptions({
      borderVisible: false,
    });

    chart.timeScale().fitContent();
    // chart.timeScale().getVisibleRange();

    // const newSeries = chart.addSeries(AreaSeries, {
    //   lineColor,
    //   topColor: areaTopColor,
    //   bottomColor: areaBottomColor,
    // });
    // newSeries.setData(data);

    const candleSeries = chart.addSeries(CandlestickSeries, {
      upColor: "#26a69a",
      downColor: "#ef5350",
      borderVisible: false,
      wickUpColor: "#26a69a",
      wickDownColor: "#ef5350",
      borderColor: "#000000",
    });

    candleSeries.setData(data);

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);

      chart.remove();
    };
  }, [data, backgroundColor, lineColor, textColor, areaTopColor, areaBottomColor]);

  return <div ref={chartContainerRef} className="h-96 w-full" />;
}
