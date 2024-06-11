import React from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { Buffer } from "buffer";

import App from "./App";
import config from "./config";

import "bootswatch/dist/sketchy/bootstrap.min.css";
import "./index.css";

const queryClient = new QueryClient();

// Polyfill window buffer object for wallet connection logic (TODO)
window.Buffer = window.Buffer || Buffer;

const container = document.getElementById("root");

const root = createRoot(container);

root.render(
	<React.StrictMode>
		 <WagmiProvider config={config}>
		 	<QueryClientProvider client={queryClient}>
				<App />
			</QueryClientProvider>
		</WagmiProvider>
	</React.StrictMode>,
);
