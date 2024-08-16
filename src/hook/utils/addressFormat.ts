import { BigNumber, ethers } from "ethers";

export default function (address: string) {
  return address.replace(/(0x\w{4})\w+(\w{4})/, "$1...$2");
}
export function thousandSeparator(num: number): string {
  let [integer, decimal] = num.toString().split(".");
  integer = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return decimal ? integer + "." + decimal : integer;
}
export function formatUnitsDecimal(
  bigNumber: BigNumber,
  decimal: number
): number {
  const a = parseFloat(
    ethers.utils.formatUnits(ethers.BigNumber.from(bigNumber), decimal)
  );
  // return a > 5007199254740991 ? 0 : a;
  return a;
}
export function parseUnitsDecimal(bigNumber: string, decimal: number): string {
  return ethers.utils.parseUnits(bigNumber, decimal).toString();
}
