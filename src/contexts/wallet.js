import React, { useContext, useEffect, useMemo, useState } from "react";
import { useWeb3React, initializeConnector } from "@web3-react/core";
import { CoinbaseWallet } from "@web3-react/coinbase-wallet";
import { MetaMask } from "@web3-react/metamask";
import { Contract } from "ethers";
import { Button, Modal } from "react-bootstrap";

import coinbaseLogo from "../images/logo-coinbase-wallet.png";
import metamaskLogo from "../images/logo-metamask-wallet.png";

import SongBirdzContract from "../abi/SongBirdz.json";

const CHAIN_ID = process.env.REACT_APP_BASE_NETWORK_CHAIN_ID;

const [coinbaseWallet, coinbaseWalletHooks] = initializeConnector((actions) =>
	new CoinbaseWallet({
		actions,
		options: {
			supportedChainIds: [CHAIN_ID],
		},
	})
);

const [metamaskWallet, metamaskWalletHooks] = initializeConnector((actions) =>
	new MetaMask({
		actions,
		options: {
			supportedChainIds: [CHAIN_ID],
		},
	})
);

// https://docs.cloud.coinbase.com/wallet-sdk/docs/web3-react
// https://www.npmjs.com/package/@web3-onboard/core

// https://github.com/Uniswap/web3-react/tree/main#web3-react-beta

export const WALLET_CONNECTORS = [
	[metamaskWallet, metamaskWalletHooks],
	[coinbaseWallet, coinbaseWalletHooks],
];

const WalletContext = React.createContext();

const useWalletContext = () => useContext(WalletContext);

const WalletProvider = ({ children }) => {

	const {
		// ENSName,
		// ENSNames,
		account,
		// accounts,
		chainId,
		connector,
		// hooks,
		// isActivating,
		// isActive,
		provider,
	} = useWeb3React();

	// const metamaskData = useMetamaskWallet();
	// const coinbaseWalletData = useCoinbaseWallet();

	const [isModalOpen, setIsModalOpen] = useState(false);

	const setProvider = (type) => {
		window.localStorage.setItem("provider", type);
	};

	// Attempt to auto-connect to the user's default choice of wallet
	useEffect(() => {

		const provider = window.localStorage.getItem("provider");

		console.debug(`Attempting to auto-connect to ${provider}...`);

		if (provider === "coinbase-wallet") {
		
			// attempt to connect eagerly on mount
			coinbaseWallet.activate(CHAIN_ID).catch(() => {
				console.debug("Failed to connect eagerly to coinbase wallet")
			});

		} else if (provider === "metamask-wallet") {

			metamaskWallet.activate(CHAIN_ID).catch(() => {
				console.debug("Failed to connect eagerly to metamask")
			});

		}

	}, []);

	const songBirdzContract = useMemo(() => {

		if (provider) {

			return new Contract(
				process.env.REACT_APP_SONGBIRDZ_CONTRACT_ADDRESS,
				SongBirdzContract.abi,
				provider,
			);

		}

		return null;

	}, [provider]);

	console.debug("----------------------");
	console.debug(`account=${account}`);
	console.debug(`chainId=${chainId}`);
	console.debug(connector);
	console.debug(provider);
	console.debug(songBirdzContract);
	console.debug("----------------------");

	return (
		<WalletContext.Provider
			value={{
				account,
				chainId,
				songBirdzContract,
				onConnectWallet: () => setIsModalOpen(true),
				onDisconnectWallet: () => {

					if (connector?.deactivate) {
						connector.deactivate()
					} else {
						connector.resetState()
					}

					setProvider(undefined)

				},
			}}>
			{children}
			<Modal
				show={isModalOpen}
				onHide={() => setIsModalOpen(false)}>
				<Modal.Header closeButton>
					<Modal.Title>
						{"Select Wallet"}
					</Modal.Title>
				</Modal.Header>
				<Modal.Body className="d-flex align-items-center">
					<Button
						className="d-flex align-items-center"
						variant="outline"
						w="100%"
						onClick={() => {

							coinbaseWallet.activate(CHAIN_ID)
								.then(() => {

									setProvider("coinbase-wallet");
									setIsModalOpen(false);

								}).catch((error) => {
									console.debug(error);
									console.debug("Failed to activate coinbase wallet");
								});

						}}>
						<img
							className="me-3"
							alt=""
							src={coinbaseLogo}
							style={{ width: 50, height: 50 }} />
						{"Coinbase Wallet"}
					</Button>
					<Button
						className="d-flex align-items-center"
						variant="outline"
						w="100%"
						onClick={() => {

							metamaskWallet.activate(CHAIN_ID)
								.then(() => {

									setProvider("metamask-wallet");
									setIsModalOpen(false);

								}).catch((error) => {
									console.debug(error);
									console.debug("Failed to activate metamask wallet");									
								});

						}}>
						<img
							className="me-3"
							alt=""
							src={metamaskLogo}
							style={{ width: 50, height: 50 }} />
						{"Metamask"}
					</Button>
				</Modal.Body>
			</Modal>
		</WalletContext.Provider>
	);

};

export {
	useWalletContext,
	WalletProvider,
};
