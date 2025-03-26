import { useEffect, useRef, useState } from "react";
import * as echarts from "echarts";
import { useCallback } from "react";
import { Slider } from "antd";

interface DataPoint {
  price: number;
  value: { token0: number; token1: number };
}
// 修改props接口
interface BinsRangeChartProps {
  bins: number;
  prices: number[];
  allocations: { token0: number; token1: number }[];
  token0: string;
  token1: string;
  dividerPosition: number;
  onDividerPositionChange: (value: number) => void;
}

// 使用真实数据替换示例数据
export default function BinsRangeChart({
  bins,
  prices,
  allocations,
  token0,
  token1,
  dividerPosition,
  onDividerPositionChange,
}: BinsRangeChartProps) {
  // 生成真实数据
  const data: DataPoint[] = prices.map((price, index) => ({
    price,
    value: allocations[index] || { token0: 0, token1: 0 },
  }));
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);
  const dividerPrice = useCallback(() => {
    // Calculate index based on the new slider range (0 to bins + 1)
    // Ensure the index is within bounds of the data array
    const ratio = dividerPosition / (bins + 1);
    const index = Math.min(Math.floor(data.length * ratio), data.length - 1);
    return data[index]?.price;
  }, [dividerPosition, data, bins]);

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
      tooltip: {
        formatter: (params: any) => {
          const dataIndex = params.dataIndex;
          const price = data[dataIndex].price;
          const value = data[dataIndex].value;
          // 根据价格与分割线的关系显示不同的代币信息
          const isLeftSide = price < dividerPriceValue;
          return `
            Price: ${price}<br/>
            ${
              value.token0
                ? token0 + ":" + value.token0
                : token1 + ":" + value.token1
            }
          `;
        },
      },
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
          // 根据分割线位置显示不同的数据（左边token1，右边token0）
          data: data.map((item) => {
            const price = item.price;
            return price < dividerPriceValue
              ? item.value.token1
              : item.value.token0;
          }),
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
    onDividerPositionChange(value);
  };

  return (
    <div className="">
      <div className="relative">
        <div className="h-56 relative">
          <div ref={chartRef} className="w-full h-full"></div>
        </div>

        <div className="relative w-[calc(100%-3rem)] m-auto -translate-y-[3rem] translate-x-[0.7rem]">
          <Slider
            value={dividerPosition}
            className=""
            onChange={handleSliderChange}
            min={0}
            max={bins + 1}
            step={1}
            tooltip={{ formatter: null }}
          />
          <div
            className="h-[150px] w-0.5 bg-white absolute top-0 -translate-y-full -translate-x-1/2"
            style={{
              left: `${(dividerPosition / (bins + 1)) * 100}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
}
