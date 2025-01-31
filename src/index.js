import React, { useEffect } from "react";
import { createRoot } from "react-dom/client";
import { OnchainKitProvider } from "@coinbase/onchainkit";
import FrameSDK from "@farcaster/frame-sdk";
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
const CB_DEV_PLATFORM_PROJECT_ID = process.env.REACT_APP_COINBASE_DEV_PLATFORM_PROJECT_ID;

const queryClient = new QueryClient();

const container = document.getElementById("root");

const root = createRoot(container);

const FarcasterFrameProvider = ({ children }) => {

    useEffect(() => {

        const load = async () => { FrameSDK.actions.ready(); }

        load();

    }, []);

    return children;

};

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
                    projectId={CB_DEV_PLATFORM_PROJECT_ID}
                    chain={chain}
                    config={{
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
                    }}>
		 			<RainbowKitProvider modalSize="compact">
						<FarcasterFrameProvider>
					        <App />
						</FarcasterFrameProvider>
					</RainbowKitProvider>
				</OnchainKitProvider>
			</QueryClientProvider>
		</WagmiProvider>
	</React.StrictMode>,
);
