import { makeAutoObservable } from "mobx";
import supportChains from "@/hook/utils/supportChains";
class Store {
  walletInfo = {
    networkId: null,
    networkIcon: "",
    networkName: "",
    networkSymbol: "",
    address: "",
    balance: 0.0,
  };
  openNetworkSelect = () => {};
  walletKey = "WALLET-CONNECTOR";
  constructor() {
    makeAutoObservable(this);
  }
  setWalletInfo(walletInfo: any) {
    this.walletInfo = { ...walletInfo };
  }
  getIsSupportedChain() {
    return Boolean(
      supportChains.find(
        (item: {
          id: number;
          name: string;
          symbol: string;
          icon: string;
          supported: boolean;
          explorer: string;
        }) => {
          return item.id === this.walletInfo.networkId;
        }
      )
    );
  }
  getIsContacted() {
    return this.walletInfo.address !== "";
  }
  setOpenNetworkSelect(fc: () => void) {
    this.openNetworkSelect = fc;
  }
}

const store = new Store();
export default store;
