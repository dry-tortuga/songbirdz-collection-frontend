import React, { useMemo, useState } from "react";
import {
	Button,
	Form,
	Modal,
} from "react-bootstrap";
import Select from "react-select";

import BirdAudioFile from "./BirdAudioFile";

import { ANSWER_CHOICES } from "../constants";

import "./BirdIdentificationModal.css";

const BirdIdentificationModal = (props) => {

	const {
		isOpen,
		bird,
		onSubmit,
		onToggle,
	} = props;

	const [formData, setFormData] = useState({
		species: "",
	});

	const options = useMemo(() => {

		const result = ANSWER_CHOICES[bird.id].options.map((name) => ({
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

	const handleSubmit = async () => {

		if (formData.species) {

			// Close the modal
			onToggle();

			// Submit the transaction
			await onSubmit(bird.id, formData.species);

		}

	};

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
						{"NOTE: If you submit an incorrect guess, you will be refunded 0.00125 ETH."}
					</Form.Text>
				</Form>
			</Modal.Body>
			<Modal.Footer>
				<Button variant="secondary" onClick={onToggle}>
					{"Cancel"}
				</Button>
				<Button
					variant="info"
					onClick={handleSubmit}>
					{"Submit"}
				</Button>
			</Modal.Footer>
		</Modal>

	);

};

export default BirdIdentificationModal;
