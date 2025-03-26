import {
  NONFUNGIBLE_POSITION_MANAGER_CONTRACT_ADDRESS,
  TOKEN_A,
  TOKEN_B,
  TokenA_TokenB_Pool,
  USDC_TOKEN,
  USDS_TOKEN,
  USDT_TOKEN,
} from "../web3/libs/constants";
import USDSimg from "@/assets/img/USDS.png";
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
    icon: USDSimg,
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
export const TOKEN_ICON_JSON = {
  TRUMP:
    "https://www.okx.com/cdn/announce/20250118/17371841165893038a940-cc19-48cf-922d-e0424015a7e1.png",
  USDC: "https://www.okx.com/cdn/announce/20230419/1681875565198f4ad025e-6dde-46a1-9c2f-f09818ed5a08.png",
  SOL: "https://www.okx.com/cdn/announce/20230419/1681875530349f92aa4a2-db30-4964-999c-ef7eb6f3914a.png",
  YZY: "https://static.okx.com/cdn/web3/currency/token/small/501-2CtzutFRMc4rpJAcuuJCbZHfQxmLRYXuHuE4RGZbMSEv-98?v=1742603365894",
  WBTC: "https://www.okx.com/cdn/announce/20201210/160760111554528a0ddd5-de7f-4a9f-bb35-c81a2eec0b6c.png",
  JUP: "https://www.okx.com/cdn/announce/20240131/17066711701873f75f054-8364-433d-8e9b-3cd6dc089320.png",
  FARTCOIN:
    "https://www.okx.com/cdn/announce/20241108/173104759280253f770cb-0718-47b7-95fe-5d945a739248.png",
  MON: "https://img.cryptorank.io/coins/monad1710498467135.png",
};
