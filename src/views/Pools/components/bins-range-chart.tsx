import { useEffect, useRef, useState } from "react";
import * as echarts from "echarts";
import { useCallback } from "react";
import { Slider } from "antd";

interface DataPoint {
  price: number;
  value: number;
}
type BinsRangeChartProps = {
  bins: number;
};
export default function BinsRangeChart(props: BinsRangeChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);
  const [dividerPosition, setDividerPosition] = useState((props.bins + 1) / 2); // Percentage position
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [tooltipData, setTooltipData] = useState({ price: 0, trump: 0 });
  const [tooltipPosition, setTooltipPosition] = useState({ left: 0, top: 0 });

  // Sample data
  const data: DataPoint[] = Array.from({ length: 70 }, (_, i) => ({
    price: 11.15 + i * 0.01,
    value: Math.random() * 0.5 + 0.5,
  }));

  const dividerPrice = useCallback(() => {
    // Calculate index based on the new slider range (0 to props.bins + 1)
    // Ensure the index is within bounds of the data array
    const ratio = dividerPosition / (props.bins + 1);
    const index = Math.min(Math.floor(data.length * ratio), data.length - 1);
    return data[index]?.price || 11.53;
  }, [dividerPosition, data, props.bins]);

  const updateChart = useCallback(() => {
    if (!chartInstance.current) return;

    const dividerPriceValue = dividerPrice();

    // Instead of modifying data, we'll use a custom renderItem function to change colors
    chartInstance.current.setOption({
      grid: {
        left: 40,
        right: 20,
        top: 60,
        bottom: 40,
      },
      tooltip: {},
      xAxis: {
        type: "category",
        data: data.map((item) => item.price.toFixed(2)),
        axisLine: {
          lineStyle: {
            color: "rgba(255, 255, 255, 0.3)",
          },
        },
        axisLabel: {
          color: "rgba(255, 255, 255, 0.7)",
          fontSize: 10,
          interval: 10,
        },
        axisTick: {
          show: false,
        },
      },
      yAxis: {
        type: "value",
        show: false,
      },
      series: [
        {
          name: "Price",
          type: "bar",
          data: data.map((item) => item.value),
          barWidth: "60%",
          itemStyle: {
            // Use a callback function to determine color based on data point
            color: (params: any) => {
              const price = data[params.dataIndex].price;
              return price < dividerPriceValue ? "#00D2FF" : "#8A7CFF";
            },
          },
        },
      ],
    });
  }, [data, dividerPrice]);

  // Initialize chart
  useEffect(() => {
    if (chartRef.current) {
      chartInstance.current = echarts.init(chartRef.current);

      // Handle chart click for tooltip
      chartInstance.current.on("click", (params: any) => {
        if (chartRef.current) {
          const index = params.dataIndex;
          const price = data[index].price;
          const trump = 0.032666; // Sample value, would be calculated based on real data

          setTooltipData({ price, trump });
          setTooltipPosition({
            left: params.event.offsetX,
            top: 0,
          });
          setTooltipVisible(true);

          // Hide tooltip after 3 seconds
          setTimeout(() => setTooltipVisible(false), 3000);
        }
      });

      updateChart();

      // Handle resize
      const handleResize = () => {
        chartInstance.current?.resize();
        updateChart();
      };
      window.addEventListener("resize", handleResize);

      return () => {
        chartInstance.current?.dispose();
        window.removeEventListener("resize", handleResize);
      };
    }
  }, [updateChart]);

  // Update chart when divider position changes
  useEffect(() => {
    updateChart();
  }, [dividerPosition, updateChart]);

  // Handle slider change
  const handleSliderChange = (value: number) => {
    setDividerPosition(value);
  };

  return (
    <div className="">
      <div className="relative">
        {/* <div className="absolute left-1/2 top-0 transform -translate-x-1/2 bg-[#191C32]/85 text-white px-4 py-2 rounded-lg z-20">
          <div className="text-center">
            <div className="text-sm">Current Price</div>
            <div className="font-bold">
              {dividerPrice().toFixed(2)} USDC/TRUMP
            </div>
          </div>
        </div> */}

        <div className="h-56 relative">
          <div ref={chartRef} className="w-full h-full"></div>
        </div>

        <div className="relative w-[calc(100%-3rem)] m-auto -translate-y-[3rem] translate-x-[0.7rem]">
          <Slider
            value={dividerPosition}
            className=""
            onChange={handleSliderChange}
            min={0}
            max={props.bins + 1}
            step={1}
            // tooltip={{ formatter: null }}
          />
          <div
            className="h-[150px] w-0.5 bg-white absolute top-0 -translate-y-full -translate-x-1/2"
            style={{
              left: `${(dividerPosition / (props.bins + 1)) * 100}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
}
