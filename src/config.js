import { farcasterFrame } from "@farcaster/frame-wagmi-connector/dist/connector.js";
import { createConfig, http } from "wagmi";
import { base, baseSepolia, hardhat } from "wagmi/chains";
import {
    coinbaseWallet,
    metaMask,
    injected,
} from "wagmi/connectors";

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

const config = createConfig({
    chains,
    connectors: [
        farcasterFrame(),
        injected(),
        metaMask(),
        coinbaseWallet({
            appName: "Songbirdz",
            appLogoUrl: "https://songbirdz.cc/android-chrome-192x192.png",
            preference: 'all',
        }),
    ],
    transports,
});

export default config;
