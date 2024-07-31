export default function (address: string) {
  return address.replace(/(0x\w{4})\w+(\w{4})/, "$1...$2");
}
