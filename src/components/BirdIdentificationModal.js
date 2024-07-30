import React, { useMemo, useRef, useState } from "react";
import { 
	Transaction, 
	TransactionButton, 
	TransactionSponsor, 
	TransactionStatus, 
	TransactionStatusAction, 
	TransactionStatusLabel, 
	TransactionToast,
	TransactionToastAction,
	TransactionToastIcon,
	TransactionToastLabel,
} from "@coinbase/onchainkit/transaction"; 
import {
	Button,
	Form,
	Modal,
} from "react-bootstrap";
import Select from "react-select";
import { parseEther } from "viem";

import BirdAudioFile from "./BirdAudioFile";

import SongBirdzContract from "../abi/SongBirdz.json";

import { ANSWER_CHOICES, COLLECTIONS } from "../constants";

import "./BirdIdentificationModal.css";

const MINT_PRICE = "0.0015"; // 0.0015 ETH

const BirdIdentificationModal = (props) => {

	const {
		context,
		isOpen,
		bird,
		onSuccess,
		onToggle,
	} = props;

	const [formData, setFormData] = useState({
		species: "",
	});

	const contractsRef = useRef(null);

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
	if (bird.id < COLLECTIONS[2].min_id || bird.id > COLLECTIONS[2].max_id) {
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
							onChange={(newValue) => setFormData({
								...formData,
								species: newValue.value,
							})} />
					</Form.Group>
					<Form.Text className="text-muted d-block">
						{"PRICE: 0.0015 ETH"}
					</Form.Text>
					<Form.Text className="text-muted d-block">
						{"NOTE: If you submit an incorrect guess, you will be automatically refunded 0.00125 ETH."}
					</Form.Text>
				</Form>
			</Modal.Body>
			<Modal.Footer>
				<Button
					variant="secondary"
					onClick={onToggle}>
					{"Cancel"}
				</Button>
				<Transaction
					address={address}
					capabilities={{ 
						paymasterService: { 
							url: process.env.REACT_APP_COINBASE_PAYMASTER_AND_BUNDLER_ENDPOINT, 
						}, 
					}}
					contracts={contractsRef.current}
					onError={(error) => {

						console.error(error);

					}}
					onSuccess={(response) => {

						console.log(response);

						// Close the modal
						onToggle();

						onSuccess(response);

					}}>
					<TransactionButton
						className="btn btn-info"
						text="Submit"
						onClick={async (event) => {

						event.preventDefault();
						event.stopPropagation();

						const publicMintCall = await context.actions.publicMint();

						contractsRef.current = [publicMintCall];

						// TODO: Re-throw the event to be handled above

					}} />
					<TransactionSponsor text="OnchainKit" />
					<TransactionStatus>
						<TransactionStatusLabel />
						<TransactionStatusAction />
					</TransactionStatus>
					<TransactionToast>
						<TransactionToastIcon />
						<TransactionToastLabel />
						<TransactionToastAction />
					</TransactionToast>
				</Transaction>
			</Modal.Footer>
		</Modal>

	);

};

export default BirdIdentificationModal;
