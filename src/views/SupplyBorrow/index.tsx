import { useStore } from "@/store";
import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router-dom";
import CenterContent from "@/components/CenterContent";
import Header from "@/components/Header";
import { useTranslation } from "react-i18next";
import { thousandSeparator } from "@/hook/utils/addressFormat";
import { InfoCircleOutlined } from "@ant-design/icons";
import MyModal from "@/components/MyModal";
import { useEffect, useState } from "react";
import QuickSwapDialog from "./QuickSwapDialog";
import ClaimFeesTable from "@/components/ClaimFeesTable";
import { Button, Tooltip } from "antd";
import Lending from "./Lending";
import { PeripheryContract } from "@/hook/web3/apeContract";
function SupplyBorrow() {
  const { Store } = useStore();
  const { t } = useTranslation("translations");
  const [quickSwapShow, setQuickSwapShow] = useState(false);
  const [claimFeesShow, setClaimFeesShow] = useState(false);
  const [selectRows, setSelectRows] = useState([]);
  const [statisticalData, setStatisticalData] = useState({
    totalMortgageAmount: 7271762876.38,
    totalBorrowAmount: 36982.12,
    totalDepositAmount: 36982.12,
    myMortgageAmount: 1,
    myBorrowAmount: 36982.12,
    myUnclaimedEarnings: 0,
    myDepositAmount: 0,
    cumulativeGain: 0,
  });
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
  useEffect(() => {
    init();
  }, [Store.getIsSupportedChain(), Store.getIsContacted()]);
  const init = async () => {
    let newObj = { ...statisticalData };
    if (Store.getIsSupportedChain()) {
      const contract = PeripheryContract();
      const LPTokens = await contract.getSupportLPTokens();
      newObj.myBorrowAmount = await LPTokens.reduce(
        async (acc: number, token: string) => {
          const userTotalLPToken =
            await contract.previewUserTotalLoanPerLPToken(
              token,
              Store.walletInfo.address
            );
          return (acc += parseInt(userTotalLPToken._hex, 16));
        },
        0
      );
      newObj.myMortgageAmount = await LPTokens.reduce(
        async (acc: number, token: string) => {
          const userTotalLPToken =
            await contract.previewUserTotalLPValuePerLPToken(
              token,
              Store.walletInfo.address
            );
          return (acc += parseInt(userTotalLPToken._hex, 16));
        },
        0
      );
      setStatisticalData(newObj);
      // newObj.totalBorrowAmount = parseInt(previewProtTotalLoan._hex, 16)
      // console.log(previewProtTotalLoan);
    }
  };
  const openQuickSwap = () => {
    if (Store.getIsSupportedChain()) {
      setQuickSwapShow(true);
    }
  };
  return (
    <CenterContent>
      <Header />
      <div className="w-full flex gap-x-2 mt-6">
        <div
          className="w-full p-4 rounded-lg text-white"
          style={{
            border: "1px solid rgba(255, 255, 255, 0.2)",
            background: "#151619",
          }}
        >
          <div className="font-bold">{t("supplyBorrowData.title1")}</div>
          <div className="mt-4 grid grid-cols-3">
            <div>
              <div className="opacity-50">{t("supplyBorrowData.tab1")}</div>
              <div className="mt-2 font-bold text-18">
                ${thousandSeparator(statisticalData.totalMortgageAmount)}
              </div>
            </div>
            <div
              className="pl-6"
              style={{ borderLeft: "1px solid rgba(255, 255, 255, 0.2)" }}
            >
              <div className="opacity-50">{t("supplyBorrowData.tab1_2")}</div>
              <div className="mt-2 font-bold text-18">
                ${thousandSeparator(statisticalData.totalBorrowAmount)}
              </div>
            </div>
            <div
              className="pl-6"
              style={{ borderLeft: "1px solid rgba(255, 255, 255, 0.2)" }}
            >
              <div className="opacity-50">{t("supplyBorrowData.tab1_3")}</div>
              <div className="mt-2 font-bold text-18">
                ${thousandSeparator(statisticalData.totalDepositAmount)}
              </div>
            </div>
          </div>
          <div
            onClick={openQuickSwap}
            className="w-full mt-6 cursor-pointer transition-all pt-3 pb-3 text-center bg-white rounded-lg text-black font-bold hover:opacity-80"
          >
            {t("supplyBorrowData.button1")}
          </div>
        </div>
        <div
          className="w-full p-4 rounded-lg text-white"
          style={{
            border: "1px solid rgba(255, 255, 255, 0.2)",
            background: "#151619",
          }}
        >
          <div className="font-bold">{t("supplyBorrowData.title2")}</div>
          <div className="mt-4 grid grid-cols-3 grid-rows-2 gap-y-4">
            <div>
              <div className="opacity-50">{t("supplyBorrowData.tab2_1")}</div>
              <div className="mt-1 font-bold text-18">
                {Store.getIsContacted()
                  ? "$" + thousandSeparator(statisticalData.myMortgageAmount)
                  : "--"}
              </div>
            </div>
            <div
              className="pl-6"
              style={{ borderLeft: "1px solid rgba(255, 255, 255, 0.2)" }}
            >
              <div className="opacity-50">{t("supplyBorrowData.tab2_2")}</div>
              <div className="mt-1 font-bold text-18">
                {Store.getIsContacted()
                  ? "$" + thousandSeparator(statisticalData.myBorrowAmount)
                  : "--"}
              </div>
            </div>
            <div
              className="pl-6"
              style={{ borderLeft: "1px solid rgba(255, 255, 255, 0.2)" }}
            >
              <div className="opacity-50 flex items-center">
                {t("supplyBorrowData.tab2_3")}
                <Tooltip title={t("supplyBorrowData.tips")} color="#30333D">
                  <InfoCircleOutlined className="w-4 h-4 ml-1 cursor-pointer hover:opacity-80" />
                </Tooltip>
              </div>
              <div className="mt-1 font-bold text-18 flex items-center">
                <span>
                  {Store.getIsContacted()
                    ? "$" + thousandSeparator(statisticalData.myBorrowAmount)
                    : "--"}
                </span>
                <div
                  onClick={() => setClaimFeesShow(true)}
                  className="text-12 rounded-lg ml-2 cursor-pointer hover:opacity-80"
                  style={{
                    padding: "6px 10px",
                    color: "rgba(255, 255, 255, 0.32)",
                    border: "1px solid rgba(255, 255, 255, 0.32)",
                  }}
                >
                  {t("supplyBorrowData.button2")}
                </div>
              </div>
            </div>
            <div>
              <div className="opacity-50">{t("supplyBorrowData.tab2_4")}</div>
              <div className="mt-1 font-bold text-18">
                {Store.getIsContacted()
                  ? "$" + thousandSeparator(statisticalData.myDepositAmount)
                  : "--"}
              </div>
            </div>
            <div
              className="pl-6"
              style={{ borderLeft: "1px solid rgba(255, 255, 255, 0.2)" }}
            >
              <div className="opacity-50">{t("supplyBorrowData.tab2_5")}</div>
              <div className="mt-1 font-bold text-18">
                {Store.getIsContacted()
                  ? "$" + thousandSeparator(statisticalData.cumulativeGain)
                  : "--"}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Lending />
      <MyModal
        width={500}
        open={quickSwapShow}
        onCancel={() => setQuickSwapShow(false)}
        title={t("supplyBorrowData.quickSwap.title")}
      >
        <QuickSwapDialog />
      </MyModal>
      <MyModal
        width={580}
        open={claimFeesShow}
        onCancel={() => setClaimFeesShow(false)}
        title={t("claimFees.title")}
      >
        <ClaimFeesTable
          setSelectRows={(keys: any) => setSelectRows(keys)}
          columns={ClaimFeesColumns}
          selectRows={selectRows}
          data={ClaimFeesData}
        />
      </MyModal>
    </CenterContent>
  );
}
export default observer(SupplyBorrow);
