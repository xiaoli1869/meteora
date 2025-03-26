import { ethers } from "ethers";
import Onboard from "@web3-onboard/core";
import injectedModule from "@web3-onboard/injected-wallets";
import bitgetWalletModule from "@web3-onboard/bitget";
import coinbaseWalletModule from "@web3-onboard/coinbase";
import walletConnectModule from "@web3-onboard/walletconnect";
import { chainMap } from "../utils/chainRouter";
import { message } from "antd";
import useCacheService from "../utils/useCacheService";
const cacheService = useCacheService();
let onboard: any = null;
let selectedWallet: any = null;
let provider: any = null;

const ChainCfg: any = {
  10143: {
    chainId: "0x279F",
    chainName: "Monad Testnet",
    nativeCurrency: {
      name: "MON",
      symbol: "MON",
      decimals: 18,
    },
    rpcUrls: ["https://testnet-rpc.monad.xyz/"],
    blockExplorerUrls: ["https://testnet.monadexplorer.com/"],
  },
  11155111: {
    chainId: "0x11155111",
    chainName: "Ethereum Sepolia",
    nativeCurrency: {
      name: "ETH",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: ["https://sepolia.infura.io/v3/"],
    blockExplorerUrls: ["https://sepolia.etherscan.io"],
  },
  1: {
    chainId: "0x1",
    chainName: "Ethereum Mainnet",
    nativeCurrency: {
      name: "ETH",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: ["https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161"],
    blockExplorerUrls: ["https://etherscan.io"],
  },
  3: {
    chainId: "0x3",
    chainName: "Ropsten testNet",
    nativeCurrency: {
      name: "ETH",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: ["https://ropsten.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161"],
    blockExplorerUrls: ["https://ropsten.etherscan.io"],
  },
  5: {
    chainId: "0x5",
    chainName: "Goerli Testnet",
    nativeCurrency: {
      name: "GoerliETH",
      symbol: "GoerliETH",
      decimals: 18,
    },
    rpcUrls: ["https://goerli.infura.io/v3/"],
    blockExplorerUrls: ["https://goerli.etherscan.io"],
  },
  10: {
    chainId: "0xa",
    chainName: "Optimism",
    nativeCurrency: {
      name: "ETH",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: ["https://optimism.publicnode.com"],
    blockExplorerUrls: ["https://optimistic.etherscan.io"],
  },
  42: {
    chainId: "0x2a",
    chainName: "Kovan testNet",
    nativeCurrency: {
      name: "ETH",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: ["https://kovan.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161"],
    blockExplorerUrls: ["https://kovan.etherscan.io"],
  },
  56: {
    chainId: "0x38",
    chainName: "Binance Smart Chain",
    nativeCurrency: {
      name: "BNB",
      symbol: "BNB",
      decimals: 18,
    },
    rpcUrls: ["https://bsc-dataseed.binance.org/"],
    blockExplorerUrls: ["https://bscscan.com/"],
  },
  97: {
    chainId: "0x61",
    chainName: "Binance Smart Chain - TestNet",
    nativeCurrency: {
      name: "BNB",
      symbol: "BNB",
      decimals: 18,
    },
    rpcUrls: ["https://data-seed-prebsc-1-s1.binance.org:8545/"],
    blockExplorerUrls: ["https://testnet.bscscan.com/"],
  },
  137: {
    chainId: "0x89",
    chainName: "Polygon",
    nativeCurrency: {
      name: "MATIC",
      symbol: "MATIC",
      decimals: 18,
    },
    rpcUrls: ["https://polygon-rpc.com/"],
    blockExplorerUrls: ["https://polygonscan.com/"],
  },
  1088: {
    chainId: "0x440",
    chainName: "Maas - TestNet",
    nativeCurrency: {
      name: "Maas",
      symbol: "Maas",
      decimals: 18,
    },
    rpcUrls: ["https://maas-test-node.onchain.com/"],
    blockExplorerUrls: ["https://maas-test-explorer.onchain.com/"],
  },
  2088: {
    chainId: "0x828",
    chainName: "Maas",
    nativeCurrency: {
      name: "Maas",
      symbol: "Maas",
      decimals: 18,
    },
    rpcUrls: ["https://maas-node.onchain.com/"],
    blockExplorerUrls: ["https://maas-explorer.onchain.com/"],
  },
  42161: {
    chainId: "0xa4b1",
    chainName: "Arbitrum",
    nativeCurrency: {
      name: "ETH",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: ["https://arb1.arbitrum.io/rpc"],
    blockExplorerUrls: ["https://arbiscan.io/"],
  },
  168587773: {
    chainId: "0xa0c71fd",
    chainName: "Blast Sepolia",
    nativeCurrency: {
      name: "ETH",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: ["https://sepolia.blast.io"],
    blockExplorerUrls: ["https://testnet.blastscan.io/"],
  },
  81457: {
    chainId: "0x13E31",
    chainName: "Blast",
    nativeCurrency: {
      name: "ETH",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: ["https://rpc.blast.io"],
    blockExplorerUrls: ["https://blastscan.io/"],
  },
  185: {
    chainId: "0xB9",
    chainName: "Mint",
    nativeCurrency: {
      name: "ETH",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: ["https://rpc.mintchain.io"],
    blockExplorerUrls: ["https://explorer.mintchain.io/"],
  },
};
const chains = [
  {
    id: 1,
    token: "ETH",
    label: "Ethereum Mainnet",
    rpcUrl: "https://rpc.ankr.com/eth",
  },
  {
    id: 42161,
    token: "ETH",
    label: "Arbitrum One",
    rpcUrl: "https://rpc.ankr.com/arbitrum",
  },
  {
    id: 10,
    token: "ETH",
    label: "Optimism",
    rpcUrl: "https://rpc.ankr.com/optimism",
  },
  {
    id: 137,
    token: "MATIC",
    label: "Polygon",
    rpcUrl: "https://rpc.ankr.com/polygon",
  },
  {
    id: 81457,
    token: "ETH",
    label: "Blast",
    rpcUrl: "https://rpc.ankr.com/blast",
  },
  {
    id: 185,
    token: "ETH",
    label: "Mint",
    rpcUrl: "https://rpc.mintchain.io",
  },
];
const appMetadata = {
  name: "LiquiX",
  icon:
    '<svg width="160" height="160" viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg">\n' +
    '<rect width="160" height="160" rx="80" fill="black"/>\n' +
    '<path fill-rule="evenodd" clip-rule="evenodd" d="M111.547 40.9998H91.1849L36.0005 118.627L55.8091 118.627H77.3866L89.214 102.008H68.1765L111.547 40.9998ZM67.7958 61.4255C72.3599 61.4255 76.0598 57.7256 76.0598 53.1615C76.0598 48.5974 72.3599 44.8975 67.7958 44.8975C63.2317 44.8975 59.5317 48.5974 59.5317 53.1615C59.5317 57.7256 63.2317 61.4255 67.7958 61.4255ZM93.2584 73.7732L83.0884 88.3901L104.32 118.627H124.445L93.2584 73.7732Z" fill="#84FFE1"/>\n' +
    "</svg>",
  logo:
    '<svg width="160" height="160" viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg">\n' +
    '<path fill-rule="evenodd" clip-rule="evenodd" d="M130.474 17.6H97.8951L9.60001 141.804L41.2938 141.804H75.8178L94.7416 115.214H61.0816L130.474 17.6ZM60.4725 50.2813C67.775 50.2813 73.6949 44.3614 73.6949 37.0588C73.6949 29.7562 67.775 23.8363 60.4725 23.8363C53.1699 23.8363 47.25 29.7562 47.25 37.0588C47.25 44.3614 53.1699 50.2813 60.4725 50.2813ZM101.213 70.0375L84.9406 93.4245L118.911 141.804H151.111L101.213 70.0375Z" fill="white"/>\n' +
    "</svg>",
  description: "LiquiX-Unlock All Liquidity Possibilities",
  recommendedInjectedWallets: [
    { name: "OKX Wallet", url: "https://www.okx.com/web3" },
    { name: "MetaMask", url: "https://metamask.io" },
  ],
};
async function resetProvider(Store: any) {
  provider = null;
  if (onboard && selectedWallet) {
    await onboard.disconnectWallet({
      label: selectedWallet.label,
    });
  }
  onboard = null;
  selectedWallet = null;
  cacheService.del(Store.walletKey);
}
export async function initBlockNative(Store: any) {
  const injected = injectedModule();
  const bitgetWallet = bitgetWalletModule();
  const coinbaseWalletSdk = coinbaseWalletModule({ darkMode: true });
  const wcInitOptions = {
    projectId: "f300e69d6cc8505af4cdce5e75e8210a",
    requiredChains: [42161, 10, 137, 81457, 185],
    optionalChains: [1, 42161, 10, 137, 81457, 185],
    dappUrl: "https://app.liquix.finance",
  };
  const walletConnect = walletConnectModule(wcInitOptions);
  const wallets = [injected, walletConnect, coinbaseWalletSdk, bitgetWallet];
  onboard = Onboard({
    theme: "dark",
    wallets,
    chains,
    appMetadata,
    accountCenter: {
      desktop: {
        enabled: true,
        minimal: true,
      },
      mobile: {
        enabled: true,
        minimal: true,
      },
    },
  });
  const lastWallet = cacheService.get(Store.walletKey);
  const connectedWallets = lastWallet
    ? await onboard.connectWallet({
        autoSelect: {
          label: "MetaMask",
          disableModals: false,
        },
      })
    : await onboard.connectWallet();
  const walletStatus = onboard.state.select("wallets");
  walletStatus.subscribe(async (updatedWallets: any) => {
    if (updatedWallets && updatedWallets.length === 0) {
      await resetProvider(Store);
    }
  });
  if (connectedWallets.length > 0) {
    selectedWallet = connectedWallets[0];
    cacheService.set(
      Store.walletKey,
      selectedWallet.label,
      1000 * 60 * 60 * 24 * 365
    );
    provider = new ethers.providers.Web3Provider(
      selectedWallet.provider,
      "any"
    );
    const network = await provider.getNetwork();
    if (!chainMap[network.chainId]) {
      Store.openNetworkSelect();
    } else {
      provider
        .send("eth_requestAccounts", [])
        .then(async () => {
          const address = await provider.getSigner().getAddress();
          Store.setWalletInfo({
            networkId: network.chainId,
            networkIcon: chainMap[network.chainId].icon,
            networkName: chainMap[network.chainId].name,
            networkSymbol: chainMap[network.chainId].symbol,
            address: address,
            balance:
              (await provider.getBalance(address, "latest")) / Math.pow(10, 18),
          });
          (window as any).ethereum.on("accountsChanged", () => {
            location.reload();
          });
          (window as any).ethereum.on("chainChanged", () => {
            location.reload();
          });
        })
        .catch(async () => {
          await resetProvider(Store);
        });
    }
  }
}
export async function changeNetwork(id: string) {
  let cfg = ChainCfg[id];
  if (!window.ethereum) {
    return false;
  }
  let network = await provider.send("eth_chainId", []);
  const chainId = network.toString();
  if (chainId !== cfg.chainId) {
    console.log(chainId + " " + cfg.chainId + " 1");
  } else {
    console.log(chainId + " " + cfg.chainId + " 2");
    return true;
  }
  try {
    await provider.send("wallet_switchEthereumChain", [
      { chainId: cfg.chainId },
    ]);
    // console.log("-----------------", res);
    return true;
  } catch (err: any) {
    if (err.code === 4902) {
      try {
        await provider.send("wallet_addEthereumChain", [cfg]);
        return true;
      } catch (addError) {
        // console.error(addError);
        return false;
      }
    } else {
      message.info(`${err.message}`);
    }
    return false;
  }
}
export function getProvider(): any {
  return provider;
}
