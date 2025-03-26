import { BigNumber } from "ethers";

interface PriceRange {
  minPrice: number;
  maxPrice: number;
}

/**
 * 计算价格区间
 * @param currentPrice 当前价格 (token1/token0)
 * @param binStep bin步长
 * @param numBins bin总数量
 * @returns 价格区间对象，包含最小价格和最大价格
 */
export function calculatePriceRange(
  currentPrice: number,
  binStep: number,
  numBins: number
): number[] {
  // 确保输入参数有效
  if (currentPrice <= 0 || binStep <= 0 || numBins <= 0) {
    throw new Error("Invalid input parameters");
  }

  // 计算单个bin的价格变化率
  const binStepRate = 1 + binStep / 10000; // 例如：binStep为10时，binStepRate为1.001
  const lowerBound = -Math.ceil(numBins / 2);
  const upperBound = Math.floor(numBins / 2);
  // 创建价格数组
  const prices: number[] = [];

  // 从-35到+34遍历计算每个bin的价格
  for (let i = lowerBound; i <= upperBound; i++) {
    const price = currentPrice * Math.pow(binStepRate, i);
    prices.push(formatPrice(price));
  }

  return prices;
}

/**
 * 格式化价格，保留指定位数的小数
 * @param price 价格
 * @param decimals 小数位数
 * @returns 格式化后的价格
 */
export function formatPrice(price: number, decimals: number = 6): number {
  return Number(price.toFixed(decimals));
}
