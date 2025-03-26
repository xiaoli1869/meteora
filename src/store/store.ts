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
  contract = null;
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
    // return true;
  }
  getIsContacted() {
    return this.walletInfo.address !== "";
  }
  setOpenNetworkSelect(fc: () => void) {
    this.openNetworkSelect = fc;
  }
  setContract(contract: any) {
    this.contract = contract;
  }
}

const store = new Store();
export default store;
