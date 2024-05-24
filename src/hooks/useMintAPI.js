import { utils } from "ethers";

import useTransaction from "./useTransaction";

import { EVENTS } from "../constants";

const MINT_PRICE = "0.0015"; // 0.0015 ETH

const useMintAPI = ({ context, cb }) => {

	// Keep track of the state of back-end transactions
	const [tx, setTx, resetTx] = useTransaction();

	const handleMint = async (id, speciesGuess) => {

		try {

			if (!context.isOnCorrectChain) {
				throw new Error('Double check to make sure you\'re on the Base network!');
			}

			// Build the transaction options, i.e. need to pay ETH to mint
			const options = {
				value: utils.parseEther(MINT_PRICE)
			};

			const signer = context.songBirdzContract.provider.getSigner();

			const songBirdzContractSigner = context.songBirdzContract.connect(signer);

			// Fetch the merkle tree proof from the back-end server

			const proofParams = new URLSearchParams({ species_guess: speciesGuess });

			const response = await fetch(
				`${process.env.REACT_APP_SONGBIRDZ_BACKEND_URL}/birds/merkle-proof/${id}?${proofParams}`
			);

			if (response.status !== 200) {
				throw new Error(`Unable to fetch merkle proof for bird=${id}...`);
			}

			const responseData = await response.json();

			// Build the transaction to mint the bird
			const resultTx = await context.publicMint(
				id,
				responseData.proof,
				responseData.species_guess,
				MINT_PRICE,
			);

			// Store the transaction data
			setTx((prev) => Object.assign({}, prev, {
				timestamp: new Date(),
				transaction: resultTx,
				success: false,
				error: false,
			}));

			// Wait for the transaction to be confirmed
			const resultTxConfirmation = await resultTx.wait();

			// Update the transaction status
			setTx((prev) => Object.assign({}, prev, {
				timestamp: new Date(),
				confirmation: resultTxConfirmation,
				success: true,
			}));

			console.debug(`handleMint, gasUsed=${resultTxConfirmation.gasUsed.toNumber()}`);
			console.debug(resultTxConfirmation.events);

			// Find the event(s) from the back-end

			const idEvent = resultTxConfirmation.events.find(
				(event) => event.event === EVENTS.BIRD_ID
			);

			const transferEvent = resultTxConfirmation.events.find(
				(event) => event.event === EVENTS.TRANSFER
			);

			// Notify the front-end of the event(s)
			cb(idEvent, transferEvent);

		} catch (error) {

			console.error(error);

			setTx((prev) => Object.assign({}, prev, {
				timestamp: new Date(),
				error: true,
				errorMsg: error?.data?.message || "Oops there was an error...",
			}));

		}

	};

	return [handleMint, tx, resetTx];

};

export default useMintAPI;
