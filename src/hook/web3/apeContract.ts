import { getProvider } from "./web3Service";
import LPLendAbi from "./abi/LPLend.json";
import Periphery from "./abi/Periphery.json";
import Swap from "./abi/Swap.json";
import Stake from "./abi/Stake.json";
import { ethers } from "ethers";
export function LPLendContract() {
  const contract = new ethers.Contract(
    "0x56A7380622a7ee604CE232Cc32D8870a2Fd4Ad13",
    LPLendAbi.abi,
    getProvider()
  );
  return contract;
}
export function StakeContract() {
  const contract = new ethers.Contract(
    "0x35d11176d445614e5A6B268D2da6463B80F2dFbA",
    Stake.abi,
    getProvider()
  );
  return contract;
}
export function PeripheryContract() {
  const contract = new ethers.Contract(
    "0x6BF16f1755DeA0f74af7337316CEF5b95A47695A",
    Periphery.abi,
    getProvider()
  );
  return contract;
}
export function SwapContract() {
  const contract = new ethers.Contract(
    "0x66e3dE7C6E77467508CDFFcEA0E84f7302f13B61",
    Swap.abi,
    getProvider()
  );
  return contract;
}
