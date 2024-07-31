import supportChains from "@/hook/utils/supportChains";
import { useTranslation } from "react-i18next";
import Lottie from "lottie-react";
import SignOutData from "@/assets/lottie/SignOut.json";
import { changeNetwork } from "@/hook/web3/web3Service";
import useCacheService from "@/hook/utils/useCacheService";
import { useStore } from "@/store";
export default function () {
  const { t } = useTranslation("translations");
  const { Store } = useStore();
  const cacheService = useCacheService();
  const changeToChain = async (item: any) => {
    if (item.supported) {
      if (await changeNetwork(item.id)) {
        location.reload();
      }
    }
  };
  const logOut = () => {
    cacheService.del(Store.walletKey);
    location.reload();
  };
  return (
    <div
      className="w-full text-white rounded-xl"
      style={{
        background: "#151619",
        border: "1px solid rgba(255, 255, 255, 0.12)",
      }}
    >
      {supportChains.map((item: any) => {
        return (
          <div
            className="w-full text-white hover:bg-gray-900 cursor-pointer text-12 flex justify-between items-center"
            style={{ padding: "15px 25px", borderBottom: "1px solid #1b1d20" }}
            key={item.id}
            onClick={() => changeToChain(item)}
          >
            <img className="w-9 h-9" src={item.icon} alt="" />
            <div className="h-full flex text-right flex-col justify-between">
              <div style={{ color: "#9d9d9d" }}>{item.name}</div>
              <div>{t("header.changeNetwork")}</div>
            </div>
          </div>
        );
      })}
      {Store.getIsContacted() ? (
        <div className="pt-4 pb-4 cursor-pointer" onClick={() => logOut()}>
          <Lottie
            className="w-9 h-9 m-auto"
            animationData={SignOutData}
            loop={true}
          />
        </div>
      ) : null}
    </div>
  );
}
