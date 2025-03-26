import { observer } from "mobx-react-lite";
import { useStore } from "@/store";
import LendingAndDepositTable from "@/components/LendingAndDepositTable";
import { useTranslation } from "react-i18next";
import { LendingList } from "@/hook/utils/pool";
import { thousandSeparator } from "@/hook/utils/addressFormat";
import MyButton from "@/components/MyButton";
import { DownOutlined, UpOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import MyModal from "../../../components/MyModal";
import ClaimFeesTable from "../../../components/ClaimFeesTable";
import LendingDialog from "./LendingDialog";
import {
  LPLendContract,
  PeripheryContract,
} from "../../../hook/web3/apeContract";
import { ethers } from "ethers";
import { formatUnitsDecimal } from "../../../hook/utils/addressFormat";

export default observer(function () {
  const { t } = useTranslation("translations");
  const [expandedRowKeys, setExpandedRowKeys] = useState<any>([]);
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
    return (
      <div className="flex gap-x-0.5" key={Date.now()}>
        {content}
      </div>
    );
  };
  const handleExpand = (record: any) => {
    if (!Store.getIsSupportedChain()) {
      return;
    }
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
            {row.isLP ? null : (
              <>
                <img className="w-7 h-7 rounded-full" src={row.icon1} alt="" />
                <img
                  className="w-7 h-7 rounded-full -ml-4"
                  src={row.icon2}
                  alt=""
                />
              </>
            )}
            <span className="ml-2">{text}</span>
            {row?.children ? (
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
            <div className="text-white">{getRender(record, "myPositions")}</div>
            {record.isLP ? null : (
              <div className="text-white opacity-50">
                {t("lendingTable.tab2_1", { num: record?.children?.length })}
              </div>
            )}
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
            <div className="text-white">{getRender(record, "pledge")}</div>
            {record.isLP && record.LPIncome > 0 ? (
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
        return record.isLP ? (
          <MyButton
            disabled={!(Store.getIsSupportedChain() && record.nowLending === 0)}
            onClick={() => openLendingDialog(record, 1)}
          >
            {t("lendingTable.tab4_button")}
          </MyButton>
        ) : null;
      },
    },
    {
      title: t("lendingTable.tab5"),
      dataIndex: "",
      key: "",
      render: (text: any, record: any) => {
        return Store.getIsSupportedChain() ? (
          <>
            <div>{getRender(record, "maxLending").max}</div>
            <div>{getRender(record, "maxLending").lendingRate * 100}%</div>
          </>
        ) : (
          "--"
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
            <span className="text-white">{getRender(row, "nowLending")}</span>
            {row.isLP && row.healthLv !== 0 ? (
              <HealthDegree lev={row.healthLv} />
            ) : null}
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
        return record.isLP ? (
          <div className="flex items-center justify-end">
            <MyButton
              disabled={!(Store.getIsSupportedChain() && record.nowLending > 0)}
              onClick={() => openLendingDialog(record, 2)}
            >
              {t("lendingTable.tab7_button1", {
                token: "USDS",
              })}
            </MyButton>
            <div
              className="rounded-lg ml-1 cursor-pointer"
              style={{
                padding: "6px 10px",
                border: "1px solid rgba(255, 255, 255, 0.32)",
                opacity: !(Store.getIsSupportedChain() && record.nowLending > 0)
                  ? "0.5"
                  : "1",
              }}
              onClick={() => openLendingDialog(record, 3)}
            >
              {t("lendingTable.tab7_button2")}
            </div>
          </div>
        ) : null;
      },
    },
  ];
  const getRender = (row: any, key: string): any => {
    switch (key) {
      case "myPositions":
        if (row.isLP) {
          return "$" + thousandSeparator(row.myPositions);
        } else {
          if (row?.children) {
            return (
              "$" +
              thousandSeparator(
                row.children.reduce((sum: number, item: any) => {
                  return (sum += item.myPositions);
                }, 0)
              )
            );
          } else {
            return "--";
          }
        }
      case "pledge":
        if (row.isLP) {
          return "$" + thousandSeparator(row.pledge);
        } else {
          if (row?.children) {
            return (
              "$" +
              thousandSeparator(
                row.children.reduce((sum: number, item: any) => {
                  return (sum += item.pledge);
                }, 0)
              )
            );
          } else {
            return "--";
          }
        }
      case "LPIncome":
        if (row.isLP) {
          return true;
        } else {
          if (row?.children) {
            return (
              "$" +
              thousandSeparator(
                row.children.reduce((sum: number, item: any) => {
                  return (sum += item.pledge);
                }, 0)
              )
            );
          } else {
            return "--";
          }
        }
      case "maxLending":
        if (row.isLP) {
          return {
            max: "$" + thousandSeparator(row.maxLending),
            lendingRate: row.lendingRate,
          };
        } else {
          if (row?.children) {
            return {
              max:
                "$" +
                thousandSeparator(
                  row.children.reduce((sum: number, item: any) => {
                    return (sum += item.maxLending);
                  }, 0)
                ),
              lendingRate:
                Math.floor(
                  (row.children.reduce((sum: number, item: any) => {
                    return (sum += item.maxLending);
                  }, 0) /
                    row.children.reduce((sum: number, item: any) => {
                      return (sum += item.myPositions);
                    }, 0)) *
                    100
                ) / 100,
            };
          } else {
            return "--";
          }
        }
      case "nowLending":
        if (row.isLP) {
          return "$" + thousandSeparator(row.nowLending);
        } else {
          if (row?.children) {
            return (
              "$" +
              thousandSeparator(
                row.children.reduce((sum: number, item: any) => {
                  return (sum += item.nowLending);
                }, 0)
              )
            );
          } else {
            return "--";
          }
        }
      default:
        break;
    }
  };
  useEffect(() => {
    init();
  }, [Store.getIsSupportedChain()]);
  async function init() {
    if (Store.getIsSupportedChain()) {
      const newLendingData = [...lendingData];
      for (let i = 0; i < newLendingData.length; i++) {
        for (let m = 0; m < newLendingData[i].nft.length; m++) {
          const nftItem = newLendingData[i].nft[m];
          const lpTokenIds = await PeripheryContract().previewProtTokenIds(
            nftItem
          );
          if (lpTokenIds.length > 0) {
            newLendingData[i]["children"] = [];
            for (let n = 0; n < lpTokenIds.length; n++) {
              const lpTokenId = parseInt(lpTokenIds[n]._hex, 16);
              let myPositions = await LPLendContract().previewLPUSDValue(
                nftItem,
                lpTokenId
              );
              myPositions = formatUnitsDecimal(myPositions, 18);
              const previewPositionId =
                await LPLendContract().previewPositionId(
                  Store.walletInfo.address,
                  nftItem,
                  lpTokenId
                );
              const userFee = await LPLendContract().userFee(previewPositionId);
              let nowLending = await LPLendContract().previewUserLending(
                Store.walletInfo.address,
                nftItem,
                lpTokenId
              );
              nowLending = formatUnitsDecimal(nowLending, 18);
              let maxLending = await LPLendContract().previewMaxLoanUSDS(
                Store.walletInfo.address,
                nftItem,
                lpTokenId,
                Boolean(nowLending > 0)
              );
              maxLending = formatUnitsDecimal(maxLending, 18);
              let healthLv = await LPLendContract().previewHealthFactor(
                Store.walletInfo.address,
                nftItem,
                lpTokenId
              );
              // console.log(healthLv)
              // healthLv = ethers.BigNumber.from(
              //   healthLv[healthLv.length - 1]
              // ).toNumber();
              healthLv = 0;
              const obj = {
                title: lpTokenId,
                tokenId: lpTokenId,
                myPositions,
                pledge: nowLending > 0 ? myPositions : 0,
                LPIncome: userFee.reduce((sum: number, item: any) => {
                  return (sum += parseInt(item._hex, 16));
                }, 0),
                maxLending: maxLending,
                lendingRate: Math.floor((maxLending / myPositions) * 100) / 100,
                nowLending: nowLending,
                healthLv,
                isLP: true,
              };
              newLendingData[i]["children"].push(obj);
            }
          }
        }
      }
      setLendingData([...newLendingData]);
    }
  }
  const openLendingDialog = (row: any, type: number) => {
    setLendingDialogType(type);
    let record = null;
    lendingData.forEach((item: any) => {
      item?.children?.forEach((ite: any) => {
        if (ite.tokenId === row.tokenId) {
          record = { ...item, LPObj: { ...ite } };
        }
      });
    });
    console.log(record);
    setActionRow(record || row);
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
        <LendingDialog
          close={() => {
            setLendingDialogShow(false);
            init();
          }}
          actionRow={actionRow}
          type={lendingDialogType}
        />
      </MyModal>
    </>
  );
});
