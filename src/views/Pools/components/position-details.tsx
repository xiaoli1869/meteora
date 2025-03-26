import React, { useState } from "react";
import { DownOutlined } from "@ant-design/icons";
import { PositionDetailsProps } from "../type";

// Using types from type.ts

export const PositionDetails: React.FC<PositionDetailsProps> = ({
  position,
}) => {
  const [withdrawPercentage, setWithdrawPercentage] = useState(100);
  const [showTokenSelector, setShowTokenSelector] = useState(false);

  const { base, quote } = position.tokenPair;

  // Default values for balances and unclaimedFees if they're undefined
  const balances = position.balances || {
    baseAmount: "0",
    baseValue: "$0",
    quoteAmount: "0",
    quoteValue: "$0",
  };

  const unclaimedFees = position.unclaimedFees || {
    baseAmount: "0",
    baseValue: "$0",
    quoteAmount: "0",
    quoteValue: "$0",
  };

  return (
    <div className="py-4 px-4">
      {/* Position Liquidity Section */}
      <h3 className="text-white text-lg font-medium mb-6">
        Position Liquidity
      </h3>

      <div className="grid grid-cols-2 gap-8 mb-8">
        {/* Current Balance */}
        <div>
          <div className="text-gray-400 mb-3">Current Balance</div>
          <div className="space-y-2">
            <div className="flex items-center">
              <div className="w-5 h-5 rounded-full bg-indigo-500 mr-2 flex items-center justify-center">
                <span className="text-xs text-white">≡</span>
              </div>
              <span className="text-white font-medium">
                {balances.baseAmount} {base}
              </span>
              <span className="text-gray-400 ml-2">({balances.baseValue})</span>
            </div>
            <div className="flex items-center">
              <div className="w-5 h-5 rounded-full bg-blue-500 mr-2 flex items-center justify-center">
                <span className="text-xs text-white">$</span>
              </div>
              <span className="text-white font-medium">
                {balances.quoteAmount} {quote}
              </span>
              <span className="text-gray-400 ml-2">
                ({balances.quoteValue})
              </span>
            </div>
          </div>
        </div>

        {/* Unclaimed Swap Fee */}
        <div>
          <div className="text-gray-400 mb-3">Your Unclaimed Swap Fee</div>
          <div className="space-y-2">
            <div className="flex items-center">
              <div className="w-5 h-5 rounded-full bg-indigo-500 mr-2 flex items-center justify-center">
                <span className="text-xs text-white">≡</span>
              </div>
              <span className="text-white font-medium">
                {unclaimedFees.baseAmount} {base}
              </span>
              <span className="text-gray-400 ml-2">
                ({unclaimedFees.baseValue})
              </span>
            </div>
            <div className="flex items-center">
              <div className="w-5 h-5 rounded-full bg-blue-500 mr-2 flex items-center justify-center">
                <span className="text-xs text-white">$</span>
              </div>
              <span className="text-white font-medium">
                {unclaimedFees.quoteAmount} {quote}
              </span>
              <span className="text-gray-400 ml-2">
                ({unclaimedFees.quoteValue})
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Withdraw Section */}
      <div className="mb-6">
        {/* Price Chart */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <span className="text-gray-400 text-sm">Current Price</span>
            </div>
            <span className="text-white text-sm">
              {position.currentPrice} {quote} per {base}
            </span>
          </div>

          <div className="bg-[#1a2235] rounded-md p-4">
            <div className="h-32 w-full flex items-end justify-between">
              {Array.from({ length: 40 }).map((_, i) => {
                const height = Math.max(20, Math.floor(Math.random() * 80));
                return (
                  <div
                    key={i}
                    className="w-2 bg-indigo-600"
                    style={{ height: `${height}px` }}
                  ></div>
                );
              })}
            </div>
            <div className="flex justify-between text-gray-400 text-xs mt-2">
              <span>137.45</span>
              <span>150.76</span>
              <span>170.17</span>
              <span>177.43</span>
              <span>184.84</span>
              <span>192.40</span>
              <span>200.12</span>
              <span>208.01</span>
              <span>216.08</span>
              <span>224.34</span>
              <span>232.80</span>
              <span>241.47</span>
              <span>250.37</span>
            </div>
          </div>

          <div className="flex items-center justify-center my-4">
            <div className="h-0.5 bg-gray-700 w-full relative">
              <div className="absolute -top-1.5 left-0 w-3 h-3 rounded-full bg-gray-400"></div>
              <div className="absolute -top-1.5 right-0 w-3 h-3 rounded-full bg-gray-400"></div>
            </div>
          </div>

          <div className="text-center text-gray-400 text-sm mb-4">
            You will receive 100% from bin {position.priceRange.min} to bin{" "}
            {position.priceRange.max}
          </div>

          <div className="bg-[#1a2235] rounded-md p-3 mb-4 flex items-center">
            <div className="flex items-center">
              <div className="w-5 h-5 rounded-full bg-indigo-500 mr-2 flex items-center justify-center">
                <span className="text-xs text-white">≡</span>
              </div>
              <span className="text-white font-medium">4.71075127 {base}</span>
            </div>
            <span className="mx-2 text-gray-400">+</span>
            <div className="flex items-center">
              <div className="w-5 h-5 rounded-full bg-blue-500 mr-2 flex items-center justify-center">
                <span className="text-xs text-white">$</span>
              </div>
              <span className="text-white font-medium">0.000000 {quote}</span>
            </div>
          </div>

          <button className="w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-md font-medium mb-3">
            Close LP
          </button>

          <button className="w-full bg-indigo-800 hover:bg-indigo-700 text-white py-4 rounded-md font-medium">
            Claim Fee
          </button>

          <p className="text-gray-500 text-xs mt-2">
            * Closing the position withdraws all of the provided liquidity and
            claims all unclaimed fees
          </p>
        </div>
      </div>
    </div>
  );
};
