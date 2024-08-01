export default function (address: string) {
  return address.replace(/(0x\w{4})\w+(\w{4})/, "$1...$2");
}
export function thousandSeparator(num: number): string {
  let [integer, decimal] = num.toString().split(".");
  integer = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return decimal ? integer + "." + decimal : integer;
}
