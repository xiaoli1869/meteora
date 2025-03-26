import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next";
import MyButton from "@/components/MyButton";
import { useEffect, useState } from "react";
import { thousandSeparator } from "@/hook/utils/addressFormat";
import { LPLendContract } from "@/hook/web3/apeContract";
import {
  getPositionIds,
  mintPosition,
} from "../../../hook/web3/libs/positions";
import { TransactionState } from "../../../hook/web3/libs/providers";
import { ethers } from "ethers";
import {
  ERC20_ABI,
  LPLContractAddress,
  NONFUNGIBLE_POSITION_MANAGER_CONTRACT_ADDRESS,
  USDS_TOKEN,
} from "../../../hook/web3/libs/constants";
import { getProvider } from "../../../hook/web3/web3Service";
import { useStore } from "../../../store";
import ERC721ABI from "@/hook/web3/abi/ERC721.json";
import { message } from "antd";
import {
  formatUnitsDecimal,
  parseUnitsDecimal,
} from "../../../hook/utils/addressFormat";

type propsType = {
  type: number;
  actionRow: any;
  close: () => void;
};
export default observer(function ({ actionRow, type, close }: propsType) {
  const { t } = useTranslation("translations");
  const [inpValue, setInpValue] = useState("0");
  const [buttonLoading, setButtonLoading] = useState(false);
  const [usdsBalance, setUsdsBalance] = useState(0);
  const { Store } = useStore();
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
      setInpValue((actionRow.LPObj.maxLending * value).toFixed(2));
    } else if (type === 2) {
      setInpValue(
        (
          (actionRow.LPObj.maxLending - actionRow.LPObj.nowLending) *
          value
        ).toFixed(2)
      );
    } else if (type === 3) {
      setInpValue((actionRow.LPObj.nowLending * value).toFixed(2));
    }
  };
  const buttonClick = async () => {
    setButtonLoading(true);
    if (type === 1) {
      const mint = await mintPosition();
      if (mint === TransactionState.Sent) {
        let positionId = await getPositionIds();
        positionId = ethers.BigNumber.from(positionId).toNumber();
        const approveContract = new ethers.Contract(
          NONFUNGIBLE_POSITION_MANAGER_CONTRACT_ADDRESS,
          ERC721ABI,
          getProvider().getSigner()
        );
        try {
          const approveTx = await approveContract.approve(
            LPLContractAddress,
            positionId
          );
          await approveTx.wait();
          const supply = await LPLendContract().supply(
            NONFUNGIBLE_POSITION_MANAGER_CONTRACT_ADDRESS,
            positionId,
            parseUnitsDecimal(inpValue, 18)
          );
          await supply.wait();
          if (supply.hash) {
            message.success(t("message.success"));
            close();
          }
        } catch (error) {
          console.log(error);
        } finally {
          setButtonLoading(false);
        }
      } else {
        setButtonLoading(false);
      }
    } else if (type === 2) {
      try {
        const lend = await LPLendContract().lend(
          NONFUNGIBLE_POSITION_MANAGER_CONTRACT_ADDRESS,
          actionRow.LPObj.tokenId,
          parseUnitsDecimal(inpValue, 18)
        );
        await lend.wait();
        if (lend.hash) {
          message.success(t("message.success"));
          close();
        }
      } catch (error) {
        console.log(error);
      } finally {
        setButtonLoading(false);
      }
    } else if (type === 3) {
      try {
        const repay = await LPLendContract().repay(
          NONFUNGIBLE_POSITION_MANAGER_CONTRACT_ADDRESS,
          actionRow.LPObj.tokenId,
          parseUnitsDecimal(inpValue, 18)
        );
        await repay.wait();
        if (repay.hash) {
          message.success(t("message.success"));
          close();
        }
      } catch (error) {
        console.log(error);
      } finally {
        setButtonLoading(false);
      }
    }
  };
  useEffect(() => {
    init();
  }, []);
  async function init() {
    if (type === 3) {
      const balanceContract = new ethers.Contract(
        USDS_TOKEN.address,
        ERC20_ABI,
        getProvider().getSigner()
      );
      const balance = await balanceContract.balanceOf(Store.walletInfo.address);
      setUsdsBalance(formatUnitsDecimal(balance, 18));
    }
  }
  return (
    <>
      <div className="flex items-center text-white">
        <img className="w-9 h-9 rounded-full" src={actionRow.icon1} alt="" />
        <img
          className="w-9 h-9 -ml-4 rounded-full"
          src={actionRow.icon2}
          alt=""
        />
        <div className="ml-2">
          <div className="text-20 font-bold">{actionRow.title}</div>
          <div className="opacity-80">ID:{actionRow.LPObj.tokenId}</div>
        </div>
      </div>
      <div
        className="p-4 rounded-lg text-white"
        style={{ background: "#0E0E0F" }}
      >
        <div className="w-full opacity-80 flex items-center justify-between">
          <span>
            {type === 3
              ? t("lendingTable.repaymentDialog.amount")
              : t("lendingTable.lendingDialog.amount")}
          </span>
          {type === 1 ? null : (
            <span>
              {type === 3
                ? t("lendingTable.repaymentDialog.availableAmount", {
                    num: thousandSeparator(usdsBalance),
                  })
                : t("lendingTable.lendingDialog.remainingLending", {
                    num:
                      actionRow.LPObj.maxLending - actionRow.LPObj.nowLending,
                  })}
            </span>
          )}
        </div>

        <div className="flex w-full mt-3 justify-between items-center">
          <input
            className="text-24 w-52  text-white font-bold"
            type="text"
            value={inpValue}
            onChange={(e) => {
              let val;
              if (type === 3) {
                val =
                  Number(e.target.value) > actionRow.LPObj.nowLending
                    ? actionRow.LPObj.nowLending
                    : e.target.value;
              } else {
                val =
                  Number(e.target.value) > actionRow.LPObj.maxLending
                    ? actionRow.LPObj.maxLending
                    : e.target.value;
              }
              setInpValue(val);
            }}
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
      <div className="flex mt-3 items-center text-white justify-between">
        <span className="opacity-50">
          {type === 3
            ? t("lendingTable.repaymentDialog.value")
            : t("lendingTable.lendingDialog.value")}
        </span>
        <span>${thousandSeparator(actionRow.LPObj.myPositions)}</span>
      </div>
      {type === 1 ? (
        <div className="flex mt-3 items-center text-white justify-between">
          <span className="opacity-50">
            {t("lendingTable.lendingDialog.lendingRate")}
          </span>
          <span>{actionRow.LPObj.lendingRate * 100}%</span>
        </div>
      ) : null}
      {type !== 3 ? (
        <div className="flex mt-3 mb-10 items-center text-white justify-between">
          <span className="opacity-50">
            {t("lendingTable.lendingDialog.maxLending")}
          </span>
          <span>{thousandSeparator(actionRow.LPObj.maxLending)} USDS</span>
        </div>
      ) : (
        <div className="flex mt-3 mb-10 items-center text-white justify-between">
          <span className="opacity-50">
            {t("lendingTable.repaymentDialog.currentLoans")}
          </span>
          <span>{actionRow.LPObj.nowLending} USDS</span>
        </div>
      )}

      {type === 1 ? (
        <div className="mb-2 text-center text-white opacity-50">
          {t("lendingTable.lendingDialog.tips")}
        </div>
      ) : null}
      <MyButton
        className=" w-full text-18 font-bold h-14"
        disabled={!(Number(inpValue) > 0)}
        onClick={buttonClick}
        loading={buttonLoading}
      >
        {type === 1
          ? t("lendingTable.lendingDialog.button")
          : type === 2
          ? t("lendingTable.lendingDialog.button1")
          : t("lendingTable.repaymentDialog.button")}
      </MyButton>
    </>
  );
});
