import React, { useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { YourPositionsTab } from "./your-positions-tab";
import AddPositionTab from "./add-position-tab";
import { ExpandedPanelProps } from "../type";

// Using types from type.ts

export const ExpandedPanel: React.FC<ExpandedPanelProps> = ({ pool }) => {
  const { pairName, token0, token1, positions } = pool;
  const [activeTab, setActiveTab] = useState<"positions" | "add">("positions");

  return (
    <div className="bg-[#0f1525] rounded-md p-6 mt-2 mb-4">
      <div className="flex items-center space-x-6">
        <div
          className="relative cursor-pointer"
          onClick={() => setActiveTab("positions")}
        >
          <span
            className={`font-medium ${
              activeTab === "positions"
                ? "text-white"
                : "text-gray-400 hover:text-gray-300"
            }`}
          >
            Your Positions
          </span>
          {activeTab === "positions" && (
            <div className="absolute h-0.5 w-full bg-red-500 bottom-[-8px]"></div>
          )}
        </div>
        <div
          className="relative cursor-pointer flex items-center"
          onClick={() => setActiveTab("add")}
        >
          <PlusOutlined style={{ fontSize: "16px" }} className="mr-1" />
          <span
            className={`${
              activeTab === "add"
                ? "text-white"
                : "text-gray-400 hover:text-gray-300"
            }`}
          >
            Add Position
          </span>
          {activeTab === "add" && (
            <div className="absolute h-0.5 w-full bg-red-500 bottom-[-8px]"></div>
          )}
        </div>
      </div>

      {activeTab === "positions" ? (
        <YourPositionsTab
          pairName={pairName}
          positions={positions}
          onOpenAddPosition={() => setActiveTab("add")}
        />
      ) : (
        <AddPositionTab pool={pool} />
      )}
    </div>
  );
};
