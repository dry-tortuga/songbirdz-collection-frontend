import React, {
	useCallback,
	useContext,
	useEffect,
	useState,
} from "react";
import { Interface } from "ethers";
import { Modal } from "react-bootstrap";
import {
	useAccount,
	useConnect,
	useDisconnect,
	useSwitchChain,
} from "wagmi";
import { useCapabilities } from "wagmi/experimental";
import {
	readContract,
	simulateContract,
	waitForTransactionReceipt,
	writeContract,
} from "@wagmi/core";
import { parseEther } from "viem";

import SongBirdzContract from "../abi/SongBirdz.json";

import WalletOptions from "../components/WalletOptions";

import config from "../config";

import useCurrentUser from "../hooks/useCurrentUser";

const EXPECTED_CHAIN_ID = parseInt(process.env.REACT_APP_BASE_NETWORK_CHAIN_ID, 10);
const SONGBIRDZ_CONTRACT_ADDRESS = process.env.REACT_APP_SONGBIRDZ_CONTRACT_ADDRESS;
const ONCHAIN_GIFT_CONTRACT_ADDRESS = process.env.REACT_APP_ONCHAIN_GIFT_CONTRACT_ADDRESS;

const MINT_PRICE = "0.0015"; // 0.0015 ETH

const WalletContext = React.createContext();

const useWalletContext = () => useContext(WalletContext);

const WalletProvider = ({ children }) => {

	const { address, chainId, isConnected } = useAccount();
	const { connectors, connect } = useConnect();
	const { disconnect } = useDisconnect();
	const { switchChain } = useSwitchChain();

	const account = address;

	const { data: availableCapabilities } = useCapabilities({ account });

	const [currentUser, setCurrentUser] = useCurrentUser({ account });

	const [isModalOpen, setIsModalOpen] = useState(false);

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

	// Callback function to mint a new bird for smart wallet users
	const publicMint = useCallback(async (id, speciesGuess) => {

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
				value: parseEther(MINT_PRICE),
			};

		} catch (error) {
			console.error(error);
			throw error;
		}

	}, []);

	// Callback function to approve transfer of bird for smart wallet users
	const approve = useCallback((to, tokenId) => {

		return {
			abi: SongBirdzContract.abi,
			address: SONGBIRDZ_CONTRACT_ADDRESS,
			functionName: "approve",
			args: [to, tokenId],
			chainId: EXPECTED_CHAIN_ID,
		};

	}, []);

	// Callback function to transfer bird for smart wallet users
	const safeTransferFrom = useCallback((from, to, tokenId) => {

		return {
			abi: SongBirdzContract.abi,
			address: SONGBIRDZ_CONTRACT_ADDRESS,
			functionName: "safeTransferFrom",
			args: [from, to, tokenId],
			chainId: EXPECTED_CHAIN_ID,
		};

	}, []);

	// Callback function to mint a new bird for non-smart wallet users
	const publicMintNonSmartWallet = useCallback(async (id, proof, guess, mintPrice) => {

		try {

			const { request } = await simulateContract(config, {
				abi: SongBirdzContract.abi,
				address: SONGBIRDZ_CONTRACT_ADDRESS,
				functionName: "publicMint",
				args: [id, proof, guess],
				chainId: EXPECTED_CHAIN_ID,
				value: parseEther(mintPrice),
			});

			const hash = await writeContract(config, request);

			const txReceipt = await waitForTransactionReceipt(config, {
				chainId: EXPECTED_CHAIN_ID,
				hash,
			});

			return [txReceipt, null];

		} catch (error) {
			console.error(error);
			return [null, error];
		}

	}, []);

	const isOnCorrectChain = chainId === EXPECTED_CHAIN_ID;
	const isPaymasterSupported = Boolean(availableCapabilities?.[EXPECTED_CHAIN_ID]?.paymasterService?.supported);

	console.debug("----------------------");
	console.debug(connectors);
	console.debug(availableCapabilities);
	console.debug(`account=${account}`);
	console.debug(`chainId=${chainId}`);
	// console.debug(`ensName=${ensName}`);
	// console.debug(`ensAvatar=${ensAvatar}`);
	console.debug(`isConnected=${isConnected}`);
	console.debug(`isOnCorrectChain=${isOnCorrectChain}`);
	console.debug(`isPaymasterSupported=${isPaymasterSupported}`);
	console.debug("----------------------");

	return (
		<WalletContext.Provider
			value={{
				account,
				ensName: null, // TODO
				ensAvatar: null, // TODO
				chainId,
				expectedChainId: EXPECTED_CHAIN_ID,
				isOnCorrectChain,
				isPaymasterSupported,
				contractAddress: SONGBIRDZ_CONTRACT_ADDRESS,
				contractInterface: new Interface(SongBirdzContract.abi),
				onchainGiftContractAddress: ONCHAIN_GIFT_CONTRACT_ADDRESS,
				onConnectWallet: () => setIsModalOpen(true),
				onDisconnectWallet: disconnect,
				actions: {
					ownerOf,
					publicMint,
					publicMintNonSmartWallet,
					approve,
					safeTransferFrom,
				},
				currentUser,
				setCurrentUser,
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
