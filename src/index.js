import React from "react";
import { createRoot } from "react-dom/client";
import { OnchainKitProvider } from "@coinbase/onchainkit";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { base, baseSepolia, hardhat } from "viem/chains";
import { WagmiProvider } from "wagmi";

import App from "./App";
import config from "./config";

import "@coinbase/onchainkit/styles.css";
import "@rainbow-me/rainbowkit/styles.css"; 
import "bootswatch/dist/sketchy/bootstrap.min.css";
import "./index.css";

const ONCHAIN_KIT_API_KEY = process.env.REACT_APP_COINBASE_DEV_PLATFORM_API_KEY;

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

root.render(
	<React.StrictMode>
		 <WagmiProvider config={config}>
		 	<QueryClientProvider client={queryClient}>
		 		<OnchainKitProvider
		 			apiKey={ONCHAIN_KIT_API_KEY}
		 			chain={chain}>
		 			<RainbowKitProvider modalSize="compact">
						<App />
					</RainbowKitProvider>
				</OnchainKitProvider>
			</QueryClientProvider>
		</WagmiProvider>
	</React.StrictMode>,
);
