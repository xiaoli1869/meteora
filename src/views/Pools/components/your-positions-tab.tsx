import React, { useEffect } from "react";
import {
  SearchOutlined,
  PlusOutlined,
  WarningOutlined,
  ExportOutlined,
  DownOutlined,
} from "@ant-design/icons";
import { Collapse } from "antd";
import { ethers } from "ethers";
import { PositionDetails } from "./position-details";
import { YourPositionsTabProps, Position } from "../type";
import { getProvider } from "../../../hook/web3/web3Service";

import { getCurrencyBalance } from "../../../hook/web3/libs/balance";
import { useStore } from "../../../store";
import {
  ERC20_ABI,
  NONFUNGIBLE_POSITION_MANAGER_ABI,
  NONFUNGIBLE_POSITION_MANAGER_CONTRACT_ADDRESS,
} from "../../../hook/web3/libs/constants";

// Using types from type.ts

export const YourPositionsTab: React.FC<YourPositionsTabProps> = ({
  pool,
  onOpenAddPosition,
}) => {
  const [positions, setPositions] = React.useState<Position[]>([]);
  const { Store } = useStore();

  const fetchUserPositions = async () => {
    const provider = getProvider();
    const currencyContract = new ethers.Contract(
      NONFUNGIBLE_POSITION_MANAGER_CONTRACT_ADDRESS,
      NONFUNGIBLE_POSITION_MANAGER_ABI,
      provider
    );
    // 获取用户的NFT数量
    const balance = await currencyContract.balanceOf(Store.walletInfo.address);
    // 初始化 Provider 和合约实例
    console.log("User NFT balance:", balance.toNumber());
    // 遍历每个tokenId并获取详细信息
    const userPositions: Position[] = [];
    for (let i = 0; i < balance.toNumber(); i++) {
      try {
        const tokenId = await currencyContract.tokenOfOwnerByIndex(
          Store.walletInfo.address,
          i
        );
        // console.log(`Token ID: ${tokenId.toString()}`);

        // 获取头寸详细信息
        const res = await currencyContract.positions(tokenId);
        const [
          nonce,
          operator,
          token0,
          token1,
          fee,
          tickLower,
          tickUpper,
          liquidity,
          feeGrowthInside0LastX128,
          feeGrowthInside1LastX128,
          tokensOwed0,
          tokensOwed1,
        ] = res;

        console.log(res);

        // 检查这个位置是否属于当前池
        if (
          token0.toLowerCase() === pool.token0.token.address.toLowerCase() &&
          token1.toLowerCase() === pool.token1.token.address.toLowerCase()
        ) {
          // 创建Position对象
          userPositions.push({
            id: tokenId.toString(),
            priceRange: {
              min: tickLower.toString(),
              max: tickUpper.toString(),
            },
            tokenPair: {
              base: pool.token0.symbol,
              quote: pool.token1.symbol,
            },
            fee: `${fee / 10000}%`,
            liquidity: liquidity.toString(),
            rangePercentage: 50, // 这里需要根据实际情况计算
          });
        }
      } catch (error) {
        console.error(`Error processing token at index ${i}:`, error);
      }
    }
    console.log(userPositions);
    // 更新positions状态
    setPositions(userPositions);
  };

  // Styles moved to index.css

  if (positions.length === 0) {
    return (
      <div className="py-16">
        <div className="flex flex-col items-center justify-center">
          <div className="bg-[#1a2235] p-3 rounded-full mb-6 flex items-center justify-center">
            <SearchOutlined
              style={{ fontSize: "24px" }}
              className="text-gray-400"
            />
          </div>
          <h3 className="text-white text-xl font-medium mb-2">
            No Positions Found
          </h3>
          <p className="text-gray-400 mb-6 text-center">
            You don't have any liquidities in this pool. Add liquidity to earn
            pool rewards.
          </p>
          <button
            // onClick={onOpenAddPosition}
            onClick={fetchUserPositions}
            className="bg-indigo-700 hover:bg-indigo-600 text-white px-4 py-2 rounded-md flex items-center"
          >
            <PlusOutlined className="mr-2" />
            Add Liquidity
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-4">
      {/* Styles moved to index.css */}

      {/* Table Header */}
      <div className="grid grid-cols-4 gap-4 text-gray-400 text-sm mb-2 px-4">
        <div>Price Range</div>
        <div className="text-center">24hr Fee / TVL</div>
        <div className="text-center">Your Liquidity</div>
        <div className="text-center">Range</div>
      </div>

      {/* Positions List */}
      <Collapse
        accordion
        bordered={false}
        expandIcon={({ isActive }) => (
          <DownOutlined
            className={`text-gray-400 transition-transform duration-300 ${
              isActive ? "rotate-180" : ""
            }`}
            style={{ color: "#fff" }}
          />
        )}
        className="position-collapse bg-transparent"
        items={positions.map((position) => ({
          key: position.id,
          label: (
            <div className="grid grid-cols-4 gap-4 w-full py-4 px-4 bg-[#1f1e33]">
              <div>
                <div className="text-white font-medium">
                  {position.priceRange.min} - {position.priceRange.max}
                </div>
                <div className="text-gray-400 text-xs mt-1">
                  {position.tokenPair.base} per {position.tokenPair.quote}
                </div>
              </div>
              <div className="flex items-center justify-center">
                <span className="text-white">{position.fee}</span>
              </div>
              <div className="flex items-center justify-center">
                <span className="text-white">{position.liquidity}</span>
              </div>
              <div className="flex items-center justify-center">
                <div className="w-32 bg-gray-700 h-2 rounded-full mr-2">
                  <div
                    className="bg-purple-500 h-2 rounded-full"
                    style={{ width: `${position.rangePercentage}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ),
          children: <PositionDetails position={position} />,
          className: "border-0 overflow-hidden",
        }))}
      />
    </div>
  );
};
