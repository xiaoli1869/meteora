import JSBI from "jsbi";
import { ethers } from "ethers";
import { getProvider } from "../web3Service";
import {
  NONFUNGIBLE_POSITION_MANAGER_ABI,
  NONFUNGIBLE_POSITION_MANAGER_CONTRACT_ADDRESS,
} from "./constants";
import { PoolItem, Position } from "../../../views/Pools/type";
import { getPoolInfo, PoolInfo } from "./pool";
import { getCurrencyBalance } from "./balance";

export function fromReadableAmount(amount: number, decimals: number): number {
  const extraDigits = Math.pow(10, countDecimals(amount));
  const adjustedAmount = amount * extraDigits;
  let bigIntAmount = JSBI.divide(
    JSBI.multiply(
      JSBI.BigInt(adjustedAmount),
      JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(decimals))
    ),
    JSBI.BigInt(extraDigits)
  );

  return JSBI.toNumber(bigIntAmount);
}

export function toReadableAmount(rawAmount: number, decimals: number): string {
  return JSBI.divide(
    JSBI.BigInt(rawAmount),
    JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(decimals))
  ).toString();
}

/**
 * Converts sqrtPriceX96 to price
 * @param sqrtPriceX96 The sqrt price in X96 format from Uniswap V3 pool
 * @returns The price of token1 in terms of token0
 */
export function sqrtPriceX96ToPrice(sqrtPriceX96: ethers.BigNumber): number {
  const Q96 = JSBI.exponentiate(JSBI.BigInt(2), JSBI.BigInt(96));
  const sqrtPriceX96JSBI = JSBI.BigInt(sqrtPriceX96.toString());
  const sqrtPrice = JSBI.divide(sqrtPriceX96JSBI, Q96);
  const sqrtPriceDecimal =
    Number(sqrtPrice.toString()) +
    Number(JSBI.remainder(sqrtPriceX96JSBI, Q96).toString()) /
      Number(Q96.toString());

  return Math.pow(sqrtPriceDecimal, 2);
}

function countDecimals(x: number) {
  if (Math.floor(x) === x) {
    return 0;
  }
  return x.toString().split(".")[1].length || 0;
}

/**
 * Converts a price to a tick value
 * @param price The price value to convert to a tick
 * @returns The tick value corresponding to the price
 */
export function priceToTick(price: number, tickSpacing: number): number {
  // 1. 计算原始 tick（向下取整）
  const rawTick = Math.floor(Math.log(price) / Math.log(1.0001));

  // 2. 根据 tickSpacing 对齐到最近的合法 tick
  // 规则：adjustedTick 必须是 tickSpacing 的整数倍，且是小于等于 rawTick 的最接近值
  const adjustedTick = Math.floor(rawTick / tickSpacing) * tickSpacing;

  return adjustedTick;
}

/**
 * Converts a tick to price value
 * @param tick The tick value to convert to price
 * @returns The price corresponding to the tick
 */
export function tickToPrice(tick: number): number {
  return Math.pow(1.0001, tick);
}

export const calculateTokenAmounts = (
  liquidity: string | number,
  tickLower: string | number,
  tickUpper: string | number,
  currentPrice: number,
  token0Decimals: number,
  token1Decimals: number
) => {
  // 将tick转换为价格
  const priceLower = tickToPrice(Number(tickLower));
  const priceUpper = tickToPrice(Number(tickUpper));
  const sqrtPriceLower = Math.sqrt(priceLower);
  const sqrtPriceUpper = Math.sqrt(priceUpper);
  const sqrtPriceCurrent = Math.sqrt(currentPrice);

  // 计算代币数量
  let token0Amount = 0;
  let token1Amount = 0;

  if (sqrtPriceCurrent <= sqrtPriceLower) {
    // 当前价格低于范围，所有流动性都是token0
    token0Amount =
      Number(liquidity) * (1 / sqrtPriceLower - 1 / sqrtPriceUpper);
    token1Amount = 0;
  } else if (sqrtPriceCurrent >= sqrtPriceUpper) {
    // 当前价格高于范围，所有流动性都是token1
    token0Amount = 0;
    token1Amount = Number(liquidity) * (sqrtPriceUpper - sqrtPriceLower);
  } else {
    // 当前价格在范围内，流动性分布在两种代币中
    token0Amount =
      Number(liquidity) * (1 / sqrtPriceCurrent - 1 / sqrtPriceUpper);
    token1Amount = Number(liquidity) * (sqrtPriceCurrent - sqrtPriceLower);
  }

  // 应用精度转换
  const adjustedToken0Amount = token0Amount / Math.pow(10, token0Decimals);
  const adjustedToken1Amount = token1Amount / Math.pow(10, token1Decimals);

  return {
    token0Amount: adjustedToken0Amount,
    token1Amount: adjustedToken1Amount,
    token0Value: adjustedToken0Amount * currentPrice,
    token1Value: adjustedToken1Amount,
  };
};
export const getPoolPosition = async ({
  userAddress,
  pool,
}: {
  userAddress: string;
  pool: PoolItem;
}): Promise<Position[]> => {
  const MAX_RETRIES = 3; // 最大重试次数
  const BASE_DELAY = 1000; // 基础重试延迟（1秒）

  let retryCount = 0;
  const execute = async () => {
    try {
      const provider = getProvider();
      const currencyContract = new ethers.Contract(
        NONFUNGIBLE_POSITION_MANAGER_CONTRACT_ADDRESS,
        NONFUNGIBLE_POSITION_MANAGER_ABI,
        provider
      );
      // 获取用户的NFT数量
      const balance = await currencyContract.balanceOf(userAddress);
      // 初始化 Provider 和合约实例
      console.log("User NFT balance:", balance.toNumber());
      // 遍历每个tokenId并获取详细信息
      const userPositions: Position[] = [];
      const batchSize = pool.numBins;
      const batchCount = Math.ceil(balance.toNumber() / batchSize);
      const poolInfo = await getPoolInfo(pool.poolAddress);
      const currentPrice = Number(sqrtPriceX96ToPrice(poolInfo.sqrtPriceX96));
      for (let batchIndex = 0; batchIndex < batchCount; batchIndex++) {
        const batchPositions: Position[] = [];
        const startIndex = batchIndex * batchSize;
        const endIndex = Math.min(startIndex + batchSize, balance.toNumber());
        for (let i = startIndex; i < endIndex; i++) {
          const tokenId = await currencyContract.tokenOfOwnerByIndex(
            userAddress,
            i
          );
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
          // 检查这个位置是否属于当前池
          if (
            token0.toLowerCase() === pool.token0.token.address.toLowerCase() &&
            token1.toLowerCase() === pool.token1.token.address.toLowerCase()
          ) {
            const { token0Amount, token1Amount, token0Value, token1Value } =
              calculateTokenAmounts(
                liquidity,
                tickLower,
                tickUpper,
                currentPrice,
                pool.token0.token.decimals,
                pool.token1.token.decimals
              );
            // 未领取的手续费
            const claimFee0 = ethers.utils.formatUnits(
              tokensOwed0,
              pool.token0.token.decimals
            );
            const claimFee1 = ethers.utils.formatUnits(
              tokensOwed1,
              pool.token1.token.decimals
            );
            // 创建Position对象
            batchPositions.push({
              id: tokenId.toString(),
              token0: {
                icon: pool.token0.icon,
                symbol: pool.token0.symbol,
                token: pool.token0.token,
                amount: token0Amount,
                value: token0Value,
                claimFeeAmount: claimFee0,
                claimFeeValue: Number(claimFee0) * currentPrice,
              },
              token1: {
                icon: pool.token1.icon,
                symbol: pool.token1.symbol,
                token: pool.token1.token,
                amount: token1Amount,
                value: token1Value,
                claimFeeAmount: claimFee1,
                claimFeeValue: Number(claimFee1) * currentPrice,
              },
              priceRange: {
                min: tickLower.toString(),
                max: tickUpper.toString(),
              },
              fee: fee / 10000,
              minPrice: tickToPrice(Number(tickLower)),
              liquidity: liquidity.toString(),
            });
          }
        }

        if (batchPositions.length > 0) {
          // 初始化统计对象
          let stats = {
            totalToken0Value: 0,
            totalToken1Value: 0,
            totalToken0Amount: 0,
            totalToken1Amount: 0,
            totalToken0ClaimAmount: 0,
            totalToken0ClaimValue: 0,
            totalToken1ClaimAmount: 0,
            totalToken1ClaimValue: 0,
            feeSum: 0,
            minTick: Infinity,
            maxTick: -Infinity,
          };

          for (const pos of batchPositions) {
            // 累计token0统计
            stats.totalToken0Value += Number(pos.token0?.value || 0);
            stats.totalToken0Amount += Number(pos.token0?.amount || 0);
            stats.totalToken0ClaimAmount += Number(
              pos.token0?.claimFeeAmount || 0
            );
            stats.totalToken0ClaimValue += Number(
              pos.token0?.claimFeeValue || 0
            );

            // 累计token1统计
            stats.totalToken1Value += Number(pos.token1?.value || 0);
            stats.totalToken1Amount += Number(pos.token1?.amount || 0);
            stats.totalToken1ClaimAmount += Number(
              pos.token1?.claimFeeAmount || 0
            );
            stats.totalToken1ClaimValue += Number(
              pos.token1?.claimFeeValue || 0
            );

            // 累计手续费和价格区间
            stats.feeSum += Number(pos.fee || 0);
            const currentMin = parseFloat(pos.priceRange.min);
            const currentMax = parseFloat(pos.priceRange.max);
            stats.minTick = Math.min(stats.minTick, currentMin);
            stats.maxTick = Math.max(stats.maxTick, currentMax);
          }

          const avgFee = (stats.feeSum / batchPositions.length).toFixed(2);
          const minTick = stats.minTick;
          const maxTick = stats.maxTick;

          userPositions.push({
            id: `batch-${batchIndex}`,
            priceRange: {
              min: tickToPrice(minTick).toFixed(2),
              max: tickToPrice(maxTick).toFixed(2),
            },
            tokenPair: {
              base: pool.token1.symbol,
              quote: pool.token0.symbol,
            },
            fee: `${avgFee}%`,
            totalValue: stats.totalToken0Value + stats.totalToken1Value,
            totalToken0Value: stats.totalToken0Value,
            totalToken1Value: stats.totalToken1Value,
            totalToken0Amount: stats.totalToken0Amount,
            totalToken1Amount: stats.totalToken1Amount,
            totalToken0ClaimAmount: stats.totalToken0ClaimAmount,
            totalToken0ClaimValue: stats.totalToken0ClaimValue,
            totalToken1ClaimAmount: stats.totalToken1ClaimAmount,
            totalToken1ClaimValue: stats.totalToken1ClaimValue,
            currentPrice: currentPrice,
            lpList: batchPositions,
          });
        }
      }
      console.log(userPositions);
      return userPositions; // 返回所有头寸的数组
    } catch (error) {
      if (retryCount < MAX_RETRIES) {
        retryCount++;
        console.warn(`请求失败，第 ${retryCount} 次重试...`, error);

        // 指数退避算法：等待时间 = BASE_DELAY * 2^(retryCount-1)
        const delay = BASE_DELAY * Math.pow(2, retryCount - 1);
        await new Promise((resolve) => setTimeout(resolve, delay));

        // 递归重试
        return await execute();
      } else {
        console.error(`请求失败，已达最大重试次数（${MAX_RETRIES}次）`, error);
        return [];
      }
    }
  };
  return await execute();
};
export const getTokenBalance = async ({
  pool,
  userAddress,
}: {
  pool: PoolItem;
  userAddress: string;
}) => {
  const MAX_RETRIES = 3; // 最大重试次数
  const BASE_DELAY = 1000; // 基础重试延迟（1秒）
  let retryCount = 0;
  const execute = async () => {
    try {
      const res: {
        token0Balance: number;
        token1Balance: number;
        currentPrice: number;
        poolInfo: PoolInfo | null;
      } = {
        token0Balance: 0,
        token1Balance: 0,
        currentPrice: 0,
        poolInfo: null,
      };
      const poolInfo = await getPoolInfo(pool.poolAddress);
      res.poolInfo = poolInfo;
      res.currentPrice = Number(sqrtPriceX96ToPrice(poolInfo.sqrtPriceX96));
      res.token0Balance = Number(
        (await getCurrencyBalance(
          getProvider(),
          userAddress,
          pool.token0.token
        )) || 0
      );
      res.token1Balance = Number(
        (await getCurrencyBalance(
          getProvider(),
          userAddress,
          pool.token1.token
        )) || 0
      );
      return res;
    } catch (error) {
      if (retryCount < MAX_RETRIES) {
        retryCount++;
        console.warn(`请求失败，第 ${retryCount} 次重试...`, error);

        // 指数退避算法：等待时间 = BASE_DELAY * 2^(retryCount-1)
        const delay = BASE_DELAY * Math.pow(2, retryCount - 1);
        await new Promise((resolve) => setTimeout(resolve, delay));
        // 递归重试
        return await execute();
      } else {
        console.error(`请求失败，已达最大重试次数（${MAX_RETRIES}次）`, error);
        return {
          token0Balance: 0,
          token1Balance: 0,
          currentPrice: 0,
          poolInfo: null,
        };
      }
    }
  };
  return await execute();
};
