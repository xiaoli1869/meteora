import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next";
import MyButton from "../../../components/MyButton";
import { useState } from "react";
import { CloseOutlined, InfoCircleOutlined } from "@ant-design/icons";
import "./stakeDialog.css";
import { message, Segmented, Tooltip } from "antd";
import {
  parseUnitsDecimal,
  thousandSeparator,
} from "../../../hook/utils/addressFormat";
import {
  StakeToSCContract,
  StakeToSTContract,
} from "../../../hook/web3/apeContract";
import { ethers } from "ethers";
import { getProvider } from "../../../hook/web3/web3Service";
import {
  ERC20_ABI,
  StakeToSCContractAddress,
  StakeToSTContractAddress,
} from "../../../hook/web3/libs/constants";
type propsType = {
  type: number;
  actionRow: any;
  onCancel: () => void;
};
export default observer(function (props: propsType) {
  const { t } = useTranslation("translations");
  const [inpValue, setInpValue] = useState("0");
  const [segmentedVal, setSegmentedVal] = useState(
    props.actionRow.LPList[0].title
  );
  const [buttonLoading, setButtonLoading] = useState(false);
  const [type, setType] = useState(props.type);
  const proportionList = [
    {
      title: "25%",
      value: 0.25,
    },
    {
      title: "50%",
      value: 0.5,
    },
    {
      title: "75%",
      value: 0.75,
    },
    {
      title: "Max",
      value: 1,
    },
  ];
  const updateInputValue = (value: number) => {
    if (type === 1) {
      setInpValue((props.actionRow.balance * value).toFixed(2));
    } else if (type === 2) {
      setInpValue(
        (
          (props.actionRow.myPosition + props.actionRow.currentEarnings) *
          value
        ).toFixed(2)
      );
    }
  };
  const buttonClick = async () => {
    setButtonLoading(true);
    const approveContract = new ethers.Contract(
      props.actionRow.address,
      ERC20_ABI,
      getProvider().getSigner()
    );
    if (type === 1) {
      if (segmentedVal === "USDS/USDT") {
        try {
          const approveTx = await approveContract.approve(
            StakeToSTContractAddress,
            parseUnitsDecimal(inpValue, props.actionRow.decimal)
          );
          await approveTx.wait();
          const deposit = await StakeToSTContract().deposit(
            props.actionRow.address,
            parseUnitsDecimal(inpValue, props.actionRow.decimal)
          );
          deposit.wait();
          if (deposit.hash) {
            message.success(t("message.success"));
            props.onCancel();
          }
        } catch (error) {
          console.log(error);
        }
      } else if (segmentedVal === "USDS/USDC") {
        try {
          const approveTx = await approveContract.approve(
            StakeToSCContractAddress,
            parseUnitsDecimal(inpValue, props.actionRow.decimal)
          );
          await approveTx.wait();
          const deposit = await StakeToSCContract().deposit(
            props.actionRow.address,
            parseUnitsDecimal(inpValue, props.actionRow.decimal)
          );
          deposit.wait();
          if (deposit.hash) {
            message.success(t("message.success"));
            props.onCancel();
          }
        } catch (error) {
          console.log(error);
        }
      }
    } else if (type === 2) {
      if (segmentedVal === "USDS/USDT") {
        try {
          const approveTx = await approveContract.approve(
            StakeToSTContractAddress,
            parseUnitsDecimal(inpValue, props.actionRow.decimal)
          );
          await approveTx.wait();
          const deposit = await StakeToSTContract().withdraw(
            parseUnitsDecimal(inpValue, props.actionRow.decimal)
          );
          deposit.wait();
          if (deposit.hash) {
            message.success(t("message.success"));
            props.onCancel();
          }
        } catch (error) {
          console.log(error);
        }
      } else if (segmentedVal === "USDS/USDC") {
        try {
          const approveTx = await approveContract.approve(
            StakeToSCContractAddress,
            parseUnitsDecimal(inpValue, props.actionRow.decimal)
          );
          await approveTx.wait();
          const deposit = await StakeToSCContract().withdraw(
            parseUnitsDecimal(inpValue, props.actionRow.decimal)
          );
          deposit.wait();
          if (deposit.hash) {
            message.success(t("message.success"));
            props.onCancel();
          }
        } catch (error) {
          console.log(error);
        }
      }
    }
    setButtonLoading(false);
  };
  return (
    <>
      <div className="flex items-end justify-between">
        <div className="flex text-16 items-center gap-x-3">
          <span
            className="font-bold cursor-pointer"
            onClick={() => setType(1)}
            style={{ color: type === 1 ? "#fff" : "rgba(255, 255, 255, 0.48)" }}
          >
            {t("stakeTable.dialog.title")}
          </span>
          <span
            className="font-bold cursor-pointer"
            onClick={() => setType(2)}
            style={{ color: type === 2 ? "#fff" : "rgba(255, 255, 255, 0.48)" }}
          >
            {t("stakeTable.dialog.takeOutTitle")}
          </span>
        </div>
        <CloseOutlined className="w-6 h-6" onClick={props.onCancel} />
      </div>
      <div className="mt-4 mb-3">
        {props.actionRow.LPList.length === 1 ? (
          <div className="flex items-center text-white">
            <img
              className="w-9 h-9 rounded-full"
              src={props.actionRow.icon}
              alt=""
            />
            <img
              className="w-9 h-9 -ml-4 rounded-full"
              src={props.actionRow.LPList[0].otherToken.icon}
              alt=""
            />
            <div className="text-20 font-bold ml-2">
              {props.actionRow.LPList[0].title}
            </div>
          </div>
        ) : (
          <Segmented
            size="large"
            value={segmentedVal}
            onChange={(e) => setSegmentedVal(e)}
            options={props.actionRow.LPList.map((item: any) => {
              return {
                label: (
                  <div className="w-full flex items-center justify-center">
                    <img
                      className="w-5 h-5 rounded-full"
                      src={props.actionRow.icon}
                      alt=""
                    />
                    <img
                      className="w-5 h-5 rounded-full -ml-2.5"
                      src={item.otherToken.icon}
                      alt=""
                    />
                    <span className="ml-1">{item.title}</span>
                  </div>
                ),
                value: item.title,
              };
            })}
            block
          />
        )}
      </div>

      <div
        className="p-4 rounded-lg text-white"
        style={{ background: "#0E0E0F" }}
      >
        <div className="w-full opacity-80 flex items-center justify-between">
          <span>
            {type === 1
              ? t("stakeTable.dialog.amount")
              : t("stakeTable.dialog.takeOutAmount")}
          </span>
          {type === 1 ? (
            <span>
              {t("stakeTable.dialog.balance")}:
              {thousandSeparator(props.actionRow.balance)} USDT
            </span>
          ) : null}
        </div>

        <div className="flex w-full mt-3 justify-between items-center">
          <input
            className="text-24 w-52  text-white font-bold"
            type="text"
            value={inpValue}
            onChange={(e) => setInpValue(e.target.value)}
          />
          <div className="text-white flex items-center gap-x-1">
            {proportionList.map((item, index) => {
              return (
                <div
                  key={index}
                  className="border-solid cursor-pointer border-lxl-1 border-white border-opacity-0 hover:border-opacity-100 rounded-md whitespace-nowrap"
                  style={{ padding: "8px 12px" }}
                  onClick={() => updateInputValue(item.value)}
                >
                  {item.title}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div
        className="mt-3 mb-10 p-4 rounded-lg text-white"
        style={{ background: "#202126" }}
      >
        <div
          className="flex justify-between pb-5"
          style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.12)" }}
        >
          <span className="opacity-50">{t("stakeTable.dialog.sumLiqui")}</span>
          <div className="flex flex-col items-end">
            <div className="flex items-center">
              {thousandSeparator(props.actionRow.sum)}
              <img
                className="w-5 h-5 rounded-full ml-1"
                src={props.actionRow.icon}
                alt=""
              />
            </div>
            {props.actionRow.LPList.filter(
              (item: any) => item.title === segmentedVal
            ).map((item: any, index: number) => (
              <div key={index} className="flex mt-1 items-center">
                {thousandSeparator(item.otherToken.sum)}
                <img
                  className="w-5 h-5 rounded-full ml-1"
                  src={item.otherToken.icon}
                  alt=""
                />
              </div>
            ))}
          </div>
        </div>
        <div className="flex pt-5 justify-between">
          <div className="flex items-center opacity-50">
            <span>{t("stakeTable.dialog.pledge")}</span>
            <Tooltip
              title={
                type === 1
                  ? t("stakeTable.dialog.tips")
                  : t("stakeTable.dialog.takeOutTips")
              }
              color="#30333D"
            >
              <InfoCircleOutlined className="w-4 h-4 ml-1 cursor-pointer hover:opacity-80" />
            </Tooltip>
          </div>
          <div className="flex items-center">
            {thousandSeparator(
              props.actionRow.myPosition + props.actionRow.currentEarnings
            )}
            <img
              className="w-5 h-5 rounded-full ml-1"
              src={props.actionRow.icon}
              alt=""
            />
          </div>
        </div>
      </div>
      <MyButton
        className=" w-full text-18 font-bold h-14"
        loading={buttonLoading}
        onClick={() => buttonClick()}
        disabled={
          type === 1
            ? Number(inpValue) <= 0
            : props.actionRow.myPosition + props.actionRow.currentEarnings ===
                0 ||
              Number(inpValue) >
                props.actionRow.myPosition + props.actionRow.currentEarnings
        }
      >
        {type === 1
          ? t("stakeTable.dialog.button")
          : t("stakeTable.dialog.takeOutButton")}
      </MyButton>
    </>
  );
});
