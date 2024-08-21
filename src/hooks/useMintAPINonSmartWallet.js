import useTransaction from "./useTransaction";

import { EVENTS } from "../constants";

const MINT_PRICE = "0.0015"; // 0.0015 ETH

const useMintAPINonSmartWallet = ({ context, cb }) => {

	// Keep track of the state of back-end transactions
	const [tx, setTx, resetTx] = useTransaction();

	const handleMint = async (id, speciesGuess) => {

		try {

			console.log('handleMint');

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
				pending: true,
				success: false,
				error: false,
				errorMsg: null,
			}));

			// Build the transaction to mint the bird
			const [txSuccess, txError] = await context.actions.publicMintNonSmartWallet(
				id,
				responseData.proof,
				responseData.species_guess,
				MINT_PRICE,
			);

			let events = [];

			if (txSuccess) {

				console.debug(`handleMint, gasUsed=${txSuccess.gasUsed}`);

				events = txSuccess.logs.map((log) => {

					return context.contractInterface.parseLog({
						data: log.data,
						topics: log.topics,
					});

				});

			}

			// Find the event(s) from the back-end

			const idEvent = events.find(
				(event) => event.name === EVENTS.BIRD_ID
			);

			const transferEvent = events.find(
				(event) => event.name === EVENTS.TRANSFER
			);

			// Store the success/error state for the transaction
			setTx((prev) => Object.assign({}, prev, {
				timestamp: new Date(),
				transaction: txSuccess,
				idEvent,
				transferEvent,
				pending: false,
				success: Boolean(txSuccess),
				error: Boolean(txError),
				errorMsg: txError,
			}));

			// Notify the front-end of the event(s)
			cb(idEvent, transferEvent);

		} catch (error) {

			console.error(error);

			setTx((prev) => Object.assign({}, prev, {
				timestamp: new Date(),
				transaction: null,
				idEvent: null,
				transferEvent: null,
				pending: false,
				success: false,
				error: true,
				errorMsg: error?.data?.message || "Oops there was an error...",
			}));

		}

	};

	return [handleMint, tx, resetTx];

};

export default useMintAPINonSmartWallet;
