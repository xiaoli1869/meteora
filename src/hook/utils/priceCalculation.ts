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
 * @returns 价格区间数组
 */
export function calculatePriceRange(
  currentPrice: number,
  binStep: number,
  numBins: number,
  dividerPosition: number
): number[] {
  if (currentPrice <= 0 || binStep <= 0) return [];

  const binStepRate = 1 + binStep / 10000;
  const prices: number[] = [];

  for (let i = -dividerPosition; i <= numBins - dividerPosition; i++) {
    const price = currentPrice * Math.pow(binStepRate, i);
    prices.push(formatPrice(price));
  }

  return prices;
}

/**
 * 计算权重分布
 */
function calculateWeights(
  prices: number[],
  currentPrice: number,
  strategy: string
): number[] {
  const length = prices.length;
  const currentIndex = prices.findIndex((p) => p >= currentPrice);

  switch (strategy) {
    case "spot":
      return new Array(length).fill(1);

    case "curve": {
      // 调整方差参数，使曲线更加平滑
      const variance = Math.pow(length / 3, 2);
      // 使用高斯分布函数生成权重
      return prices.map((_, i) => {
        // 计算与当前价格的距离
        const distance = Math.abs(i - currentIndex);
        // 应用高斯分布公式
        return Math.exp(-Math.pow(distance, 2) / (2 * variance));
      });
    }

    case "bidAsk": {
      // 创建线性递增的分布，在当前价格处最低，两端最高
      return prices.map((_, i) => {
        // 计算与当前价格的距离
        const distance = Math.abs(i - currentIndex);
        // 使用线性递增函数，确保最小值为0.1，最大值为1
        // 使用length/2作为分母，使分布更加合理
        return Math.min(0.1 + distance / (length / 2), 1);
      });
    }

    default:
      return new Array(length).fill(1);
  }
}

/**
 * 格式化价格精度
 */
export function formatPrice(price: number, decimals: number = 6): number {
  return Number(price.toFixed(decimals));
}

/**
 * 计算代币分配策略
 */
export function calculateTokenAllocation(
  prices: number[],
  firstTokenAmount: number, // token0数量（如TRUMP）
  secondTokenAmount: number, // token1数量（如USDC）
  currentPrice: number, // 当前价格（USDC/TRUMP）
  strategy: string = "spot", // 分配策略
  autoFill: boolean = false, // 新增参数，启用auto-fill模式
  isSecendAmountChange: boolean = false // 新增参数，启用auto-fill模式
): Array<{ token0: number; token1: number }> {
  if (prices.length === 0) return [];
  // 1. 计算权重分布
  const weights = calculateWeights(prices, currentPrice, strategy);

  const currentIndex = prices.findIndex((p) => p >= currentPrice);

  // 2. 分别计算左右两侧的权重总和
  const leftWeights = weights.slice(0, currentIndex);
  const rightWeights = weights.slice(currentIndex);

  const totalLeftWeight = leftWeights.reduce((a, b) => a + b, 0);
  const totalRightWeight = rightWeights.reduce((a, b) => a + b, 0);

  // 如果启用autoFill模式，根据参数决定计算方式
  let calculatedSecondTokenAmount = secondTokenAmount;
  let calculatedFirstTokenAmount = firstTokenAmount;

  if (autoFill) {
    if (!isSecendAmountChange && firstTokenAmount > 0) {
      // 根据token0数量和当前价格自动计算token1数量
      // 计算右侧token0的总价值（以token1计价）
      const rightSideValue = firstTokenAmount * currentPrice;
      // 根据权重比例，计算左侧应该分配的token1数量
      calculatedSecondTokenAmount =
        totalLeftWeight > 0
          ? rightSideValue * (totalLeftWeight / totalRightWeight)
          : 0;
    } else if (isSecendAmountChange && secondTokenAmount > 0) {
      // 根据token1数量和当前价格自动计算token0数量
      // 计算左侧token1的总价值（以token0计价）
      const leftSideValue = secondTokenAmount / currentPrice;
      // 根据权重比例，计算右侧应该分配的token0数量
      calculatedFirstTokenAmount =
        totalRightWeight > 0
          ? leftSideValue * (totalRightWeight / totalLeftWeight)
          : 0;
    }
  }

  // 3. 遍历每个价格区间分配代币
  return prices.map((price, index) => {
    if (index < currentIndex) {
      // 价格低于当前价格，只使用token1
      if (totalLeftWeight <= 0 || calculatedSecondTokenAmount <= 0) {
        return { token0: 0, token1: 0 };
      }
      const token1Amount =
        calculatedSecondTokenAmount * (weights[index] / totalLeftWeight);
      return {
        token0: 0,
        token1: formatPrice(token1Amount),
      };
    } else if (index > currentIndex) {
      // 价格高于当前价格，只使用token0
      if (totalRightWeight <= 0 || calculatedFirstTokenAmount <= 0) {
        return { token0: 0, token1: 0 };
      }
      const token0Amount =
        calculatedFirstTokenAmount * (weights[index] / totalRightWeight);
      return {
        token0: formatPrice(token0Amount),
        token1: 0,
      };
    } else {
      // 当前价格区间，合理分配两种代币
      // 如果是当前价格，我们可以选择平均分配两种代币的价值
      // 或者根据权重比例分配
      const token0Portion =
        totalRightWeight > 0 ? weights[index] / (2 * totalRightWeight) : 0;
      const token1Portion =
        totalLeftWeight > 0 ? weights[index] / (2 * totalLeftWeight) : 0;

      return {
        token0: formatPrice(calculatedFirstTokenAmount * token0Portion),
        token1: formatPrice(calculatedSecondTokenAmount * token1Portion),
      };
    }
  });
}
