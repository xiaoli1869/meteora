import {
  DownOutlined,
  InfoCircleOutlined,
  UpOutlined,
} from "@ant-design/icons";
import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next";
import swapIcon from "@/assets/img/swap/swap.png";
import "./index.css";
import { message, Popover, Tooltip } from "antd";
import { useEffect, useState } from "react";
import MyButton from "@/components/MyButton";
import { TokenList } from "../../../hook/utils/pool";
import { CurrentConfig } from "../../../hook/web3/config";
import { useStore } from "../../../store";
import { getProvider } from "../../../hook/web3/web3Service";
import ERC721ABI from "@/hook/web3/abi/ERC721.json";
import { ethers } from "ethers";
import {
  ERC20_ABI,
  SwapContractAddress,
  USDS_TOKEN,
  USDT_TOKEN,
} from "../../../hook/web3/libs/constants";
import {
  formatUnitsDecimal,
  parseUnitsDecimal,
  thousandSeparator,
} from "../../../hook/utils/addressFormat";
import USDSimg from "@/assets/img/USDS.png";
import { SwapContract } from "../../../hook/web3/apeContract";
function QuickSwapDialog({ close }: { close: () => void }) {
  const { t } = useTranslation("translations");
  const { Store } = useStore();
  const [payShow, setPayShow] = useState(false);
  const [receiveShow, setReceiveShow] = useState(false);
  const [slippageShow, setSlippageShow] = useState(false);
  const [nowInput, setNowInput] = useState("");
  const [custom, setCustom] = useState("0.5");
  const [outObj, setOutObj] = useState({
    token: "USDS",
    icon: USDSimg,
    balance: 0,
    inpVal: 0,
    address: USDS_TOKEN.address,
    decimal: USDS_TOKEN.decimals,
  });
  const [inObj, setInObj] = useState({
    token: "USDT",
    balance: 0,
    inpVal: 0,
    icon: "https://abm-app-image.s3.ap-northeast-1.amazonaws.com/coins/USDT.png",
    address: USDT_TOKEN.address,
    decimal: USDT_TOKEN.decimals,
  });
  const [swapToken, setSwapToken] = useState(
    TokenList.map((item) => {
      return { ...item, balance: 0 };
    })
  );
  const [buttonLoading, setButtonLoading] = useState(false);
  const changeToken = (type: string, item: any) => {
    if (type === "out") {
      setOutObj({
        token: item.title,
        icon: item.icon,
        balance: item.balance,
        inpVal: 0,
        address: item.address,
        decimal: item.decimal,
      });
      setPayShow(false);
    } else if (type === "in") {
      setInObj({
        token: item.title,
        icon: item.icon,
        balance: item.balance,
        inpVal: 0,
        address: item.address,
        decimal: item.decimal,
      });
      setReceiveShow(false);
    }
  };
  const resetOutAndIn = () => {
    const oldOutObj = outObj;
    const oldInObj = inObj;
    setInObj(oldOutObj);
    setOutObj(oldInObj);
  };
  const inpChange = (e: any, inpType: string) => {
    let val = 0;
    if (inpType === "out") {
      val =
        Number(e.target.value) > outObj.balance
          ? outObj.balance
          : Number(e.target.value);
    } else if (inpType === "in") {
      val =
        Number(e.target.value) > outObj.balance
          ? outObj.balance
          : Number(e.target.value);
    }
    setInObj((obj) => {
      return { ...obj, inpVal: val };
    });
    setOutObj((obj) => {
      return { ...obj, inpVal: val };
    });
  };
  const swapClick = async () => {
    setButtonLoading(true);
    if (nowInput === "pay") {
      try {
        const approveContract = new ethers.Contract(
          outObj.address,
          ERC20_ABI,
          getProvider().getSigner()
        );
        const approveTx = await approveContract.approve(
          SwapContractAddress,
          parseUnitsDecimal(String(outObj.inpVal), 18)
        );
        await approveTx.wait();
        const swap = await SwapContract().swapExactInputSingle(
          outObj.address,
          inObj.address,
          parseUnitsDecimal(String(outObj.inpVal), outObj.decimal),
          3000,
          parseUnitsDecimal(
            String(String(outObj.inpVal * (1 - Number(custom) / 100))),
            outObj.decimal
          ),
          0
        );
        if (swap.hash) {
          message.success(t("message.success"));
          close();
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        const approveContract = new ethers.Contract(
          outObj.address,
          ERC20_ABI,
          getProvider().getSigner()
        );
        const approveTx = await approveContract.approve(
          SwapContractAddress,
          parseUnitsDecimal(
            String(outObj.inpVal * (1 + Number(custom) / 100)),
            18
          )
        );
        await approveTx.wait();
        const swap = await SwapContract().swapExactOutputSingle(
          outObj.address,
          inObj.address,
          parseUnitsDecimal(String(inObj.inpVal), inObj.decimal),
          3000,
          parseUnitsDecimal(
            String(String(inObj.inpVal * (1 + Number(custom) / 100))),
            inObj.decimal
          ),
          0
        );
        if (swap.hash) {
          message.success(t("message.success"));
          close();
        }
      } catch (error) {
        console.log(error);
      }
    }
    setButtonLoading(false);
  };
  useEffect(() => {
    init();
  }, []);
  const init = async () => {
    let newSwapToken = swapToken;
    for (let i = 0; i < newSwapToken.length; i++) {
      const balanceContract = new ethers.Contract(
        newSwapToken[i].address,
        ERC20_ABI,
        getProvider().getSigner()
      );
      const balance = await balanceContract.balanceOf(Store.walletInfo.address);
      newSwapToken[i].balance = formatUnitsDecimal(
        balance,
        newSwapToken[i].decimal
      );
      if (newSwapToken[i].title === "USDS") {
        setOutObj((obj) => {
          return { ...obj, balance: newSwapToken[i].balance };
        });
      } else if (newSwapToken[i].title === "USDT") {
        setInObj((obj) => {
          return { ...obj, balance: newSwapToken[i].balance };
        });
      }
    }
    setSwapToken([...newSwapToken]);
  };
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
              {t("supplyBorrowData.quickSwap.balance")}:
              {thousandSeparator(outObj.balance)}
              <span
                className="ml-2 pl-2 cursor-pointer text-blue-500"
                style={{ borderLeft: "1px solid rgba(255, 255, 255, 0.12)" }}
                onClick={() => {
                  setOutObj((obj) => {
                    return {
                      ...obj,
                      inpVal: obj.balance,
                    };
                  });
                }}
              >
                {t("supplyBorrowData.quickSwap.max")}
              </span>
            </div>
          </div>
          <div className="w-full mt-3 flex items-center justify-between">
            <input
              className="text-white text-24 font-bold bg-none"
              type="text"
              value={outObj.inpVal}
              onChange={(e) => {
                setNowInput("pay");
                inpChange(e, "out");
              }}
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
                  {swapToken.map((item, index) => {
                    return (
                      <div
                        key={index}
                        className="flex items-center cursor-pointer border-lxl-1 mb-2 border-solid border-white border-opacity-0 hover:border-opacity-100 rounded text-white font-bold"
                        style={{
                          padding: "10px 8px",
                          background: "#202126",
                        }}
                        onClick={() => changeToken("out", item)}
                      >
                        <img
                          className="w-5 h-5 rounded-full mr-1"
                          src={item.icon}
                          alt=""
                        />
                        {item.title}
                      </div>
                    );
                  })}
                </div>
              }
            >
              <div
                className="flex items-center rounded-xl font-bold gap-x-1 text-white  cursor-pointer hover:opacity-80"
                style={{ padding: "10px 8px", background: "#202126" }}
              >
                <img
                  className="w-5 h-5 rounded-full"
                  src={outObj.icon}
                  alt=""
                />
                {outObj.token}
                {payShow ? <UpOutlined /> : <DownOutlined />}
              </div>
            </Popover>
          </div>
        </div>
        <img
          className="w-9 h-9 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          src={swapIcon}
          alt=""
          onClick={() => resetOutAndIn()}
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
              {t("supplyBorrowData.quickSwap.balance")}:
              {thousandSeparator(inObj.balance)}
              <span
                className="ml-2 pl-2 cursor-pointer text-blue-500"
                style={{ borderLeft: "1px solid rgba(255, 255, 255, 0.12)" }}
                onClick={() => {
                  setInObj((obj) => {
                    return {
                      ...obj,
                      inpVal: obj.balance,
                    };
                  });
                }}
              >
                {t("supplyBorrowData.quickSwap.max")}
              </span>
            </div>
          </div>
          <div className="w-full mt-3 flex items-center justify-between">
            <input
              className="text-white text-24 font-bold bg-none"
              type="text"
              value={inObj.inpVal}
              onChange={(e) => {
                setNowInput("receive");
                inpChange(e, "in");
              }}
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
                  {swapToken.map((item, index) => {
                    return (
                      <div
                        key={index}
                        className="flex items-center cursor-pointer border-lxl-1 mb-2 border-solid border-white border-opacity-0 hover:border-opacity-100 rounded text-white font-bold"
                        style={{
                          padding: "10px 8px",
                          background: "#202126",
                        }}
                        onClick={() => changeToken("in", item)}
                      >
                        <img
                          className="w-5 h-5 rounded-full mr-1"
                          src={item.icon}
                          alt=""
                        />
                        {item.title}
                      </div>
                    );
                  })}
                </div>
              }
            >
              <div
                className="flex items-center rounded-xl font-bold gap-x-1 text-white  cursor-pointer hover:opacity-80"
                style={{ padding: "10px 8px", background: "#202126" }}
              >
                <img className="w-5 h-5 rounded-full" src={inObj.icon} alt="" />
                {inObj.token}
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
          <span>
            1 {outObj.token} ≈ 1 {inObj.token}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="opacity-50">
            {t("supplyBorrowData.quickSwap.mobileRate")}
          </span>
          <span>0.3%</span>
        </div>
        <div className="flex justify-between">
          <span className="opacity-50">
            {t("supplyBorrowData.quickSwap.exchangeRate")}
          </span>
          <span>0.3%</span>
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
          <Popover
            trigger="click"
            placement="bottomRight"
            arrow={false}
            open={slippageShow}
            onOpenChange={(show) => setSlippageShow(show)}
            content={
              <div
                className="w-lxl-200 box-border p-2 rounded-lg"
                style={{
                  background: "#151619",
                  border: "1px solid rgba(255, 255, 255, 0.32)",
                }}
              >
                <div
                  className="flex items-center justify-between cursor-pointer border-lxl-1 mb-2 border-solid border-white border-opacity-0 hover:border-opacity-100 rounded text-white font-bold"
                  style={{
                    padding: "10px 8px",
                    background: "#202126",
                  }}
                  onClick={() => setCustom("0.5")}
                >
                  <span>{t("supplyBorrowData.quickSwap.auto")}</span>
                  <span>0.5%</span>
                </div>
                <div
                  className="flex items-center justify-between cursor-pointer border-lxl-1 mb-2 border-solid border-white border-opacity-0 hover:border-opacity-100 rounded text-white font-bold"
                  style={{
                    padding: "10px 8px",
                    background: "#202126",
                  }}
                >
                  <span>{t("supplyBorrowData.quickSwap.custom")}</span>
                  <div className="flex items-center">
                    <input
                      className="text-right w-20 text-gray-500 focus:text-white"
                      value={custom}
                      onChange={(e) => {
                        setCustom(e.target.value);
                      }}
                    />
                    <span className="ml-1">%</span>
                  </div>
                </div>
              </div>
            }
          >
            <div className=" flex items-center cursor-pointer">
              {custom}%
              <DownOutlined className=" ml-1 cursor-pointer" />
            </div>
          </Popover>
        </div>
      </div>
      <MyButton
        onClick={() => swapClick()}
        className="w-full mt-10 text-18 h-14 box-border"
        loading={buttonLoading}
        disabled={
          Number(outObj.inpVal) > outObj.balance ||
          Number(outObj.inpVal) <= 0 ||
          Number(inObj.inpVal) > inObj.balance ||
          Number(inObj.inpVal) <= 0 ||
          outObj.token === inObj.token
        }
      >
        {t("supplyBorrowData.quickSwap.swap")}
      </MyButton>
    </>
  );
}
export default observer(QuickSwapDialog);
