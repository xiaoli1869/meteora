import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next";
import MyButton from "../../../components/MyButton";
type propsType = {
  type: number;
};
export default observer(function (props: propsType) {
  const { t } = useTranslation("translations");
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
  return (
    <>
      <div className="flex items-center text-white">
        <img className="w-9 h-9 rounded-full" src="" alt="" />
        <img className="w-9 h-9 -ml-4 rounded-full" src="" alt="" />
        <div className="ml-2">
          <div className="text-20 font-bold">SHUSHI / BTC</div>
          <div className="opacity-80">ID:{2913460}</div>
        </div>
      </div>
      <div
        className="p-4 rounded-lg text-white"
        style={{ background: "#0E0E0F" }}
      >
        <div className="w-full opacity-80 flex items-center justify-between">
          <span>
            {props.type === 3
              ? t("lendingTable.repaymentDialog.amount")
              : t("lendingTable.lendingDialog.amount")}
          </span>
          {props.type === 1 ? null : (
            <span>
              {props.type === 3
                ? t("lendingTable.repaymentDialog.availableAmount", {
                    num: 300.182,
                  })
                : t("lendingTable.lendingDialog.remainingLending", {
                    num: 300.182,
                  })}
            </span>
          )}
        </div>

        <div className="flex w-full mt-3 justify-between items-center">
          <input
            className="text-24 w-52  text-white font-bold"
            type="text"
            value={0}
          />
          <div className="text-white flex items-center gap-x-1">
            {proportionList.map((item) => {
              return (
                <div
                  className="border-solid cursor-pointer border-lxl-1 border-black hover:border-white rounded-md whitespace-nowrap"
                  style={{ padding: "8px 12px" }}
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
          {props.type === 3
            ? t("lendingTable.repaymentDialog.value")
            : t("lendingTable.lendingDialog.value")}
        </span>
        <span>${500}</span>
      </div>
      {props.type === 1 ? (
        <div className="flex mt-3 items-center text-white justify-between">
          <span className="opacity-50">
            {t("lendingTable.lendingDialog.lendingRate")}
          </span>
          <span>{70}%</span>
        </div>
      ) : null}
      {props.type !== 3 ? (
        <div className="flex mt-3 mb-10 items-center text-white justify-between">
          <span className="opacity-50">
            {t("lendingTable.lendingDialog.maxLending")}
          </span>
          <span>{500} USDS</span>
        </div>
      ) : (
        <div className="flex mt-3 mb-10 items-center text-white justify-between">
          <span className="opacity-50">
            {t("lendingTable.repaymentDialog.currentLoans")}
          </span>
          <span>{500} USDS</span>
        </div>
      )}

      {props.type === 1 ? (
        <div className="mb-2 text-center text-white opacity-50">
          {t("lendingTable.lendingDialog.tips")}
        </div>
      ) : null}
      <MyButton className=" w-full text-18 font-bold h-14">
        {props.type === 1
          ? t("lendingTable.lendingDialog.button")
          : props.type === 2
          ? t("lendingTable.lendingDialog.button1")
          : t("lendingTable.repaymentDialog.button")}
      </MyButton>
    </>
  );
});
