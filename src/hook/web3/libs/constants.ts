// This file stores web3 related constants such as addresses, token definitions, ETH currency references and ABI's

import { Token } from "@uniswap/sdk-core";

// Addresses

export const NONFUNGIBLE_POSITION_MANAGER_CONTRACT_ADDRESS =
  "0x3dCc735C74F10FE2B9db2BB55C40fbBbf24490f7";
export const LPLContractAddress = "0x56A7380622a7ee604CE232Cc32D8870a2Fd4Ad13";
export const StakeToSTContractAddress =
  "0xF9D4598b7b455C352E6729848C24D4C2120E3835";
export const StakeToSCContractAddress =
  "0x423562D85E0B713288E0B48559F3775A50913031";
export const PeripheryContractAddress =
  "0x6BF16f1755DeA0f74af7337316CEF5b95A47695A";
export const SwapContractAddress = "0x66e3dE7C6E77467508CDFFcEA0E84f7302f13B61";
export const PoolsContractAddress =
  "0xa2Dd8Cb22e59Ff7f2d70DB9FCa32e51785dF7f5c";

// Currencies and Tokens
const SEPOLIA_CHAIN_ID = 11155111;
const MONAD_CHAIN_ID = 10143;
export const MTA = new Token(
  MONAD_CHAIN_ID,
  "0x52fde9Ae411FF141EE17715E9BCb82Dde4b7ec63",
  18,
  "MTA",
  "mta"
);

export const MTB = new Token(
  MONAD_CHAIN_ID,
  "0x7E9B9f276aA68cC547Aa0Adc461e2F8A7640959b",
  18,
  "MTB",
  "mtb"
);
export const USDS_TOKEN = new Token(
  SEPOLIA_CHAIN_ID,
  "0xFAC6EfeFb35a2445C8de7Bf0A1B55AC794AaeC73",
  18,
  "USDS",
  "USD Stable Coin"
);
export const TOKEN_A = new Token(
  SEPOLIA_CHAIN_ID,
  "0x1cd6311F14272CC6ed53D17421F452A8843b5714",
  18,
  "TOKEN_B",
  "Token B"
);

export const TOKEN_B = new Token(
  SEPOLIA_CHAIN_ID,
  "0x3d3D7195EA6C1bCe32d264F6A8492D8a9a0048a3",
  18,
  "TOKEN_A",
  "Token A"
);

export const USDT_TOKEN = new Token(
  SEPOLIA_CHAIN_ID,
  "0x918ecAe719295Ac7DB976B8d2C0f41A8CDBfC50E",
  18,
  "USDT",
  "Tether USD"
);

export const USDC_TOKEN = new Token(
  SEPOLIA_CHAIN_ID,
  "0x0C14Df3D9D807b66d71cA731Fb8B02b7eCB64038",
  18,
  "USDC",
  "USD Coin"
);
export const TokenA_TokenB_Pool = "0x99aCda102AF2A364FedF35199ebC64781af30BA9";
export const MTA_MTB_Pool = "0xC797b1A48B5d0f96c1D47E95a95530484733Be91";
export const USDS_USDT_Pool = "0x5d671210bB837CB006867e0499c8f8D0d3b72983";
// Transactions
export const MAX_FEE_PER_GAS = "100000000000";
export const MAX_PRIORITY_FEE_PER_GAS = "100000000000";
export const TOKEN_AMOUNT_TO_APPROVE_FOR_TRANSFER = 1000000000000;

// ABI's

export const ERC20_ABI = [
  // Read-Only Functions
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",

  // Authenticated Functions
  "function transfer(address to, uint amount) returns (bool)",
  "function approve(address _spender, uint256 _value) returns (bool)",

  // Events
  "event Transfer(address indexed from, address indexed to, uint amount)",
];

export const NONFUNGIBLE_POSITION_MANAGER_ABI = [
  // Read-Only Functions
  "function balanceOf(address _owner) view returns (uint256)",
  "function tokenOfOwnerByIndex(address _owner, uint256 _index) view returns (uint256)",
  "function tokenURI(uint256 tokenId) view returns (string memory)",
  "function positions(uint256 tokenId) external view returns (uint96 nonce, address operator, address token0, address token1, uint24 fee, int24 tickLower, int24 tickUpper, uint128 liquidity, uint256 feeGrowthInside0LastX128, uint256 feeGrowthInside1LastX128, uint128 tokensOwed0, uint128 tokensOwed1)",
];
