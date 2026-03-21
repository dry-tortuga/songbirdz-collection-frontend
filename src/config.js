import { farcasterFrame } from "@farcaster/frame-wagmi-connector";
import { connectorsForWallets } from "@rainbow-me/rainbowkit";
import {
	baseAccount,
	metaMaskWallet,
	injectedWallet,
	rainbowWallet,
	walletConnectWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { Attribution } from "ox/erc8021";
import { createConfig, http } from "wagmi";
import { base, baseSepolia, hardhat } from "wagmi/chains";

const rpcNetworkURL = process.env.REACT_APP_BASE_NETWORK_RPC_URL;

let chains = [];
let transports = {};

if (process.env.REACT_APP_NODE_ENV === "development") {
	chains.push(hardhat);
	transports[hardhat.id] = http(rpcNetworkURL);
} else if (process.env.REACT_APP_NODE_ENV === "staging") {
	chains.push(baseSepolia);
	transports[baseSepolia.id] = http(rpcNetworkURL);
} else if (process.env.REACT_APP_NODE_ENV === "production") {
	chains.push(base);
	transports[base.id] = http(rpcNetworkURL);
}

console.debug(process.env.REACT_APP_NODE_ENV);
console.debug(chains);
console.debug(transports);

// Optional: configure paymaster for sponsorship
baseAccount.paymasterUrls = {
	[base.id]: process.env.REACT_APP_COINBASE_PAYMASTER_AND_BUNDLER_ENDPOINT,
};

// Optional: configure sub-accounts
//baseAccount.subAccounts = {
 // creation: "on-connect",
//  defaultAccount: "sub",
 // funding: "spend-permissions",
// };

const connectors = connectorsForWallets(
	[
		{
			groupName: "Recommended",
			wallets: [baseAccount, metaMaskWallet, rainbowWallet, walletConnectWallet, injectedWallet],
		},
	],
	{
		appName: "Songbirdz",
		appLogoUrl: "https://songbirdz.cc/android-chrome-192x192.png",
		projectId: process.env.REACT_APP_WALLETCONNECT_PROJECT_ID,
	}
);

const config = createConfig({
	chains,
	connectors: [...connectors, farcasterFrame()],
	transports,
	dataSuffix: Attribution.toDataSuffix({
		codes: [process.env.REACT_APP_BASE_DEV_BUILDER_CODE],
	}),
});

export default config;
