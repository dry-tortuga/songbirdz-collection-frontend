import React from "react";
import { createRoot } from "react-dom/client";
import { OnchainKitProvider } from "@coinbase/onchainkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { base } from "viem/chains"; // TODO: Update to support hardhat, testnet, mainnet
import { WagmiProvider } from "wagmi";

import App from "./App";
import config from "./config";

import '@coinbase/onchainkit/styles.css';
import "bootswatch/dist/sketchy/bootstrap.min.css";
import "./index.css";

const ONCHAIN_KIT_API_KEY = process.env.REACT_APP_COINBASE_DEV_PLATFORM_API_KEY;

const queryClient = new QueryClient();

const container = document.getElementById("root");

const root = createRoot(container);

root.render(
	<React.StrictMode>
		 <WagmiProvider config={config}>
		 	<QueryClientProvider client={queryClient}>
		 		<OnchainKitProvider
		 			apiKey={ONCHAIN_KIT_API_KEY}
		 			chain={base}>
					<App />
				</OnchainKitProvider>
			</QueryClientProvider>
		</WagmiProvider>
	</React.StrictMode>,
);
