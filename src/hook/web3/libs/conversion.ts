import JSBI from "jsbi";
import { ethers } from "ethers";

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
 * Converts a tick value to a price
 * @param tick The tick value from Uniswap V3 pool
 * @returns The price corresponding to the tick
 */
export function tickToPrice(tick: number): number {
  // In Uniswap V3, price = 1.0001^tick
  return Math.pow(1.0001, tick);
}

/**
 * Converts a price to a tick value
 * @param price The price value to convert to a tick
 * @returns The tick value corresponding to the price
 */
export function priceToTick(price: number): number {
  // In Uniswap V3, tick = log(price) / log(1.0001)
  return Math.floor(Math.log(price) / Math.log(1.0001));
}

/**
 * Calculates price range based on current price and bin range
 * @param currentPrice The current price value
 * @param bin The bin value (e.g., 69)
 * @param tickSpacing The tick spacing from the pool (optional)
 * @returns An object containing minPrice and maxPrice
 */
export function getPriceRangeFromBin(
  currentPrice: number,
  bin: number,
  tickSpacing?: number
): { minPrice: number; maxPrice: number } {
  let currentTick: number;
  if (currentPrice >= 0.9) {
    currentTick = priceToTick(currentPrice);
  } else {
    currentTick = currentPrice;
  }

  let lowerTick = currentTick - Math.floor(bin / 2);
  let upperTick = currentTick + Math.floor(bin / 2);

  if (tickSpacing) {
    lowerTick = Math.floor(lowerTick / tickSpacing) * tickSpacing;
    upperTick = Math.ceil(upperTick / tickSpacing) * tickSpacing;
  }

  // Convert ticks to prices
  const minPrice = tickToPrice(lowerTick);
  const maxPrice = tickToPrice(upperTick);

  return { minPrice, maxPrice };
}
