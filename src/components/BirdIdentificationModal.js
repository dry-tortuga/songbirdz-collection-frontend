import React, { useMemo, useState } from "react";
import { 
	Transaction, 
	TransactionButton, 
	TransactionSponsor, 
	TransactionStatus, 
	TransactionStatusAction, 
	TransactionStatusLabel, 
} from "@coinbase/onchainkit/transaction"; 
import {
	Button,
	Form,
	Modal,
} from "react-bootstrap";
import Select from "react-select";

import BirdAudioFile from "./BirdAudioFile";

import {
	ANSWER_CHOICES,
	COLLECTIONS,
	CURRENT_COLLECTION_MIN_ID,
	CURRENT_COLLECTION_MAX_ID,
} from "../constants";

import "./BirdIdentificationModal.css";

const BirdIdentificationModal = (props) => {

	const {
		context,
		isOpen,
		bird,
		onSubmitNonSmartWallet,
		onSuccess,
		onToggle,
	} = props;

	const [formData, setFormData] = useState({
		species: "",
	});

	const [contractCall, setContractCall] = useState([]);

	const handleInputChange = async (selectedOption) => {

		if (context.isPaymasterSupported) {

			// Reset the selected species to use as the guess so we can wait for the result
			// of the async API call to fetch the merkle proof for the "publicMint" contract call

			setContractCall([]);

			try {

				const result = await context.actions.publicMint(bird.id, "Black-bellied Plover" || selectedOption.value);

				setContractCall([result]);

			} catch (error) {
				// TODO: Show an error message?
			}

		} else {

			setFormData({ species: selectedOption.value });

		}

	};

	// Handle submitting a new transaction for non-smart wallet users
	const handleSubmitNonSmartWallet = async () => {

		if (formData.species) {

			// Close the modal
			onToggle();

			// Submit the transaction
			await onSubmitNonSmartWallet(bird.id, formData.species);

		}

	};

	const options = useMemo(() => {

		const collection =
			COLLECTIONS.find((temp) => bird.id >= temp.min_id && bird.id <= temp.max_id);

		// Get the bird's final index relative to ONLY the current collection
		const finalIndex = bird.id - collection.min_id;

		const result = ANSWER_CHOICES[finalIndex].options.map((name) => ({
			label: name,
			value: name,
		}));

		result.sort((a, b) => {

			if (a.value < b.value) {
				return -1;
			}

			if (a.value > b.value) {
				return 1;
			}

			return 0;

  		});

		return result;

	}, [bird.id]);

	// Extra safety check here to prevent users from submitting invalid transactions...
	if (bird.id < CURRENT_COLLECTION_MIN_ID || bird.id > CURRENT_COLLECTION_MAX_ID) {
		return null;
	}

	return (
		<Modal
			show={isOpen}
			onHide={onToggle}>
			<Modal.Header closeButton>
				<Modal.Title>
					{`Identify ${bird.name}`}
				</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Form>
					<Form.Group
						className="mb-3"
						controlId="song-audio">
						<Form.Label className="d-block">
							{"Song Audio"}
						</Form.Label>
						<BirdAudioFile birdId={bird.id} />
					</Form.Group>
					<Form.Group
						className="mb-3"
						controlId="species">
						<Form.Label>
							{"Species"}
						</Form.Label>
						<Select
							id="species"
							name="species"
							className="bird-identification-species-selector"
							classNamePrefix="bird-identification-species"
							options={options}
							onChange={handleInputChange} />
					</Form.Group>
					<Form.Text className="text-muted d-block">
						{"PRICE: 0.0015 ETH"}
					</Form.Text>
					<Form.Text className="text-muted d-block">
						{"NOTE: If you submit an incorrect guess, you will be automatically refunded 0.00125 ETH."}
					</Form.Text>
				</Form>
				{context.isPaymasterSupported &&
					<Transaction
						key={contractCall.length} // Re-mount when contract call changes
						address={context.account}
						className="bird-identification-transaction-container"
						capabilities={context.isPaymasterSupported ? {
							paymasterService: { 
								url: process.env.REACT_APP_COINBASE_PAYMASTER_AND_BUNDLER_ENDPOINT, 
							}, 
						} : null}
						contracts={contractCall}
						onError={(error) => {

							console.error(error);

							// TODO: Show more relevant error messages???

						}}
						onSuccess={(response) => {

							// Close the modal
							onToggle();

							// Handle and parse the successful response
							onSuccess(response);

						}}>
						<TransactionButton
							className="btn btn-info"
							disabled={contractCall.length === 0}
							text="Submit" />
						<TransactionSponsor text="SongBirdz" />
						<TransactionStatus>
							<TransactionStatusLabel />
							<TransactionStatusAction />
						</TransactionStatus>
					</Transaction>
				}
				{!context.isPaymasterSupported &&
					<Button
						className="mt-3"
						variant="info"
						onClick={handleSubmitNonSmartWallet}>
						{"Submit"}
					</Button>
				}
			</Modal.Body>
		</Modal>

	);

};

export default BirdIdentificationModal;
