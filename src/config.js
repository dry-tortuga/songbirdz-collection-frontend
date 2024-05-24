import { http, createConfig } from 'wagmi';
import { base, baseSepolia, hardhat } from 'wagmi/chains';
import { metaMask, walletConnect } from 'wagmi/connectors';

const projectId = '<WALLETCONNECT_PROJECT_ID>';

let chains = [];
let transports = {};

if (process.env.NODE_ENV === 'development') {

	chains.push(hardhat);
	transports[hardhat.id] = http();

} else if (process.env.NODE_ENV === 'staging') {

	chains.push(baseSepolia);
	transports[baseSepolia.id] = http();

} else if (process.env.NODE_ENV === 'production') {

	chains.push(base);
	transports[base.id] = http();

}

const config = createConfig({
	chains,
	connectors: [
		walletConnect({ projectId }),
		metaMask(),
		// cb wallet is included by default
	],
	transports,
});

export default config;
