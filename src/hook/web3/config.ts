import { Token } from "@uniswap/sdk-core";
import { FeeAmount } from "@uniswap/v3-sdk";
import {
  MTA,
  MTA_MTB_Pool,
  MTB,
  TOKEN_A,
  TOKEN_B,
  TokenA_TokenB_Pool,
} from "./libs/constants";

// Sets if the example should run locally or on chain
export enum Environment {
  LOCAL,
  WALLET_EXTENSION,
  MAINNET,
}

// Inputs that configure this example to run
export interface ExampleConfig {
  env: Environment;
  rpc: {
    local: string;
    mainnet: string;
  };
  tokens: {
    token0: Token;
    token0Amount: number;
    token1: Token;
    token1Amount: number;
    poolFee: FeeAmount;
    pool: string;
  };
}

// Example Configuration

export const CurrentConfig: ExampleConfig = {
  env: Environment.LOCAL,
  rpc: {
    // https://ethereum-sepolia-rpc.publicnode.com
    // https://sepolia.infura.io/v3/d87f75c34cdd403eb3af8c13fa7ee5c0
    local: "https://ethereum-sepolia-rpc.publicnode.com",
    mainnet: "https://ethereum-sepolia-rpc.publicnode.com",
  },
  tokens: {
    token0: MTA,
    token0Amount: 50,
    token1: MTB,
    token1Amount: 50,
    poolFee: FeeAmount.LOW,
    pool: MTA_MTB_Pool,
  },
};
