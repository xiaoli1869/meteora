"use client";

import type React from "react";
import { Collapse, Spin } from "antd";
import { ExpandedPanel } from "./components/expanded-panel";
import { DownOutlined } from "@ant-design/icons";
import CenterContent from "../../components/CenterContent";
import { TOKEN_ICON_JSON } from "../../hook/utils/pool";
import "./index.css";
import { MTA, MTA_MTB_Pool, MTB } from "../../hook/web3/libs/constants";
import { PoolItem } from "./type";
import { useStore } from "../../store";
import { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import {
  getPoolPosition,
  getTokenBalance,
} from "../../hook/web3/libs/conversion";
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
  const [poolList, setPoolList] = useState<PoolItem[]>([]);
  const { Store } = useStore();
  const [isInit, setIsInit] = useState(false);
  useEffect(() => {
    init();
  }, [Store.walletInfo.networkId]);
  const init = async () => {
    setIsInit(true);
    let poolData: PoolItem[] = [
      {
        id: "1",
        pairName: "MTA-MTB",
        position: "0",
        token0: {
          icon: TOKEN_ICON_JSON.MON,
          symbol: "MTA",
          balance: 0,
          token: MTA,
        },
        token1: {
          icon: TOKEN_ICON_JSON.MON,
          symbol: "MTB",
          balance: 0,
          token: MTB,
        },
        poolAddress: MTA_MTB_Pool,
        info: null,
        currentPrice: 0,
        binstep: 100,
        numBins: 10,
        positions: [],
      },
    ];
    if (Store.getIsSupportedChain()) {
      for (let i = 0; i < poolData.length; i++) {
        const position = await getPoolPosition({
          userAddress: Store.walletInfo.address,
          pool: poolData[i],
        });
        const { token0Balance, token1Balance, currentPrice, poolInfo } =
          await getTokenBalance({
            userAddress: Store.walletInfo.address,
            pool: poolData[i],
          });
        poolData[i].token0.balance = token0Balance;
        poolData[i].token1.balance = token1Balance;
        poolData[i].currentPrice = currentPrice;
        poolData[i].info = poolInfo;
        poolData[i].positions = position;
      }
    } else {
      poolData = [];
    }
    setIsInit(false);
    setPoolList(poolData);
  };
  return (
    <CenterContent>
      <div className=" text-white rounded-lg">
        {/* Header */}
        <div className="grid grid-cols-[1fr_1fr_40px] py-4 px-6 text-gray-400 border-b border-[#1e293b] bg-[#1e1f35]">
          <span className="text-sm font-medium">Pool</span>
          <span className="text-sm font-medium text-center">Your Position</span>
          <span></span> {/* Empty span for the chevron space */}
        </div>
        <Spin tip="" spinning={isInit}>
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
            items={poolList.map((item) => ({
              key: item.id,
              label: <CustomPanelHeader item={item} />,
              children: <ExpandedPanel pool={item} />,
              className: "border-0 overflow-hidden px-6 relative bg-[#18192c]",
            }))}
          />
        </Spin>
        {/* Custom Collapse */}
      </div>
    </CenterContent>
  );
};
export default observer(CryptoPool);
