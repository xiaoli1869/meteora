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
export function priceToTick(price: number, tickSpacing: number): number {
  // 1. 计算原始 tick（向下取整）
  const rawTick = Math.floor(Math.log(price) / Math.log(1.0001));

  // 2. 根据 tickSpacing 对齐到最近的合法 tick
  // 规则：adjustedTick 必须是 tickSpacing 的整数倍，且是小于等于 rawTick 的最接近值
  const adjustedTick = Math.floor(rawTick / tickSpacing) * tickSpacing;

  return adjustedTick;
}
