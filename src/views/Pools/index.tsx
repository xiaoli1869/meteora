"use client";

import type React from "react";
import { Collapse } from "antd";
import { ExpandedPanel } from "./components/expanded-panel";
import { DownOutlined } from "@ant-design/icons";
import CenterContent from "../../components/CenterContent";
import { TOKEN_ICON_JSON } from "../../hook/utils/pool";
import "./index.css";
import { MTA, MTA_MTB_Pool, MTB } from "../../hook/web3/libs/constants";
import { PoolItem } from "./type";
import { useStore } from "../../store";
import { useMemo } from "react";
import { observer } from "mobx-react-lite";
const CustomPanelHeader: React.FC<{ item: PoolItem }> = ({ item }) => (
  <div className="grid grid-cols-[1fr_1fr_40px] w-full py-5">
    <div className="flex items-center">
      <div className="flex items-center">
        <img
          src={item.token0.icon}
          alt="First coin"
          className="w-7 h-7 rounded-full"
        />
        <img
          src={item.token1.icon}
          alt="Second coin"
          className="w-7 h-7 rounded-full ml-1"
        />
      </div>
      <span className="ml-4 text-white font-medium tracking-wide">
        {item.pairName}
      </span>
    </div>
    <div className="flex justify-center">
      <span className="text-white font-medium">{item.position}</span>
    </div>
    <div></div> {/* Empty div for the chevron space */}
  </div>
);

const CryptoPool = () => {
  // Override Ant Design's default styles
  const { Store } = useStore();
  const poolData: PoolItem[] = useMemo(() => {
    if (Store.getIsSupportedChain()) {
      return [
        {
          id: "1",
          pairName: "MTA-MTB",
          position: "0",
          token0: {
            icon: TOKEN_ICON_JSON.MON,
            symbol: "MTA",
            token: MTA,
          },
          token1: {
            icon: TOKEN_ICON_JSON.MON,
            symbol: "MTB",
            token: MTB,
          },
          poolAddress: MTA_MTB_Pool,
          binstep: 10,
          positions: [
            // {
            //   id: "pos-1",
            //   priceRange: {
            //     min: "152.52",
            //     max: "262.20",
            //   },
            //   tokenPair: {
            //     base: "TRUMP",
            //     quote: "USDC",
            //   },
            //   fee: "0.11%",
            //   liquidity: "$632.47",
            //   rangePercentage: 75,
            //   hasWarning: true,
            //   balances: {
            //     baseAmount: "4.7108",
            //     baseValue: "$632.47",
            //     quoteAmount: "0",
            //     quoteValue: "",
            //   },
            //   unclaimedFees: {
            //     baseAmount: "0.070158",
            //     baseValue: "$9.42",
            //     quoteAmount: "12.01",
            //     quoteValue: "$12.01",
            //   },
            //   currentPrice: "134.26",
            // },
            // {
            //   id: "pos-2",
            //   priceRange: {
            //     min: "152.52",
            //     max: "262.20",
            //   },
            //   tokenPair: {
            //     base: "TRUMP",
            //     quote: "USDC",
            //   },
            //   fee: "0.11%",
            //   liquidity: "$632.47",
            //   rangePercentage: 75,
            //   hasWarning: true,
            //   balances: {
            //     baseAmount: "4.7108",
            //     baseValue: "$632.47",
            //     quoteAmount: "0",
            //     quoteValue: "",
            //   },
            //   unclaimedFees: {
            //     baseAmount: "0.070158",
            //     baseValue: "$9.42",
            //     quoteAmount: "12.01",
            //     quoteValue: "$12.01",
            //   },
            //   currentPrice: "134.26",
            // },
          ],
        },
      ];
    } else {
      return [];
    }
  }, [Store.getIsSupportedChain()]);
  return (
    <CenterContent>
      <div className=" text-white rounded-lg">
        {/* Header */}
        <div className="grid grid-cols-[1fr_1fr_40px] py-4 px-6 text-gray-400 border-b border-[#1e293b] bg-[#1e1f35]">
          <span className="text-sm font-medium">Pool</span>
          <span className="text-sm font-medium text-center">Your Position</span>
          <span></span> {/* Empty span for the chevron space */}
        </div>

        {/* Custom Collapse */}
        <Collapse
          bordered={false}
          accordion
          expandIcon={({ isActive }) => (
            <span
              className={`transition-transform duration-300 ${
                isActive ? "rotate-180" : ""
              } inline-block`}
            >
              <DownOutlined style={{ color: "#fff" }} />
            </span>
          )}
          items={poolData.map((item) => ({
            key: item.id,
            label: <CustomPanelHeader item={item} />,
            children: <ExpandedPanel pool={item} />,
            className: "border-0 overflow-hidden px-6 relative bg-[#18192c]",
          }))}
        />
      </div>
    </CenterContent>
  );
};
export default observer(CryptoPool);
