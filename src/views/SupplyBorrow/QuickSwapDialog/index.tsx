import {
  DownOutlined,
  InfoCircleOutlined,
  UpOutlined,
} from "@ant-design/icons";
import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next";
import swapIcon from "@/assets/img/swap/swap.png";
import "./index.css";
import { Popover, Tooltip } from "antd";
import { useState } from "react";
import MyButton from "@/components/MyButton";
function QuickSwapDialog() {
  const { t } = useTranslation("translations");
  const [payShow, setPayShow] = useState(false);
  const [receiveShow, setReceiveShow] = useState(false);
  const [nowInput, setNowInput] = useState("");
  return (
    <>
      <div className=" relative">
        <div
          className="w-full p-4 rounded-lg box-border"
          onClick={() => setNowInput("pay")}
          style={{
            background: "#0E0E0F",
            border:
              nowInput === "pay" ? "1px solid #FCEF62" : "1px solid #0E0E0F",
          }}
        >
          <div className="flex items-center justify-between">
            <span>{t("supplyBorrowData.quickSwap.youPay")}</span>
            <div className="flex items-center">
              {t("supplyBorrowData.quickSwap.balance")}:{3.4567}
              <span
                className="ml-2 pl-2 cursor-pointer text-blue-500"
                style={{ borderLeft: "1px solid rgba(255, 255, 255, 0.12)" }}
              >
                {t("supplyBorrowData.quickSwap.max")}
              </span>
            </div>
          </div>
          <div className="w-full mt-3 flex items-center justify-between">
            <input
              className="text-white text-24 font-bold bg-none"
              type="text"
              value={0.0}
            />
            <Popover
              trigger="click"
              placement="bottomRight"
              arrow={false}
              open={payShow}
              onOpenChange={(show) => setPayShow(show)}
              content={
                <div
                  className="w-lxl-200 box-border p-2 rounded-lg"
                  style={{
                    background: "#151619",
                    border: "1px solid rgba(255, 255, 255, 0.32)",
                  }}
                >
                  <div
                    className="flex items-center cursor-pointer rounded text-white font-bold"
                    style={{
                      padding: "10px 8px",
                      background: "#202126",
                      border: "1px solid #fff",
                    }}
                  >
                    <div className="w-5 h-5 rounded-full mr-1" />
                    USDT
                  </div>
                </div>
              }
            >
              <div
                className="flex items-center rounded-xl font-bold gap-x-1 text-white"
                style={{ padding: "10px 8px", background: "#202126" }}
              >
                <div className="w-5 h-5 rounded-full bg-yellow-500" />
                USDT
                {payShow ? <UpOutlined /> : <DownOutlined />}
              </div>
            </Popover>
          </div>
        </div>
        <img
          className="w-9 h-9 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          src={swapIcon}
          alt=""
        />
        <div
          className="w-full p-4 mt-3 rounded-lg box-border"
          onClick={() => setNowInput("receive")}
          style={{
            background: "#0E0E0F",
            border:
              nowInput === "receive"
                ? "1px solid #FCEF62"
                : "1px solid #0E0E0F",
          }}
        >
          <div className="flex items-center justify-between">
            <span>{t("supplyBorrowData.quickSwap.receive")}</span>
            <div className="flex items-center">
              {t("supplyBorrowData.quickSwap.balance")}:{3.4567}
              <span
                className="ml-2 pl-2 cursor-pointer text-blue-500"
                style={{ borderLeft: "1px solid rgba(255, 255, 255, 0.12)" }}
              >
                {t("supplyBorrowData.quickSwap.max")}
              </span>
            </div>
          </div>
          <div className="w-full mt-3 flex items-center justify-between">
            <input
              className="text-white text-24 font-bold bg-none"
              type="text"
              value={0.0}
            />
            <Popover
              trigger="click"
              placement="bottomRight"
              arrow={false}
              open={receiveShow}
              onOpenChange={(show) => setReceiveShow(show)}
              content={
                <div
                  className="w-lxl-200 box-border p-2 rounded-lg"
                  style={{
                    background: "#151619",
                    border: "1px solid rgba(255, 255, 255, 0.32)",
                  }}
                >
                  <div
                    className="flex items-center cursor-pointer rounded text-white font-bold"
                    style={{
                      padding: "10px 8px",
                      background: "#202126",
                      border: "1px solid #fff",
                    }}
                  >
                    <div className="w-5 h-5 rounded-full mr-1" />
                    USDT
                  </div>
                </div>
              }
            >
              <div
                className="flex items-center rounded-xl font-bold gap-x-1 text-white"
                style={{ padding: "10px 8px", background: "#202126" }}
              >
                <div className="w-5 h-5 rounded-full bg-yellow-500" />
                USDT
                {receiveShow ? <UpOutlined /> : <DownOutlined />}
              </div>
            </Popover>
          </div>
        </div>
      </div>
      <div className="mt-3 flex flex-col gap-y-3">
        <div className="flex justify-between">
          <span className="opacity-50">
            {t("supplyBorrowData.quickSwap.referenceRate")}
          </span>
          <span>1 USDC ≈ 1USDT</span>
        </div>
        <div className="flex justify-between">
          <span className="opacity-50">
            {t("supplyBorrowData.quickSwap.mobileRate")}
          </span>
          <span>0.05%</span>
        </div>
        <div className="flex justify-between">
          <span className="opacity-50">
            {t("supplyBorrowData.quickSwap.exchangeRate")}
          </span>
          <span>0.05%</span>
        </div>
        <div className="flex justify-between">
          <div className="opacity-50 flex items-center">
            {t("supplyBorrowData.quickSwap.slippage")}
            <Tooltip
              title={t("supplyBorrowData.quickSwap.tips")}
              color="#30333D"
            >
              <InfoCircleOutlined className=" ml-1 cursor-pointer" />
            </Tooltip>
          </div>
          <div className=" flex items-center">
            0.5%
            <DownOutlined className=" ml-1 cursor-pointer" />
          </div>
        </div>
      </div>
      <MyButton disabled className="w-full mt-10 text-18 h-14 box-border">
        {t("supplyBorrowData.quickSwap.swap")}
      </MyButton>
    </>
  );
}
export default observer(QuickSwapDialog);
