// Common types for Pools components

import { Token } from "@uniswap/sdk-core";

export interface Position {
  id: string;
  priceRange: {
    min: string;
    max: string;
  };
  tokenPair: {
    base: string;
    quote: string;
  };
  fee: string;
  liquidity: string;
  rangePercentage: number;
  hasWarning?: boolean;
  balances?: {
    baseAmount: string;
    baseValue: string;
    quoteAmount: string;
    quoteValue: string;
  };
  unclaimedFees?: {
    baseAmount: string;
    baseValue: string;
    quoteAmount: string;
    quoteValue: string;
  };
  currentPrice?: string;
}

export interface PoolItem {
  id: string;
  pairName: string;
  position: string;
  poolAddress: string;
  token0: {
    icon: string;
    symbol: string;
    token: Token;
  };
  token1: {
    icon: string;
    symbol: string;
    token: Token;
  };
  binstep: number;
  positions?: {
    id: string;
    priceRange: {
      min: string;
      max: string;
    };
    tokenPair: {
      base: string;
      quote: string;
    };
    fee: string;
    liquidity: string;
    rangePercentage: number;
    hasWarning?: boolean;
    balances: {
      baseAmount: string;
      baseValue: string;
      quoteAmount: string;
      quoteValue: string;
    };
    unclaimedFees: {
      baseAmount: string;
      baseValue: string;
      quoteAmount: string;
      quoteValue: string;
    };
    currentPrice: string;
  }[];
}

export interface ExpandedPanelProps {
  pool: PoolItem;
}

export interface YourPositionsTabProps {
  pairName: string;
  positions?: Position[];
  onOpenAddPosition: () => void;
}

export interface AddPositionTabProps {
  pool: PoolItem;
}

export interface PositionDetailsProps {
  position: Position;
}
