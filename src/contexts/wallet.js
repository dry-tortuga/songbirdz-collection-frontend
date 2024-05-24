import React, { useContext, useEffect, useMemo, useState } from "react";
import {
	Connector,
	useAccount,
	useConnect,
	useDisconnect,
	useEnsAvatar,
	useEnsName,
} from 'wagmi';
import { Contract } from "ethers";
import { Button, Modal } from "react-bootstrap";

import WalletOptions from './walletOptions';

import coinbaseLogo from "../images/logo-coinbase-wallet.png";
import metamaskLogo from "../images/logo-metamask-wallet.png";

const EXPECTED_CHAIN_ID = parseInt(process.env.REACT_APP_BASE_NETWORK_CHAIN_ID, 10);

const WalletContext = React.createContext();

const useWalletContext = () => useContext(WalletContext);

const WalletProvider = ({ children }) => {

	const { address, chainId, isConnected } = useAccount();
	const { connectors, connect } = useConnect();
	const { disconnect } = useDisconnect();
	const { data: ensName } = useEnsName({ address });
	const { data: ensAvatar } = useEnsAvatar({ name: ensName });

	const [isModalOpen, setIsModalOpen] = useState(false);

	const account = address;

	const setProvider = (type) => {
		window.localStorage.setItem("provider", type);
	};

	// Attempt to auto-connect to the user's default choice of wallet
	useEffect(() => {

		const provider = window.localStorage.getItem("provider");

		console.debug(`Attempting to auto-connect to ${provider}...`);

		/*

		if (provider === "coinbase-wallet") {
		
			coinbaseWallet.activate(EXPECTED_CHAIN_ID).catch(() => {

				console.debug("Failed to connect eagerly to coinbase wallet");
				window.localStorage.removeItem("provider");

			});

		} else if (provider === "metamask-wallet") {

			metamaskWallet.activate(EXPECTED_CHAIN_ID).catch(() => {

				console.debug("Failed to connect eagerly to metamask")
				window.localStorage.removeItem("provider");

			});

		// Otherwise, fallback to the coinbase wallet as a default
		}

		*/

	}, []);

	console.debug("----------------------");
	console.debug(`account=${account}`);
	console.debug(`chainId=${chainId}`);
	console.debug(`isConnected=${isConnected}`);
	console.debug("----------------------");

	return (
		<WalletContext.Provider
			value={{
				account,
				ensName,
				ensAvatar,
				chainId,
				expectedChainId: EXPECTED_CHAIN_ID,
				isOnCorrectChain: chainId === EXPECTED_CHAIN_ID,
				onConnectWallet: () => setIsModalOpen(true),
				onDisconnectWallet: () => {

					disconnect();
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
					<WalletOptions />
					{/*
					<Button
						className="d-flex align-items-center"
						variant="outline"
						w="100%"
						onClick={() => {

							coinbaseWallet.activate(EXPECTED_CHAIN_ID)
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

							metamaskWallet.activate(EXPECTED_CHAIN_ID)
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
					*/}
				</Modal.Body>
			</Modal>
		</WalletContext.Provider>
	);

};

export {
	useWalletContext,
	WalletProvider,
};
