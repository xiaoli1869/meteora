import { observer } from "mobx-react-lite";
import { useStore } from "@/store";
import LendingAndDepositTable from "@/components/LendingAndDepositTable";
import { useTranslation } from "react-i18next";
import { LendingList } from "@/hook/utils/pool";
import { thousandSeparator } from "@/hook/utils/addressFormat";
import MyButton from "@/components/MyButton";
import { InfoCircleOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import MyModal from "../../../components/MyModal";
import StakeDialog from "./StakeDialog";
import { Tooltip } from "antd";

export default observer(function () {
  const { t } = useTranslation("translations");
  const [stakeDialogShow, setStakeDialogShow] = useState(false);
  const [stakeDialogType, setStakeDialogType] = useState(1);
  const [actionRow, setActionRow] = useState(null);
  const [lendingData, setLendingData] = useState([...LendingList]);
  const { Store } = useStore();

  const lendingColumns = [
    {
      title: t("stakeTable.tab1"),
      dataIndex: "title",
      key: "title",
      render: (text: any, row: any) => {
        return (
          <div className=" flex items-center">
            <img className="w-7 h-7 rounded-full" src={row.icon1} alt="" />
            <span className="ml-2">{text}</span>
          </div>
        );
      },
    },
    {
      title: t("stakeTable.tab2"),
      dataIndex: "myPositions",
      key: "myPositions",
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
      dataIndex: "pledge",
      key: "pledge",
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
      dataIndex: "",
      key: "",
      render: (text: any, record: any) => {
        return Store.getIsSupportedChain() ? (
          <div>
            <div className="text-white">{record.maxLending} USDS</div>
          </div>
        ) : (
          "--"
        );
      },
    },
    {
      title: t("stakeTable.tab5"),
      dataIndex: "",
      key: "",
      render: (text: any, record: any) => {
        return Store.getIsSupportedChain() ? (
          <div>${thousandSeparator(record.maxLending)}</div>
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
      // const a = await LPLendContract().previewPositionId(
      //   Store.walletInfo.address,
      //   "0x5d671210bB837CB006867e0499c8f8D0d3b72983",
      //   18726
      // );
      // const b = await LPLendContract().lendings(a);
      // console.log(b);
      // const newLendingData = [...lendingData];
      // newLendingData.forEach(async (item: any) => {
      //   const a = await LPLendContract().lendings(item.address);
      //   console.log(a);
      // });
      // let newHealthDegrees = { ...healthDegrees };
      // for (const row of ClaimFeesData) {
      //   const result = await LPLendContract().previewHealthFactor(
      //     Store.walletInfo.address,
      //     row.address,
      //     row.tokenId
      //   );
      //   console.log(result);
      //   // newHealthDegrees[row.tokenId] = result.healthFactor;
      // }
      // setHealthDegrees(newHealthDegrees);
    }
  }
  const openStakeDialog = (row: any, type: number) => {
    setStakeDialogType(type);
    setActionRow(row);
    setStakeDialogShow(true);
  };
  return (
    <>
      <LendingAndDepositTable
        title={t("lendingTable.title")}
        columns={lendingColumns}
        data={lendingData}
      />
      <MyModal
        width={500}
        open={stakeDialogShow}
        onCancel={() => setStakeDialogShow(false)}
      >
        <StakeDialog
          onCancel={() => setStakeDialogShow(false)}
          actionRow={actionRow}
          type={stakeDialogType}
        />
      </MyModal>
    </>
  );
});
