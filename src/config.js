import { farcasterFrame } from "@farcaster/frame-wagmi-connector/dist/connector.js";
import { connectorsForWallets, getDefaultConfig } from "@rainbow-me/rainbowkit";
import {
	coinbaseWallet,
	injectedWallet,
	metaMaskWallet,
	rainbowWallet,
	walletConnectWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { http } from "wagmi";
import { base, baseSepolia, hardhat } from "wagmi/chains";

const walletConnectProjectId = process.env.REACT_APP_WALLET_CONNECT_PROJECT_ID;
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

const connectors = connectorsForWallets(
	[{
		groupName: "Recommended Wallet",
		wallets: [coinbaseWallet],
	}, {
		groupName: "Other Wallets",
		wallets: [rainbowWallet, metaMaskWallet, walletConnectWallet, injectedWallet],
	}],
	{
		appName: "Songbirdz",
		projectId: walletConnectProjectId,
	},
);

console.debug(process.env.REACT_APP_NODE_ENV);
console.debug(chains);

const config = getDefaultConfig({
	appName: "Songbirdz",
	appLogoUrl: "https://songbirdz.cc/android-chrome-192x192.png",
	chains,
	connectors: [farcasterFrame(), ...connectors],
	projectId: walletConnectProjectId,
	transports,
});

export default config;
