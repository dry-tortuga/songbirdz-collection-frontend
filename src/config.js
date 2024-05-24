import { http, createConfig } from 'wagmi';
import { base, baseSepolia } from 'wagmi/chains';
import { injected, metaMask, safe, walletConnect } from 'wagmi/connectors';

const projectId = '<WALLETCONNECT_PROJECT_ID>';

const config = createConfig({
	chains: [base, baseSepolia],
	connectors: [
		injected(),
		walletConnect({ projectId }),
		metaMask(),
		safe(),
	],
	transports: {
		[base.id]: http(),
		[baseSepolia.id]: http(),
	},
});

export default config;
