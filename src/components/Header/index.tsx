import { observer } from "mobx-react-lite";
import logo from "@/assets/img/logo.png";
import language from "@/assets/img/language.png";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import MyButton from "../MyButton";
import { Popover } from "antd";
import "./index.css";
import { changeLanguage } from "i18next";
import { useEffect, useState } from "react";
import { initBlockNative } from "@/hook/web3/web3Service.ts";
import { useStore } from "@/store";
import addressFormat from "@/hook/utils/addressFormat";
import NetworkSelect from "../NetworkSelect";
import MyModal from "../MyModal";
type tabListType = {
  title: string;
  path: string;
};
type languageListType = {
  label: string;
  value: string;
};
const content = () => {
  const languageList: languageListType[] = [
    {
      label: "English",
      value: "en",
    },
    {
      label: "繁體中文",
      value: "zhtw",
    },
    {
      label: "简体中文",
      value: "zhcn",
    },
    {
      label: "日本語",
      value: "jp",
    },
    {
      label: "한국인",
      value: "ko",
    },
  ];
  const setLanguage = (value: string) => {
    changeLanguage(value);
    localStorage.lang = value;
  };
  return (
    <div className="w-32">
      {languageList.map((item) => {
        return (
          <div
            key={item.value}
            className="cursor-pointer text-white w-full hover:bg-gray-800 rounded-md"
            style={{
              padding: "6px 10px",
              background:
                localStorage?.lang === item.value ? "rgb(31,41,55)" : "",
            }}
            onClick={() => setLanguage(item.value)}
          >
            {item.label}
          </div>
        );
      })}
    </div>
  );
};
const Header = () => {
  const { t } = useTranslation("translations");
  const { Store } = useStore();
  const location = useLocation();
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isNetworkSelectShow, setIsNetworkSelectShow] = useState(false);
  const connectToWallet = () => {
    // setLoading(true);
    initBlockNative(Store);
  };
  const getActive = (path: string) => {
    return location.pathname === path ? "#FCEF62" : "#fff";
  };
  const tabList: tabListType[] = [
    {
      title: t("header.tab1"),
      path: "/",
    },
    {
      title: t("header.tab2"),
      path: "/tab2",
    },
  ];

  useEffect(() => {
    if (!Store.getIsContacted()) {
      initBlockNative(Store);
    }
    Store.setOpenNetworkSelect(() => setIsNetworkSelectShow(true));
  }, []);
  return (
    <>
      <div className="w-full flex justify-between pt-4 pb-4">
        <img className="h-5" src={logo} alt="" />
        <div className="flex items-center gap-x-6">
          {tabList.map((item, index) => {
            return (
              <span
                className="font-bold cursor-pointer"
                key={index}
                style={{
                  color: getActive(item.path),
                }}
                onClick={() => nav(item.path)}
              >
                {item.title}
              </span>
            );
          })}
          <Popover content={content}>
            <img className="w-5 h-5 cursor-pointer" src={language} alt="" />
          </Popover>
          {Store.getIsContacted() ? (
            Store.getIsSupportedChain() ? (
              <div
                className="flex items-center text-12 font-bold text-white rounded-lg cursor-pointer hover:opacity-80"
                style={{ padding: "8px 10px", background: "#202126" }}
                onClick={() => setIsNetworkSelectShow(true)}
              >
                <img
                  className="w-4 h-4 mr-2"
                  src={Store.walletInfo.networkIcon}
                  alt=""
                />
                <span>{addressFormat(Store.walletInfo.address)}</span>
              </div>
            ) : (
              <div
                className=" text-red-500 rounded-lg cursor-pointer  hover:opacity-80"
                style={{ padding: "8px 10px", background: "#202126" }}
                onClick={() => setIsNetworkSelectShow(true)}
              >
                {t("header.errorChain")}
              </div>
            )
          ) : (
            <MyButton
              loading={loading}
              onClick={() => {
                connectToWallet();
              }}
            >
              {t("header.button")}
            </MyButton>
          )}
        </div>
      </div>
      <MyModal
        onCancel={() => setIsNetworkSelectShow(false)}
        open={isNetworkSelectShow}
        width={316}
      >
        <NetworkSelect />
      </MyModal>
    </>
  );
};
export default observer(Header);
