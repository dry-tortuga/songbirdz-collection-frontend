import { http, createConfig } from "wagmi";
import { base, baseSepolia, hardhat } from "wagmi/chains";
import { coinbaseWallet, metaMask, walletConnect } from "wagmi/connectors";

const walletConnectProjectId = process.env.REACT_APP_WALLET_CONNECT_PROJECT_ID;
const rpcNetworkURL = process.env.REACT_APP_BASE_NETWORK_RPC_URL;

let chains = [];
let transports = {};

if (process.env.NODE_ENV === "development") {

	chains.push(hardhat);
	transports[hardhat.id] = http(rpcNetworkURL);

} else if (process.env.NODE_ENV === "staging") {

	chains.push(baseSepolia);
	transports[baseSepolia.id] = http(rpcNetworkURL);

} else if (process.env.NODE_ENV === "production") {

	chains.push(base);
	transports[base.id] = http(rpcNetworkURL);

}

const config = createConfig({
	chains,
	connectors: [
		coinbaseWallet({
			appName: "Songbirdz",
			appLogoUrl: "https://songbirdz.cc/android-chrome-192x192.png",
			preference: "smartWalletOnly",
		}),
		walletConnect({ projectId: walletConnectProjectId }),
		metaMask(),
	],
	transports,
});

export default config;
