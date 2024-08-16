import {
  NONFUNGIBLE_POSITION_MANAGER_CONTRACT_ADDRESS,
  TOKEN_A,
  TOKEN_B,
  TokenA_TokenB_Pool,
  USDC_TOKEN,
  USDS_TOKEN,
  USDT_TOKEN,
} from "../web3/libs/constants";

export const LendingList = [
  {
    title: "TokenA/TokenB",
    tokenId: 1,
    icon1:
      "https://abm-app-image.s3.ap-northeast-1.amazonaws.com/coins/USD.png",
    icon2:
      "https://abm-app-image.s3.ap-northeast-1.amazonaws.com/coins/USDT.png",
    address: TokenA_TokenB_Pool,
    token0: TOKEN_A.address,
    token1: TOKEN_B.address,
    myPositions: 0,
    pledge: 0,
    LPIncome: 0,
    maxLending: 0,
    lendingRate: 0,
    nowLending: 0,
    fee: 0.003,
    nft: [NONFUNGIBLE_POSITION_MANAGER_CONTRACT_ADDRESS],
    isLP: false,
  },
];
export const TokenList = [
  {
    title: "USDS",
    tokenId: 1,
    icon: "https://abm-app-image.s3.ap-northeast-1.amazonaws.com/coins/ETH.png",
    address: USDS_TOKEN.address,
    decimal: USDS_TOKEN.decimals,
  },
  {
    title: "USDT",
    tokenId: 2,
    icon: "https://abm-app-image.s3.ap-northeast-1.amazonaws.com/coins/USDT.png",
    address: USDT_TOKEN.address,
    decimal: USDT_TOKEN.decimals,
  },
  {
    title: "USDC",
    tokenId: 3,
    icon: "https://abm-app-image.s3.ap-northeast-1.amazonaws.com/coins/USD.png",
    address: USDC_TOKEN.address,
    decimal: USDC_TOKEN.decimals,
  },
];
