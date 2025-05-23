import React, {
	useCallback,
	useContext,
	useEffect,
} from "react";
import { Interface } from "ethers";
import { useAccount, useSwitchChain } from "wagmi";
import { useCapabilities } from "wagmi/experimental";
import { readContract } from "@wagmi/core";
import { encodeFunctionData, parseEther } from "viem";

import SongBirdzContract from "../abi/SongBirdz.json";

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
	const { switchChain } = useSwitchChain();

	const account = address;

	const { data: availableCapabilities } = useCapabilities({ account });

	const [currentUser, setCurrentUser] = useCurrentUser({ account });

	// Switch to the preferred chain based on the environment
	const connectToBase = useCallback(() => {

		console.debug(`Switching to chain=${EXPECTED_CHAIN_ID}...`);
	    switchChain({ chainId: EXPECTED_CHAIN_ID });

	}, [switchChain]);

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
                to: SONGBIRDZ_CONTRACT_ADDRESS,
                value: parseEther(MINT_PRICE),
                data: encodeFunctionData({
                    abi: SongBirdzContract.abi,
                    functionName: "publicMint",
                    args: [BigInt(id), responseData.proof, responseData.species_guess],
                }),
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

	const isOnCorrectChain = chainId === EXPECTED_CHAIN_ID;
	const isPaymasterSupported = Boolean(availableCapabilities?.[EXPECTED_CHAIN_ID]?.paymasterService?.supported);

	console.debug("----------------------");
	console.debug(availableCapabilities);
	console.debug(`account=${account}`);
	console.debug(`chainId=${chainId}`);
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
				actions: {
					connectToBase,
					ownerOf,
					publicMint,
					approve,
					safeTransferFrom,
				},
				currentUser,
				setCurrentUser,
			}}>
			{children}
		</WalletContext.Provider>
	);

};

export {
	useWalletContext,
	WalletProvider,
};
