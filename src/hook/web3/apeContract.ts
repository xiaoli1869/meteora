import { getProvider } from "./web3Service";
import LPLendAbi from "./abi/LPLend.json";
import Periphery from "./abi/Periphery.json";
import Swap from "./abi/Swap.json";
import Stake from "./abi/Stake.json";
import Pools from "./abi/BatchLP.json";
import { ethers } from "ethers";
import {
  LPLContractAddress,
  PeripheryContractAddress,
  StakeToSCContractAddress,
  StakeToSTContractAddress,
  SwapContractAddress,
  PoolsContractAddress,
} from "./libs/constants";
export function LPLendContract() {
  const contract = new ethers.Contract(
    LPLContractAddress,
    LPLendAbi.abi,
    getProvider().getSigner()
  );
  return contract;
}
export function StakeToSTContract() {
  const contract = new ethers.Contract(
    StakeToSTContractAddress,
    Stake.abi,
    getProvider().getSigner()
  );
  return contract;
}
export function StakeToSCContract() {
  const contract = new ethers.Contract(
    StakeToSCContractAddress,
    Stake.abi,
    getProvider().getSigner()
  );
  return contract;
}
export function PeripheryContract() {
  const contract = new ethers.Contract(
    PeripheryContractAddress,
    Periphery.abi,
    getProvider().getSigner()
  );
  return contract;
}
export function SwapContract() {
  const contract = new ethers.Contract(
    SwapContractAddress,
    Swap.abi,
    getProvider().getSigner()
  );
  return contract;
}
export function PoolsContract() {
  const contract = new ethers.Contract(
    PoolsContractAddress,
    Pools.abi,
    getProvider().getSigner()
  );
  return contract;
}
