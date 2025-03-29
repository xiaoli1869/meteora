import React, { useMemo, useState } from "react";
import { PositionDetailsProps } from "../type";
import BinsRangeChart from "./bins-range-chart";
import { calculatePriceRange } from "../../../hook/utils/priceCalculation";
import { PoolsContract } from "../../../hook/web3/apeContract";
import { Button, message } from "antd";
import { useStore } from "../../../store";
import { ethers } from "ethers";
import {
  ERC721_ABI,
  NONFUNGIBLE_POSITION_MANAGER_CONTRACT_ADDRESS,
} from "../../../hook/web3/libs/constants";
import { getProvider } from "../../../hook/web3/web3Service";
import NonfungiblePositionManagerABI from "@uniswap/v3-periphery/artifacts/contracts/NonfungiblePositionManager.sol/NonfungiblePositionManager.json";
// Using types from type.ts

export const PositionDetails: React.FC<PositionDetailsProps> = ({
  position,
  pool,
}) => {
  const [claimLoading, setClaimLoading] = useState(false);
  const [closeLoading, setCloseLoading] = useState(false);
  const { Store } = useStore();
  console.log(position);
  console.log(pool);

  const dividerPosition = useMemo(() => {
    // 使用findIndex来替代forEach循环,提高代码效率和可读性
    const index = position.lpList?.findIndex(
      (val) => val.minPrice === position.currentPrice
    );
    // 如果没找到匹配项返回0,否则返回找到的索引
    if (index === -1 || index === undefined) {
      return 0;
    } else {
      return index;
    }
  }, [position]);
  const binsX = useMemo(() => {
    return calculatePriceRange(
      pool.currentPrice || 0,
      pool.binstep,
      pool.numBins,
      dividerPosition
    );
  }, [pool, dividerPosition]);
  const priceAllocations = useMemo(() => {
    return (
      position.lpList?.reduce((acc, val) => {
        // 遍历lpList并累计token0和token1的值
        acc.push({
          token0: Number((Number(val.token0?.amount) || 0).toFixed(6)),
          token1: Number((Number(val.token1?.amount) || 0).toFixed(6)),
        });
        return acc;
      }, [] as { token0: number; token1: number }[]) || []
    );
  }, [position]);
  const claimFee = async () => {
    setClaimLoading(true);
    const tokenIds = position.lpList?.map((val) => {
      return ethers.BigNumber.from(val.id);
    });
    const approveNft = await new ethers.Contract(
      NONFUNGIBLE_POSITION_MANAGER_CONTRACT_ADDRESS,
      NonfungiblePositionManagerABI.abi,
      getProvider().getSigner()
    ).setApprovalForAll(pool.poolAddress, true);
    await approveNft.wait();
    const basicParams = {
      caller: Store.walletInfo.address,
      token0: pool.token0.token.address,
      token1: pool.token1.token.address,
      deposit0: 0,
      deposit1: 0,
    };
    console.log(tokenIds, basicParams);
    const tx = await PoolsContract().batchCollectFee(tokenIds, basicParams);
    await tx.wait();
    setClaimLoading(false);
    message.success("Claim fee successfully");
  };
  const closePosition = async () => {
    setCloseLoading(true);
    const removeParams = position.lpList?.map((val) => {
      return {
        tokenId: ethers.BigNumber.from(val.id),
        liquidityToRemove: ethers.BigNumber.from(val.liquidity),
        amount0Min: 0,
        amount1Min: 0,
      };
    });
    const basicParams = {
      caller: Store.walletInfo.address,
      token0: pool.token0.token.address,
      token1: pool.token1.token.address,
    };
    // console.log(tokenIds, basicParams);
    // const tx = await PoolsContract().batchCollectFee(tokenIds, basicParams);
    // await tx.wait();
    // setCloseLoading(false);
    // message.success("Claim fee successfully");
  };
  return (
    <div className="py-4 px-4">
      {/* Position Liquidity Section */}
      <h3 className="text-white text-lg font-medium mb-6">
        Position Liquidity
      </h3>

      <div className="grid grid-cols-2 gap-8 mb-8">
        {/* Current Balance */}
        <div>
          <div className="text-gray-400 mb-3">Current Balance</div>
          <div className="space-y-2">
            <div className="flex items-center gap-x-2">
              <img className="w-5 h-5" src={pool.token0?.icon} alt="" />
              <span className="text-white font-medium">
                {position.totalToken0Amount?.toFixed(4)} {pool.token0?.symbol}
              </span>
              <span className="text-gray-400">
                (${position.totalToken0Value?.toFixed(2)})
              </span>
            </div>
            <div className="flex items-center gap-x-2">
              <img className="w-5 h-5" src={pool.token1?.icon} alt="" />
              <span className="text-white font-medium">
                {position.totalToken1Amount?.toFixed(4)} {pool.token1?.symbol}
              </span>
              <span className="text-gray-400">
                (${position.totalToken1Value?.toFixed(2)})
              </span>
            </div>
          </div>
        </div>

        {/* Unclaimed Swap Fee */}
        <div>
          <div className="text-gray-400 mb-3">Your Unclaimed Swap Fee</div>
          <div className="space-y-2">
            <div className="flex items-center gap-x-2">
              <img className="w-5 h-5" src={pool.token0?.icon} alt="" />
              <span className="text-white font-medium">
                {position.totalToken0ClaimAmount} {pool.token0?.symbol}
              </span>
              <span className="text-gray-400">
                (${position.totalToken0ClaimValue?.toFixed(2)})
              </span>
            </div>
            <div className="flex items-center gap-x-2">
              <img className="w-5 h-5" src={pool.token1?.icon} alt="" />
              <span className="text-white font-medium">
                {position.totalToken1ClaimAmount} {pool.token1?.symbol}
              </span>
              <span className="text-gray-400">
                (${position.totalToken1ClaimValue?.toFixed(2)})
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Withdraw Section */}
      <div className="mb-6">
        {/* Price Chart */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <span className="text-gray-400 text-sm">Current Price</span>
            </div>
            <span className="text-white text-sm">
              {position.currentPrice} {pool.token1.symbol} per{" "}
              {pool.token0.symbol}
            </span>
          </div>
          <div className="bg-[#1a2235] rounded-md mb-4">
            <BinsRangeChart
              prices={binsX}
              allocations={priceAllocations}
              bins={pool.numBins}
              token0={pool.token0.symbol}
              token1={pool.token0.symbol}
              dividerPosition={dividerPosition}
              onDividerPositionChange={() => {}}
            />
          </div>
          <div className="text-center text-gray-400 text-sm mb-4">
            You will receive 100% from bin {position.priceRange.min} to bin{" "}
            {position.priceRange.max}
          </div>

          <div className="bg-[#1a2235] rounded-md p-3 mb-4 flex items-center">
            <div className="flex items-center gap-x-2">
              <img className="w-5 h-5" src={pool.token0?.icon} alt="" />
              <span className="text-white font-medium">
                {position.totalToken0Amount?.toFixed(9)} {pool.token0.symbol}
              </span>
            </div>
            <span className="mx-2 text-gray-400">+</span>
            <div className="flex items-center gap-x-2">
              <img className="w-5 h-5" src={pool.token1?.icon} alt="" />
              <span className="text-white font-medium">
                {position.totalToken1Amount?.toFixed(9)} {pool.token1.symbol}
              </span>
            </div>
          </div>
          <Button
            className="hover:opacity-80"
            loading={closeLoading}
            style={{
              width: "100%",
              backgroundColor: "#dc2626",
              border: "none",
              color: "#fff",
              padding: "1rem 0",
              borderRadius: "0.375rem",
              fontWeight: 500,
            }}
            size="large"
            onClick={closePosition}
          >
            Close LP
          </Button>
          <Button
            className="hover:opacity-80 mt-4"
            loading={claimLoading}
            style={{
              width: "100%",
              backgroundColor: "#7826dc",
              border: "none",
              color: "#fff",
              padding: "1rem 0",
              borderRadius: "0.375rem",
              fontWeight: 500,
            }}
            size="large"
            onClick={claimFee}
          >
            Claim Fee
          </Button>

          <p className="text-gray-500 text-xs mt-2">
            * Closing the position withdraws all of the provided liquidity and
            claims all unclaimed fees
          </p>
        </div>
      </div>
    </div>
  );
};
