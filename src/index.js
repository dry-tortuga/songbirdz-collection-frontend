import React from "react";
import { createRoot } from "react-dom/client";
import { OnchainKitProvider } from "@coinbase/onchainkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { base, baseSepolia, hardhat } from "viem/chains";
import { WagmiProvider } from "wagmi";

import App from "./App";
import config from "./config";
import { FarcasterProvider } from "./contexts/farcaster";

import "@coinbase/onchainkit/styles.css";
import "bootswatch/dist/sketchy/bootstrap.min.css";
import "./index.css";

const ONCHAIN_KIT_API_KEY = process.env.REACT_APP_COINBASE_DEV_PLATFORM_API_KEY;
const CB_DEV_PLATFORM_PROJECT_ID = process.env.REACT_APP_COINBASE_DEV_PLATFORM_PROJECT_ID;
const RPC_NETWORK_URL = process.env.REACT_APP_BASE_NETWORK_RPC_URL;

const queryClient = new QueryClient();

const container = document.getElementById("root");

const root = createRoot(container);

let chain = base;

if (process.env.REACT_APP_NODE_ENV === "development") {
	chain = hardhat;
} else if (process.env.REACT_APP_NODE_ENV === "staging") {
	chain = baseSepolia;
}

console.debug(process.env.REACT_APP_NODE_ENV);
console.debug(chain);
console.debug(RPC_NETWORK_URL);

root.render(
	<React.StrictMode>
		<WagmiProvider config={config}>
			<QueryClientProvider client={queryClient}>
				<OnchainKitProvider
					apiKey={ONCHAIN_KIT_API_KEY}
					projectId={CB_DEV_PLATFORM_PROJECT_ID}
					chain={chain}
					config={{
						analytics: false,
						appearance: {
							name: 'Songbirdz',
							logo: "https://songbirdz.cc/android-chrome-192x192.png",
						},
						paymaster: process.env.REACT_APP_COINBASE_PAYMASTER_AND_BUNDLER_ENDPOINT,
						wallet: {
							display: 'modal',
							// termsUrl: 'https://...',
							// privacyUrl: 'https://...',
						},
					}}
					rpcUrl={RPC_NETWORK_URL}>
					<FarcasterProvider>
						<App />
					</FarcasterProvider>
				</OnchainKitProvider>
			</QueryClientProvider>
		</WagmiProvider>
	</React.StrictMode>,
);
