import React, { useState, useEffect, useMemo } from "react";
import { ReloadOutlined } from "@ant-design/icons";
import { AddPositionTabProps } from "../type";

// Import SVG files
import spotSvg from "@/assets/svg/pools/spot.svg";
import spotASvg from "@/assets/svg/pools/spot-active.svg";
import curveSvg from "@/assets/svg/pools/curve.svg";
import curveASvg from "@/assets/svg/pools/curve-active.svg";
import bidAskSvg from "@/assets/svg/pools/bidAsk.svg";
import bidAskASvg from "@/assets/svg/pools/bidAsk-active.svg";
import { Button, Input } from "antd";
import { useStore } from "../../../store";
import { getCurrencyBalance } from "../../../hook/web3/libs/balance";
import { getProvider } from "../../../hook/web3/web3Service";
import {
  parseUnitsDecimal,
  thousandSeparator,
} from "../../../hook/utils/addressFormat";
import { getPoolInfo } from "../../../hook/web3/libs/pool";
import {
  getPriceRangeFromBin,
  priceToTick,
  sqrtPriceX96ToPrice,
} from "../../../hook/web3/libs/conversion";
import { PoolsContract } from "../../../hook/web3/apeContract";
import { ethers } from "ethers";
import { ERC20_ABI } from "../../../hook/web3/libs/constants";
import { observer } from "mobx-react-lite";
import BinsRangeChart from "./bins-range-chart";
import {
  calculatePriceRange,
  calculateTokenAllocation,
} from "../../../hook/utils/priceCalculation";

// Using types from type.ts

const AddPositionTab: React.FC<AddPositionTabProps> = ({ pool }) => {
  const { pairName, token0, token1 } = pool;
  const { Store } = useStore();
  // 是否自动填充
  const [autoFill, setAutoFill] = useState(false);
  // 波动策略类型: spot/curve/bidAsk
  const [volatilityStrategy, setVolatilityStrategy] = useState<string>("spot");
  // 第一个代币输入金额
  const [firstTokenAmount, setFirstTokenAmount] = useState<string>("");
  // 第二个代币输入金额
  const [secondTokenAmount, setSecondTokenAmount] = useState<string>("");
  // token0余额
  const [token0Balance, setToken0Balance] = useState<number>(0);
  // token1余额
  const [token1Balance, setToken1Balance] = useState<number>(0);
  // 当前价格token1/token0
  const [currentPrice, setCurrentPrice] = useState<number>(0); // Mock current price
  // 最小价格
  const [minPrice, setMinPrice] = useState<number>(0);
  // 最大价格
  const [maxPrice, setMaxPrice] = useState<number>(0);
  // 最小价格百分比
  const [pricePercentageMin, setPricePercentageMin] = useState<number>(0);
  // 最大价格百分比
  const [pricePercentageMax, setPricePercentageMax] = useState<number>(0);
  // 加载状态
  const [loading, setLoading] = useState<boolean>(false);
  // bin数量
  const [numBins, setNumBins] = useState<number>(69); // Default number of bins
  // 池子信息
  const [poolInfo, setPoolInfo] = useState<any>(null);
  // 代币对名称分割
  const [firstToken, secondToken] = pairName.split("-");
  const [priceAllocations, setPriceAllocations] = useState<
    { token0: number; token1: number }[]
  >([]);
  const [binsX, setBinsX] = useState<number[]>([]);
  const [isSecendAmountChange, setIsSecendAmountChange] = useState(false);
  const [dividerPosition, setDividerPosition] = useState<number>(
    Math.ceil(numBins / 2)
  );
  useEffect(() => {
    init();
  }, [pool.poolAddress, Store.walletInfo.address]);
  const init = async () => {
    const poolInfo = await getPoolInfo(pool.poolAddress);
    setPoolInfo(poolInfo);
    setCurrentPrice(Number(sqrtPriceX96ToPrice(poolInfo.sqrtPriceX96)));
    // 获取余额
    getCurrencyBalance(
      getProvider(),
      Store.walletInfo.address,
      token0.token
    ).then((res) => {
      setToken0Balance(Number(res || 0));
    });
    getCurrencyBalance(
      getProvider(),
      Store.walletInfo.address,
      token1.token
    ).then((res) => {
      setToken1Balance(Number(res || 0));
    });
  };

  const handleDividerPositionChange = (value: number) => {
    setDividerPosition(value);
  };
  useEffect(() => {
    const binsX1 = calculatePriceRange(
      currentPrice,
      pool.binstep,
      numBins,
      dividerPosition
    );
    setBinsX(binsX1);
    setMinPrice(binsX1[0]);
    setMaxPrice(binsX1[binsX1.length - 1]);
    setPricePercentageMin(
      Number((((binsX1[0] - currentPrice) / currentPrice) * -100).toFixed(2))
    );
    setPricePercentageMax(
      Number(
        (
          ((binsX1[binsX1.length - 1] - currentPrice) / currentPrice) *
          100
        ).toFixed(2)
      )
    );
    // // 新增：计算代币分配
    const allocations = calculateTokenAllocation(
      binsX1,
      Number(firstTokenAmount),
      Number(secondTokenAmount),
      currentPrice,
      volatilityStrategy,
      autoFill,
      isSecendAmountChange
    );
    setPriceAllocations(allocations);

    // 将分配数据传递给图表
    // console.log("Price Allocations:", allocations);
    // 计算token0和token1的总和
    const token0Total = allocations.reduce(
      (sum, allocation) => sum + allocation.token0,
      0
    );
    const token1Total = allocations.reduce(
      (sum, allocation) => sum + allocation.token1,
      0
    );
    if (autoFill) {
      if (isSecendAmountChange) {
        setFirstTokenAmount(token0Total.toFixed(6));
      } else {
        setSecondTokenAmount(token1Total.toFixed(6));
      }
    }
    // console.log("Token0 Total:", token0Total);
    // console.log("Token1 Total:", token1Total);
  }, [
    firstTokenAmount,
    secondTokenAmount,
    dividerPosition,
    volatilityStrategy,
    autoFill,
    isSecendAmountChange,
  ]);
  const handleFirstTokenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value) || 0;
    setFirstTokenAmount(value.toString());
    setIsSecendAmountChange(false);
  };
  const handleSecondTokenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSecondTokenAmount(value);
    setIsSecendAmountChange(true);
  };

  const handleResetPrice = () => {
    setDividerPosition(Math.ceil(numBins / 2));
  };

  const handleHalfFirstToken = () => {
    setFirstTokenAmount((token0Balance / 2).toString());
  };

  const handleMaxFirstToken = () => {
    setFirstTokenAmount(token0Balance.toString());
  };

  const handleHalfSecondToken = () => {
    setSecondTokenAmount((token1Balance / 2).toString());
  };

  const handleMaxSecondToken = () => {
    setSecondTokenAmount(token1Balance.toString());
  };
  const hasDepositAmount = useMemo(
    () => Number(firstTokenAmount) || Number(secondTokenAmount),
    [firstTokenAmount, secondTokenAmount]
  );
  const volatilityStrategyList = [
    {
      value: "spot",
      label: "Spot",
      svg: spotSvg,
      activeSvg: spotASvg,
      content:
        "spot provides a uniform distribution that is versatile and risk adjusted, suitable for any type of market and conditions. This is similar to setting a CLMM price range.",
    },
    {
      value: "curve",
      label: "Curve",
      svg: curveSvg,
      activeSvg: curveASvg,
      content:
        "curve is ideal for a concentrated approach that aims to maximise capital efficiency. This is great for stables or pairs where the price does not change very often.",
    },
    {
      value: "bidAsk",
      label: "Bid Ask",
      svg: bidAskSvg,
      activeSvg: bidAskASvg,
      content:
        "Bid-Ask is an inverse Curve distribution, typically deployed single sided for a DCA in or out strategy. It can be used to capture volatility especially when prices vastly move out of the typical range.",
    },
  ];
  const handelMinPriceChange = (e: any) => {
    const value = e.target.value;
    setMinPrice(value);
  };
  const handelPricePercentageMinChange = (e: any) => {
    const value = e.target.value;
    setPricePercentageMin(value);
  };
  const handelMaxPriceChange = (e: any) => {
    const value = e.target.value;
    setMaxPrice(value);
  };
  const handelPricePercentageMaxChange = (e: any) => {
    const value = e.target.value;
    setPricePercentageMax(value);
  };
  const handelNumBinsChange = (e: any) => {};
  const handleAddLiquidity = async () => {
    try {
      setLoading(true);

      const approveToken0 = await new ethers.Contract(
        token0.token.address,
        ERC20_ABI,
        getProvider().getSigner()
      ).approve(
        PoolsContract().address,
        parseUnitsDecimal(String(firstTokenAmount), token0.token.decimals)
      );
      const approveToken1 = await new ethers.Contract(
        token1.token.address,
        ERC20_ABI,
        getProvider().getSigner()
      ).approve(
        PoolsContract().address,
        parseUnitsDecimal(String(secondTokenAmount), token1.token.decimals)
      );
      await approveToken0.wait();
      await approveToken1.wait();

      // 构造 MintParams 数组
      const mintParams = binsX
        .slice(0, -1)
        .map((_, index) => {
          const allocation = priceAllocations[index];
          const token0Amt = allocation.token0;
          const token1Amt = allocation.token1;

          // 跳过无分配的区间
          if (token0Amt <= 0 && token1Amt <= 0) return null;

          // 转换价格区间为 tick
          const priceLower = binsX[index];
          const priceUpper = binsX[index + 1];
          const tickLower = priceToTick(priceLower);
          const tickUpper = priceToTick(priceUpper);

          return {
            token0: token0.token.address,
            token1: token1.token.address,
            fee: poolInfo.fee, // 确保 poolInfo 包含 fee 字段
            tickLower,
            tickUpper,
            token0Amount: parseUnitsDecimal(
              token0Amt.toString(),
              token0.token.decimals
            ),
            token1Amount: parseUnitsDecimal(
              token1Amt.toString(),
              token1.token.decimals
            ),
            amount0Min: 0, // 滑点控制可在此处调整
            amount1Min: 0,
            recipient: Store.walletInfo.address,
          };
        })
        .filter((param) => param !== null);

      // 构造 BasicParams
      const basicParams = {
        caller: Store.walletInfo.address,
        token0: token0.token.address,
        token1: token1.token.address,
        deposit0: parseUnitsDecimal(firstTokenAmount, token0.token.decimals),
        deposit1: parseUnitsDecimal(secondTokenAmount, token1.token.decimals),
      };
      console.log(mintParams, basicParams);
      // 调用合约批量添加流动性
      const tx = await PoolsContract().batchMintLP(mintParams, basicParams);
      await tx.wait();

      // // 可选：交易成功后的状态更新或提示
      console.log("Liquidity added successfully");
    } catch (error) {
      console.error("Failed to add liquidity:", error);
      // 此处可添加错误提示逻辑
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="py-4">
      {/* Deposit Amount Section */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <span className="text-white">Enter deposit amount:</span>
          <div className="flex items-center">
            <span className="text-gray-400 mr-2">Auto-Fill</span>
            <button
              className={`w-12 h-6 rounded-full flex items-center ${
                autoFill
                  ? "bg-red-500 justify-end"
                  : "bg-gray-700 justify-start"
              }`}
              onClick={() => setAutoFill(!autoFill)}
            >
              <div className="w-5 h-5 bg-white rounded-full mx-0.5"></div>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* First Token Input */}
          <div>
            <div className="bg-[#1a2235] rounded-md p-3 flex items-center justify-between mb-2">
              <div className="flex items-center">
                <img
                  src={token0.icon}
                  alt={firstToken}
                  className="w-8 h-8 rounded-full mr-2"
                />
                <span className="text-white font-medium">{firstToken}</span>
              </div>
              <input
                type="text"
                className="bg-transparent text-white text-right flex-1 focus:outline-none"
                placeholder="0.00"
                value={firstTokenAmount}
                onChange={handleFirstTokenChange}
              />
            </div>
            <div className="flex justify-between items-center px-1">
              <span className="text-gray-400 text-sm">
                Balance: {thousandSeparator(token0Balance)}
              </span>
              <div className="flex space-x-2">
                <button
                  className="bg-[#1a2235] text-gray-300 px-3 py-1 rounded text-sm"
                  onClick={handleHalfFirstToken}
                >
                  HALF
                </button>
                <button
                  className="bg-[#1a2235] text-gray-300 px-3 py-1 rounded text-sm"
                  onClick={handleMaxFirstToken}
                >
                  MAX
                </button>
              </div>
            </div>
          </div>

          {/* Second Token Input */}
          <div>
            <div className="bg-[#1a2235] rounded-md p-3 flex items-center justify-between mb-2">
              <div className="flex items-center">
                <img
                  src={token1.icon}
                  alt={secondToken}
                  className="w-8 h-8 rounded-full mr-2"
                />
                <span className="text-white font-medium">{secondToken}</span>
              </div>
              <input
                type="text"
                className="bg-transparent text-white text-right flex-1 focus:outline-none "
                placeholder="0.00"
                value={secondTokenAmount}
                onChange={handleSecondTokenChange}
              />
            </div>
            <div className="flex justify-between items-center px-1">
              <span className="text-gray-400 text-sm">
                Balance: {thousandSeparator(token1Balance)}
              </span>
              <div className="flex space-x-2">
                <button
                  className="bg-[#1a2235] text-gray-300 px-3 py-1 rounded text-sm"
                  onClick={handleHalfSecondToken}
                >
                  HALF
                </button>
                <button
                  className="bg-[#1a2235] text-gray-300 px-3 py-1 rounded text-sm"
                  onClick={handleMaxSecondToken}
                >
                  MAX
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Volatility Strategy Section */}
      <div className="flex flex-col lg:flex-row space-y-3 lg:space-y-0 lg:space-x-3 border-y border-stroke py-5 w-full">
        <div className="flex flex-col space-y-1 basis-1/2">
          <div className="text-lg font-bold text-title">
            Select Volatility Strategy
          </div>
          <div className="text-sm text-subtext">
            <span>
              {volatilityStrategyList.find(
                (item) => item.value === volatilityStrategy
              )?.content || ""}
            </span>
          </div>
        </div>
        <div className="flex items-center justify-between gap-x-3 basis-1/2">
          {volatilityStrategyList.map((item, index) => {
            const isActive = volatilityStrategy === item.value;
            return (
              <div
                key={index}
                className="flex cursor-pointer flex-col gap-y-3 justify-center items-center py-5  rounded-lg basis-1/3"
                style={{
                  border: isActive ? "1px solid #73342f" : "1px solid #1f2136",
                }}
                onClick={() => setVolatilityStrategy(item.value)}
              >
                <img
                  src={isActive ? item.activeSvg : item.svg}
                  alt={item.label}
                  width="90"
                  height="30"
                />
                <div className="text-sm font-semibold text-white">
                  {item.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Price Range Section */}
      <div className="mb-6">
        <div className="flex items-center mb-4">
          <h3 className="text-white mr-3">Set Price Range</h3>
          <button
            className="flex items-center text-gray-400 text-sm"
            onClick={handleResetPrice}
          >
            <ReloadOutlined style={{ fontSize: "14px" }} className="mr-1" />
            Reset Price
          </button>
          <div className="ml-auto flex items-center space-x-4">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-indigo-500 mr-1"></div>
              <span className="text-gray-400 text-sm">{firstToken}</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-cyan-500 mr-1"></div>
              <span className="text-gray-400 text-sm">{secondToken}</span>
            </div>
          </div>
        </div>

        {!hasDepositAmount ? (
          <div className="text-center mb-4">
            <h3 className="text-white text-lg mb-1">
              You don't have liquidity in this position
            </h3>
            <p className="text-gray-400 text-sm">
              Please enter deposit amount and select price range
            </p>
          </div>
        ) : (
          <>
            {/* Current Price Display */}
            <div className="text-center mb-4">
              <h3 className="text-white text-sm mb-1">
                Current Price
                <span className="font-bold ml-2">
                  {currentPrice.toFixed(2)} {secondToken}/{firstToken}
                </span>
              </h3>
            </div>

            {/* Price Chart */}
            <div className="bg-[#1a2235] rounded-md mb-4">
              <BinsRangeChart
                prices={binsX}
                allocations={priceAllocations}
                bins={numBins}
                token0={firstToken}
                token1={secondToken}
                dividerPosition={dividerPosition}
                onDividerPositionChange={handleDividerPositionChange}
              />
            </div>

            {/* Price Inputs */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-[#1a2235] p-3 rounded-md">
                <div className="text-gray-400 text-xs mb-1">Min Price</div>
                <div className="flex justify-between">
                  <Input
                    className="bg-transparent text-white text-lg w-1/2 border-none hover:bg-transparent focus:outline-none focus:bg-transparent focus:border-none focus:shadow-none"
                    value={minPrice}
                    onChange={handelMinPriceChange}
                  />
                  <span className="w-1/2 text-right flex items-center">
                    <Input
                      className="bg-transparent text-right text-white text-lg border-none hover:bg-transparent focus:outline-none focus:bg-transparent focus:border-none focus:shadow-none"
                      value={pricePercentageMin}
                      onChange={handelPricePercentageMinChange}
                    />
                    %
                  </span>
                </div>
              </div>

              <div className="bg-[#1a2235] p-3 rounded-md">
                <div className="text-gray-400 text-xs mb-1">Max Price</div>
                <div className="flex justify-between">
                  <Input
                    className="bg-transparent text-white text-lg w-1/2 border-none hover:bg-transparent focus:outline-none focus:bg-transparent focus:border-none focus:shadow-none"
                    value={maxPrice}
                    onChange={handelMaxPriceChange}
                  />
                  <span className="w-1/2 text-right flex items-center">
                    <Input
                      className="bg-transparent text-right text-white text-lg border-none hover:bg-transparent focus:outline-none focus:bg-transparent focus:border-none focus:shadow-none"
                      value={pricePercentageMax}
                      onChange={handelPricePercentageMaxChange}
                    />
                    %
                  </span>
                </div>
              </div>

              <div className="bg-[#1a2235] p-3 rounded-md">
                <div className="text-gray-400 text-xs mb-1">Num Bins</div>
                <Input
                  className="bg-transparent text-lg border-none hover:bg-transparent focus:outline-none focus:bg-transparent focus:border-none focus:shadow-none"
                  value={numBins}
                  style={{ color: "#fff" }}
                  disabled
                  onChange={handelNumBinsChange}
                />
              </div>
            </div>
          </>
        )}
      </div>

      {/* Add Liquidity Button */}
      <Button
        loading={loading}
        style={{
          width: "100%",
          backgroundColor: hasDepositAmount ? "#dc2626" : "#4B5563",
          color: "#fff",
          padding: "1rem 0",
          borderRadius: "0.375rem",
          fontWeight: 500,
          cursor: hasDepositAmount ? "pointer" : "not-allowed",
        }}
        size="large"
        disabled={!hasDepositAmount}
        onClick={handleAddLiquidity}
      >
        Add Liquidity
      </Button>
    </div>
  );
};
export default observer(AddPositionTab);
