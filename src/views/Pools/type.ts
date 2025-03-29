// Common types for Pools components

import { Token } from "@uniswap/sdk-core";
import { PoolInfo } from "../../hook/web3/libs/pool";

export interface Position {
  id: string;
  priceRange: {
    min: string;
    max: string;
  };
  tokenPair?: {
    base: string;
    quote: string;
  };
  fee: string | number;
  totalValue?: number;
  totalToken0Value?: number;
  totalToken1Value?: number;
  totalToken0Amount?: number;
  totalToken1Amount?: number;
  totalToken0ClaimAmount?: number;
  totalToken0ClaimValue?: number;
  totalToken1ClaimAmount?: number;
  totalToken1ClaimValue?: number;
  liquidity?: string;
  currentPrice?: number;
  lpList?: Position[];
  minPrice?: number;
  token0?: {
    icon: string;
    symbol: string;
    token: Token;
    amount: string | number;
    value: string | number;
    claimFeeAmount: string | number;
    claimFeeValue: string | number;
  };
  token1?: {
    icon: string;
    symbol: string;
    token: Token;
    amount: string | number;
    value: string | number;
    claimFeeAmount: string | number;
    claimFeeValue: string | number;
  };
}

export interface PoolItem {
  id: string;
  pairName: string;
  position: string;
  poolAddress: string;
  numBins: number;
  token0: {
    icon: string;
    symbol: string;
    token: Token;
    balance: number;
  };
  token1: {
    icon: string;
    symbol: string;
    token: Token;
    balance: number;
  };
  binstep: number;
  positions?: Position[];
  info: null | PoolInfo;
  currentPrice: number;
}

export interface ExpandedPanelProps {
  pool: PoolItem;
}

export interface YourPositionsTabProps {
  pool: PoolItem;
  onOpenAddPosition: () => void;
}

export interface AddPositionTabProps {
  pool: PoolItem;
}

export interface PositionDetailsProps {
  position: Position;
  pool: PoolItem;
}
