import { observer } from "mobx-react-lite";
import { useStore } from "@/store";
import LendingAndDepositTable from "@/components/LendingAndDepositTable";
import { useTranslation } from "react-i18next";
import { LendingList } from "@/hook/utils/pool";
import { thousandSeparator } from "@/hook/utils/addressFormat";
import MyButton from "@/components/MyButton";
import { DownOutlined, UpOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { LPLendContract } from "@/hook/web3/apeContract";
import MyModal from "../../../components/MyModal";
import ClaimFeesTable from "../../../components/ClaimFeesTable";
import LendingDialog from "./LendingDialog";

export default observer(function () {
  const { t } = useTranslation("translations");
  const [expandedRowKeys, setExpandedRowKeys] = useState<any>([]);
  const [healthDegrees, setHealthDegrees] = useState({});
  const [claimFeesShow, setClaimFeesShow] = useState(false);
  const [selectRows, setSelectRows] = useState([]);
  const [lendingDialogShow, setLendingDialogShow] = useState(false);
  const [lendingDialogType, setLendingDialogType] = useState(1);
  const [actionRow, setActionRow] = useState(null);
  const [lendingData, setLendingData] = useState([...LendingList]);
  const { Store } = useStore();

  const HealthDegree = ({ lev }: { lev: any }) => {
    let content: any = [];
    const itemDiv = (bg: string) => (
      <div className="w-1 h-4" style={{ background: bg }} />
    );
    for (let i = 0; i < lev; i++) {
      switch (lev) {
        case 1:
          content.push(itemDiv("#25CA83"));
          break;
        case 2:
          content.push(itemDiv("#25CA83"));
          break;
        case 3:
          content.push(itemDiv("#F76816"));
          break;
        case 4:
          content.push(itemDiv("#F44960"));
          break;
        case 5:
          content.push(itemDiv("#F44960"));
          break;
        default:
          break;
      }
    }
    for (let i = 0; i < 5 - lev; i++) {
      content.push(itemDiv("#30333D"));
    }
    return <div className="flex gap-x-0.5">{content}</div>;
  };
  const handleExpand = (record: any) => {
    const keys = expandedRowKeys.includes(record.tokenId)
      ? expandedRowKeys.filter((k) => k !== record.tokenId)
      : [...expandedRowKeys, record.tokenId];
    setExpandedRowKeys(keys);
  };
  const ClaimFeesColumns = [
    {
      title: t("claimFees.tab1"),
      dataIndex: "",
      key: "",
      render: () => {
        return "SUSHI - BTC";
      },
    },
    {
      title: t("claimFees.tab2"),
      dataIndex: "",
      key: "",
      render: () => {
        return "3158062";
      },
    },
    {
      title: t("claimFees.tab3"),
      dataIndex: "",
      key: "",
      align: "right",
      render: () => {
        return (
          <div className="text-right">
            <div>122,850.2371</div>
            <div>17.2816</div>
          </div>
        );
      },
    },
  ];
  const ClaimFeesData = [{}, {}];
  const lendingColumns = [
    {
      title: t("lendingTable.tab1"),
      dataIndex: "title",
      key: "title",
      render: (text: any, row: any) => {
        return (
          <div className=" flex items-center">
            <img className="w-7 h-7 rounded-full" src={row.icon1} alt="" />
            <img
              className="w-7 h-7 rounded-full -ml-4"
              src={row.icon2}
              alt=""
            />
            <span className="ml-2">{text}</span>
            {row.children ? (
              <span
                className="ml-2 cursor-pointer"
                onClick={() => handleExpand(row)}
              >
                {expandedRowKeys.includes(row.tokenId) ? (
                  <UpOutlined />
                ) : (
                  <DownOutlined />
                )}
              </span>
            ) : null}
          </div>
        );
      },
    },
    {
      title: t("lendingTable.tab2"),
      dataIndex: "myPositions",
      key: "myPositions",
      render: (text: any, record: any) => {
        return Store.getIsSupportedChain() ? (
          <div>
            <div className="text-white">${thousandSeparator(text)}</div>
            {record.children ? (
              <div className="text-white opacity-50">
                {t("lendingTable.tab2_1", { num: record.children.length })}
              </div>
            ) : null}
          </div>
        ) : (
          "--"
        );
      },
    },
    {
      title: t("lendingTable.tab3"),
      dataIndex: "pledge",
      key: "pledge",
      render: (text: any, record: any) => {
        return Store.getIsSupportedChain() ? (
          <>
            <div className="text-white">${thousandSeparator(text)}</div>
            {record.children ? (
              <div className=" flex items-center">
                <span className="text-white opacity-50">
                  {t("lendingTable.tab3_1", { num: record.LPIncome })}
                </span>
                <div
                  className="p-1 pl-2 pr-2 rounded-md text-white ml-1 cursor-pointer"
                  style={{ border: "1px solid rgba(255, 255, 255, 0.32)" }}
                  onClick={() => setClaimFeesShow(true)}
                >
                  {t("lendingTable.tab3_button")}
                </div>
              </div>
            ) : null}
          </>
        ) : (
          "--"
        );
      },
    },
    {
      title: t("lendingTable.tab4"),
      dataIndex: "",
      key: "",
      render: (text: any, record: any) => {
        return (
          <>
            <MyButton
              disabled={!Store.getIsSupportedChain()}
              onClick={() => openLendingDialog(record)}
            >
              {t("lendingTable.tab4_button")}
            </MyButton>
          </>
        );
      },
    },
    {
      title: t("lendingTable.tab5"),
      dataIndex: "",
      key: "",
      render: (text: any, record: any) => {
        return (
          <>
            <div>${thousandSeparator(record.maxLending)}</div>
            {Store.getIsSupportedChain() ? (
              <div>{record.lendingRate}%</div>
            ) : null}
          </>
        );
      },
    },
    {
      title: t("lendingTable.tab6"),
      dataIndex: "",
      key: "",
      render: (text: any, row: any) => {
        return Store.getIsSupportedChain() ? (
          <div className="flex items-center gap-x-1">
            <span className="text-white">
              ${thousandSeparator(row.nowLending)}
            </span>
            <HealthDegree lev={healthDegrees[row.tokenId] || 0} />
          </div>
        ) : (
          "--"
        );
      },
    },
    {
      title: t("lendingTable.tab7"),
      dataIndex: "",
      align: "right",
      key: "",
      render: (text: any, record: any) => {
        return (
          <div className="flex items-center justify-end">
            <MyButton disabled={!Store.getIsSupportedChain()}>
              {t("lendingTable.tab7_button1", {
                token: record.title.split("/")[0],
              })}
            </MyButton>
            <div
              className="rounded-lg ml-1 cursor-pointer"
              style={{
                padding: "6px 10px",
                border: "1px solid rgba(255, 255, 255, 0.32)",
                opacity: !Store.getIsSupportedChain() ? "0.5" : "1",
              }}
            >
              {t("lendingTable.tab7_button2")}
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
  const openLendingDialog = (row: any) => {
    setActionRow(row);
    setLendingDialogShow(true);
  };
  return (
    <>
      <LendingAndDepositTable
        title={t("lendingTable.title")}
        columns={lendingColumns}
        data={lendingData}
        expandedRowKeys={expandedRowKeys}
      />
      <MyModal
        width={580}
        open={claimFeesShow}
        onCancel={() => setClaimFeesShow(false)}
        title={t("claimFees.title")}
      >
        <ClaimFeesTable
          setSelectRows={(keys: any) => setSelectRows(keys)}
          selectRows={selectRows}
          columns={ClaimFeesColumns}
          data={ClaimFeesData}
        />
      </MyModal>
      <MyModal
        width={500}
        open={lendingDialogShow}
        onCancel={() => setLendingDialogShow(false)}
        title={
          lendingDialogType === 3
            ? t("lendingTable.repaymentDialog.title")
            : t("lendingTable.lendingDialog.title")
        }
      >
        <LendingDialog actionRow={actionRow} type={lendingDialogType} />
      </MyModal>
    </>
  );
});
