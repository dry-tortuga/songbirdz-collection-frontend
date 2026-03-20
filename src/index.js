import React from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";

import App from "./App";
import config from "./config";
import { FarcasterProvider } from "./contexts/farcaster";

import "bootswatch/dist/sketchy/bootstrap.min.css";
import "./index.css";

const queryClient = new QueryClient();

const container = document.getElementById("root");

const root = createRoot(container);

root.render(
	<React.StrictMode>
		<WagmiProvider config={config}>
			<QueryClientProvider client={queryClient}>
				<FarcasterProvider>
					<App />
				</FarcasterProvider>
			</QueryClientProvider>
		</WagmiProvider>
	</React.StrictMode>,
);
