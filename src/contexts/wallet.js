import React, {
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react";
import { Interface } from "ethers";
import {
	Connector,
	useAccount,
	useConnect,
	useDisconnect,
	useEnsAvatar,
	useEnsName,
	useSwitchChain,
} from "wagmi";
import { base, baseSepolia, hardhat } from "wagmi/chains";
import {
	readContract,
	simulateContract,
	waitForTransactionReceipt,
	writeContract,
} from "@wagmi/core";
import { parseEther } from "viem";
import { Button, Modal } from "react-bootstrap";

import SongBirdzContract from "../abi/SongBirdz.json";
import WalletOptions from "../components/WalletOptions";
import config from "../config";

const EXPECTED_CHAIN_ID = parseInt(process.env.REACT_APP_BASE_NETWORK_CHAIN_ID, 10);
const SONGBIRDZ_CONTRACT_ADDRESS = process.env.REACT_APP_SONGBIRDZ_CONTRACT_ADDRESS;

const WalletContext = React.createContext();

const useWalletContext = () => useContext(WalletContext);

const WalletProvider = ({ children }) => {

	const { address, chainId, isConnected } = useAccount();
	const { connectors, connect } = useConnect();
	const { disconnect } = useDisconnect();
	// const { data: ensName } = useEnsName({ address });
	// const { data: ensAvatar } = useEnsAvatar({ name: ensName });
	const { switchChain } = useSwitchChain();

	const [isModalOpen, setIsModalOpen] = useState(false);

	const account = address;

	console.debug(connectors);

	useEffect(() => {

		// Auto-switch to the preferred chain based on the environment

		if (isConnected && chainId !== EXPECTED_CHAIN_ID) {
			console.debug(`Switching from chain=${chainId} to chain=${EXPECTED_CHAIN_ID}...`);
		    switchChain({ chainId: EXPECTED_CHAIN_ID });
	    }

	    // Close the modal once we are connected

	    if (isConnected && isModalOpen) {
	    	setIsModalOpen(false);
	    }

	}, [isConnected, isModalOpen, chainId]);

	const onClick = useCallback((selectedConnector) => {

		connect({ connector: selectedConnector });
		setIsModalOpen(false);

	}, [connect]);

	// Callback function to fetch the owner of a bird
	const ownerOf = useCallback(async (id) => {

		try {

			const result = await readContract(config, {
				abi: SongBirdzContract.abi,
				address: SONGBIRDZ_CONTRACT_ADDRESS,
				functionName: "ownerOf",
				args: [id],
				chainId: EXPECTED_CHAIN_ID,
			});

			return [result, null];

		} catch (error) {

			// Does not have owner yet
			console.debug(error);
			return [null, error];

		}

	}, []);

	// Callback function to mint a new bird
	const publicMint = useCallback(async (id, proof, guess, mintPrice) => {

		try {

			// Fetch the merkle tree proof from the back-end server

			const proofParams = new URLSearchParams({ species_guess: speciesGuess });

			const response = await fetch(
				`${process.env.REACT_APP_SONGBIRDZ_BACKEND_URL}/birds/merkle-proof/${id}?${proofParams}`
			);

			if (response.status !== 200) {
				throw new Error(`Unable to fetch merkle proof for bird=${id}...`);
			}

			const responseData = await response.json();

			return {
				abi: SongBirdzContract.abi,
				address: SONGBIRDZ_CONTRACT_ADDRESS,
				functionName: "publicMint",
				args: [id, responseData.proof, responseData.species_guess],
				chainId: EXPECTED_CHAIN_ID,
				value: parseEther(mintPrice), 
			};

		} catch (error) {
			console.error(error);
			throw error;
		}

	}, []);

	console.debug("----------------------");
	console.debug(`account=${account}`);
	console.debug(`chainId=${chainId}`);
	// console.debug(`ensName=${ensName}`);
	// console.debug(`ensAvatar=${ensAvatar}`);
	console.debug(`isConnected=${isConnected}`);
	console.debug("----------------------");

	return (
		<WalletContext.Provider
			value={{
				account,
				ensName: null, // TODO
				ensAvatar: null, // TODO
				chainId,
				expectedChainId: EXPECTED_CHAIN_ID,
				isOnCorrectChain: chainId === EXPECTED_CHAIN_ID,
				contractAddress: SONGBIRDZ_CONTRACT_ADDRESS,
				contractInterface: new Interface(SongBirdzContract.abi),
				onConnectWallet: () => setIsModalOpen(true),
				onDisconnectWallet: disconnect,
				actions: {
					ownerOf,
					publicMint,
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
				<Modal.Body className="d-flex flex-column align-items-center">
					<WalletOptions onClick={onClick} />
				</Modal.Body>
			</Modal>
		</WalletContext.Provider>
	);

};

export {
	useWalletContext,
	WalletProvider,
};
