import { observer } from "mobx-react-lite";
import { useStore } from "@/store";
import LendingAndDepositTable from "@/components/LendingAndDepositTable";
import { useTranslation } from "react-i18next";
import { TokenList } from "@/hook/utils/pool";
import { thousandSeparator } from "@/hook/utils/addressFormat";
import MyButton from "@/components/MyButton";
import { InfoCircleOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import MyModal from "../../../components/MyModal";
import StakeDialog from "./StakeDialog";
import { Tooltip } from "antd";
import {
  StakeToSCContract,
  StakeToSTContract,
} from "../../../hook/web3/apeContract";
import {
  ERC20_ABI,
  USDC_TOKEN,
  USDS_TOKEN,
  USDT_TOKEN,
} from "../../../hook/web3/libs/constants";
import { formatUnitsDecimal } from "../../../hook/utils/addressFormat";
import { getProvider } from "../../../hook/web3/web3Service";
import { ethers } from "ethers";

export default observer(function () {
  const { t } = useTranslation("translations");
  const [stakeDialogShow, setStakeDialogShow] = useState(false);
  const [stakeDialogType, setStakeDialogType] = useState(1);
  const [actionRow, setActionRow] = useState(null);
  const [stakeData, setStakeData] = useState(
    TokenList.map((item: any) => {
      return {
        ...item,
        myPosition: 0,
        interestRate: 0,
        sum: 0,
        currentEarnings: 0,
      };
    })
  );
  const { Store } = useStore();

  const stakeColumns = [
    {
      title: t("stakeTable.tab1"),
      dataIndex: "title",
      key: "title",
      render: (text: any, row: any) => {
        return (
          <div className=" flex items-center">
            <img className="w-7 h-7 rounded-full" src={row.icon} alt="" />
            <span className="ml-2">{text}</span>
          </div>
        );
      },
    },
    {
      title: t("stakeTable.tab2"),
      dataIndex: "myPosition",
      key: "myPosition",
      render: (text: any, record: any) => {
        return Store.getIsSupportedChain() ? (
          <div>
            <div className="text-white">${thousandSeparator(text)}</div>
          </div>
        ) : (
          "--"
        );
      },
    },
    {
      title: t("stakeTable.tab3"),
      dataIndex: "interestRate",
      key: "interestRate",
      render: (text: any, record: any) => {
        return Store.getIsSupportedChain() ? (
          <div className="flex items-center">
            <span className="text-white">{text}%</span>
            <Tooltip title={t("stakeTable.tab3_tips")} color="#30333D">
              <InfoCircleOutlined className="w-4 h-4 ml-1 cursor-pointer hover:opacity-80" />
            </Tooltip>
          </div>
        ) : (
          "--"
        );
      },
    },
    {
      title: t("stakeTable.tab4"),
      dataIndex: "sum",
      key: "sum",
      render: (text: any) => {
        return Store.getIsSupportedChain() ? (
          <div>
            <div className="text-white">{text} USDS</div>
          </div>
        ) : (
          "--"
        );
      },
    },
    {
      title: t("stakeTable.tab5"),
      dataIndex: "currentEarnings",
      key: "currentEarnings",
      render: (text: any) => {
        return Store.getIsSupportedChain() ? (
          <div>${thousandSeparator(text)}</div>
        ) : (
          "--"
        );
      },
    },
    {
      title: t("stakeTable.tab6"),
      dataIndex: "",
      align: "right",
      key: "",
      render: (text: any, record: any) => {
        return (
          <div className="flex items-center justify-end">
            <MyButton
              disabled={!Store.getIsSupportedChain()}
              onClick={() => openStakeDialog(record, 1)}
            >
              {t("stakeTable.tab6_button1")}
            </MyButton>
            <div
              className="rounded-lg ml-1 cursor-pointer"
              onClick={() => openStakeDialog(record, 2)}
              style={{
                padding: "6px 10px",
                border: "1px solid rgba(255, 255, 255, 0.32)",
                opacity: !Store.getIsSupportedChain() ? "0.5" : "1",
              }}
            >
              {t("stakeTable.tab6_button2")}
            </div>
          </div>
        );
      },
    },
  ];
  useEffect(() => {
    init();
  }, [Store.getIsSupportedChain()]);
  async function init() {
    if (Store.getIsSupportedChain()) {
      let newStakeData = [...stakeData];
      for (let i = 0; i < newStakeData.length; i++) {
        switch (newStakeData[i].title) {
          case "USDS":
            newStakeData[i].sum =
              formatUnitsDecimal(
                await StakeToSCContract().protTotalDeposits(USDS_TOKEN.address),
                USDS_TOKEN.decimals
              ) +
              formatUnitsDecimal(
                await StakeToSTContract().protTotalDeposits(USDS_TOKEN.address),
                USDS_TOKEN.decimals
              );
            newStakeData[i].myPosition =
              formatUnitsDecimal(
                await StakeToSCContract().userTotalDeposits(
                  Store.walletInfo.address,
                  USDS_TOKEN.address
                ),
                USDS_TOKEN.decimals
              ) +
              formatUnitsDecimal(
                await StakeToSTContract().userTotalDeposits(
                  Store.walletInfo.address,
                  USDS_TOKEN.address
                ),
                USDS_TOKEN.decimals
              );
            newStakeData[i].interestRate = formatUnitsDecimal(
              await StakeToSCContract().fee(),
              4
            );
            break;
          case "USDT":
            newStakeData[i].sum = formatUnitsDecimal(
              await StakeToSTContract().protTotalDeposits(USDT_TOKEN.address),
              USDT_TOKEN.decimals
            );
            newStakeData[i].myPosition = formatUnitsDecimal(
              await StakeToSTContract().userTotalDeposits(
                Store.walletInfo.address,
                USDT_TOKEN.address
              ),
              USDT_TOKEN.decimals
            );
            newStakeData[i].interestRate = formatUnitsDecimal(
              await StakeToSTContract().fee(),
              4
            );
            break;
          case "USDC":
            newStakeData[i].sum = formatUnitsDecimal(
              await StakeToSCContract().protTotalDeposits(USDC_TOKEN.address),
              USDC_TOKEN.decimals
            );
            newStakeData[i].myPosition = formatUnitsDecimal(
              await StakeToSCContract().userTotalDeposits(
                Store.walletInfo.address,
                USDC_TOKEN.address
              ),
              USDC_TOKEN.decimals
            );
            newStakeData[i].interestRate = formatUnitsDecimal(
              await StakeToSCContract().fee(),
              4
            );
            break;

          default:
            break;
        }
      }
      setStakeData([...newStakeData]);
    }
  }
  const openStakeDialog = async (row: any, type: number) => {
    const balanceContract = new ethers.Contract(
      row.address,
      ERC20_ABI,
      getProvider().getSigner()
    );
    let actionObj = {
      ...row,
      LPList: [],
      balance: formatUnitsDecimal(
        await balanceContract.balanceOf(Store.walletInfo.address),
        row.decimal
      ),
    };
    if (actionObj.title === "USDS") {
      actionObj.LPList = [
        {
          title: "USDS/USDT",
          otherToken: stakeData.find((item: any) => item.title === "USDT"),
        },
        {
          title: "USDS/USDC",
          otherToken: stakeData.find((item: any) => item.title === "USDC"),
        },
      ];
    } else if (actionObj.title === "USDT") {
      actionObj.LPList = [
        {
          title: "USDS/USDT",
          otherToken: stakeData.find((item: any) => item.title === "USDS"),
        },
      ];
    } else if (actionObj.title === "USDC") {
      actionObj.LPList = [
        {
          title: "USDS/USDC",
          otherToken: stakeData.find((item: any) => item.title === "USDS"),
        },
      ];
    }
    setStakeDialogType(type);
    console.log(actionObj);
    setActionRow(actionObj);
    setStakeDialogShow(true);
  };
  return (
    <>
      <LendingAndDepositTable
        title={t("stakeTable.title")}
        columns={stakeColumns}
        data={stakeData}
      />
      <MyModal
        width={500}
        open={stakeDialogShow}
        onCancel={() => setStakeDialogShow(false)}
      >
        <StakeDialog
          onCancel={() => {
            setStakeDialogShow(false);
            init();
          }}
          actionRow={actionRow}
          type={stakeDialogType}
        />
      </MyModal>
    </>
  );
});
