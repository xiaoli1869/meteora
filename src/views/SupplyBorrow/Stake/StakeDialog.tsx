import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next";
import MyButton from "../../../components/MyButton";
import { useState } from "react";
import { CloseOutlined, InfoCircleOutlined } from "@ant-design/icons";
import "./stakeDialog.css";
import { Segmented, Tooltip } from "antd";
type propsType = {
  type: number;
  actionRow: any;
  onCancel: () => void;
};
export default observer(function (props: propsType) {
  const { t } = useTranslation("translations");
  const [inpValue, setInpValue] = useState("0");
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
    setInpValue((props.actionRow.maxLending * value).toFixed(2));
  };
  const segmentedOption = [
    {
      label: "USDT / USDS",
      value: "1",
    },
    {
      label: "USDC / USDS",
      value: "2",
    },
  ];
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
      <div className="mt-4">
        {false ? (
          <div className="flex items-center text-white">
            <img
              className="w-9 h-9 rounded-full"
              src={props.actionRow.icon1}
              alt=""
            />
            <img
              className="w-9 h-9 -ml-4 rounded-full"
              src={props.actionRow.icon2}
              alt=""
            />
            <div className="text-20 font-bold ml-2">
              {props.actionRow.title}
            </div>
          </div>
        ) : (
          <Segmented size="large" options={segmentedOption} block />
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
              {t("stakeTable.dialog.balance")}:{200.182} USDT
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
            {proportionList.map((item) => {
              return (
                <div
                  className="border-solid cursor-pointer border-lxl-1 border-black hover:border-white rounded-md whitespace-nowrap"
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
              100,128.22
              <img className="w-5 h-5 rounded-full ml-1" src="" alt="" />
            </div>
            <div className="flex mt-1 items-center">
              12,100
              <img className="w-5 h-5 rounded-full ml-1" src="" alt="" />
            </div>
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
            500
            <img className="w-5 h-5 rounded-full ml-1" src="" alt="" />
          </div>
        </div>
      </div>
      <MyButton className=" w-full text-18 font-bold h-14">
        {type === 1
          ? t("stakeTable.dialog.button")
          : t("stakeTable.dialog.takeOutButton")}
      </MyButton>
    </>
  );
});
