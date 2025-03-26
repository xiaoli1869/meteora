import React from "react";
import {
  SearchOutlined,
  PlusOutlined,
  WarningOutlined,
  ExportOutlined,
  DownOutlined,
} from "@ant-design/icons";
import { Collapse } from "antd";
import { PositionDetails } from "./position-details";
import { YourPositionsTabProps, Position } from "../type";

// Using types from type.ts

export const YourPositionsTab: React.FC<YourPositionsTabProps> = ({
  pairName,
  positions = [],
  onOpenAddPosition,
}) => {
  const hasPositions = positions.length > 0;

  // Styles moved to index.css

  if (!hasPositions) {
    return (
      <div className="py-16">
        <div className="flex flex-col items-center justify-center">
          <div className="bg-[#1a2235] p-3 rounded-full mb-6 flex items-center justify-center">
            <SearchOutlined
              style={{ fontSize: "24px" }}
              className="text-gray-400"
            />
          </div>
          <h3 className="text-white text-xl font-medium mb-2">
            No Positions Found
          </h3>
          <p className="text-gray-400 mb-6 text-center">
            You don't have any liquidities in this pool. Add liquidity to earn
            pool rewards.
          </p>
          <button
            onClick={onOpenAddPosition}
            className="bg-indigo-700 hover:bg-indigo-600 text-white px-4 py-2 rounded-md flex items-center"
          >
            <PlusOutlined className="mr-2" />
            Add Liquidity
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-4">
      {/* Styles moved to index.css */}

      {/* Table Header */}
      <div className="grid grid-cols-4 gap-4 text-gray-400 text-sm mb-2 px-4">
        <div>Price Range</div>
        <div className="text-center">24hr Fee / TVL</div>
        <div className="text-center">Your Liquidity</div>
        <div className="text-center">Range</div>
      </div>

      {/* Positions List */}
      <Collapse
        accordion
        bordered={false}
        expandIcon={({ isActive }) => (
          <DownOutlined
            className={`text-gray-400 transition-transform duration-300 ${
              isActive ? "rotate-180" : ""
            }`}
            style={{ color: "#fff" }}
          />
        )}
        className="position-collapse bg-transparent"
        items={positions.map((position) => ({
          key: position.id,
          label: (
            <div className="grid grid-cols-4 gap-4 w-full py-4 px-4 bg-[#1f1e33]">
              <div>
                <div className="text-white font-medium">
                  {position.priceRange.min} - {position.priceRange.max}
                </div>
                <div className="text-gray-400 text-xs mt-1">
                  {position.tokenPair.base} per {position.tokenPair.quote}
                </div>
              </div>
              <div className="flex items-center justify-center">
                <span className="text-white">{position.fee}</span>
              </div>
              <div className="flex items-center justify-center">
                <span className="text-white">{position.liquidity}</span>
              </div>
              <div className="flex items-center justify-center">
                <div className="w-32 bg-gray-700 h-2 rounded-full mr-2">
                  <div
                    className="bg-purple-500 h-2 rounded-full"
                    style={{ width: `${position.rangePercentage}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ),
          children: <PositionDetails position={position} />,
          className: "border-0 overflow-hidden",
        }))}
      />
    </div>
  );
};
