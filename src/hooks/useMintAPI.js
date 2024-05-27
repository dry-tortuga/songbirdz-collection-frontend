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

			// Fetch the merkle tree proof from the back-end server

			const proofParams = new URLSearchParams({ species_guess: speciesGuess });

			const response = await fetch(
				`${process.env.REACT_APP_SONGBIRDZ_BACKEND_URL}/birds/merkle-proof/${id}?${proofParams}`
			);

			if (response.status !== 200) {
				throw new Error(`Unable to fetch merkle proof for bird=${id}...`);
			}

			const responseData = await response.json();

			// Store the pending state for the transaction
			setTx((prev) => Object.assign({}, prev, {
				timestamp: null,
				transaction: null,
				confirmation: null,
				pending: true,
				success: false,
				error: false,
				errorMsg: null,
			}));

			// Build the transaction to mint the bird
			const [txSuccess, txError] = await context.actions.publicMint(
				id,
				responseData.proof,
				responseData.species_guess,
				MINT_PRICE,
			);

			// Store the success/error state for the transaction
			setTx((prev) => Object.assign({}, prev, {
				timestamp: new Date(),
				transaction: txSuccess,
				confirmation: [],
				pending: false,
				success: Boolean(txSuccess),
				error: Boolean(txError),
				errorMsg: txError,
			}));

			console.debug(`handleMint, gasUsed=${txSuccess.gasUsed.toNumber()}`);
			console.debug(txSuccess);
			console.log(txError);

			// Find the event(s) from the back-end

			const idEvent = txSuccess?.events?.find(
				(event) => event.event === EVENTS.BIRD_ID
			);

			const transferEvent = resultTxConfirmation?.events?.find(
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
