import React, { useCallback, useState } from "react";
import { Form, Modal } from "react-bootstrap";

import { TransactionForm } from "./TransactionForm";

const BirdTransferModal = (props) => {

	const {
		context,
		isOpen,
		bird,
		onToggle,
	} = props;

	const [recipient, setRecipient] = useState('');

	if (context.account.toLowerCase() !== '0x2d437771f6fbedf3d83633cbd3a31b6c6bdba2b1') {
		return null;
	}

	const handleOnStatus = useCallback((status) => {

		if (status.statusName === "success") {

			// Close the modal
			onToggle();

		} else if (status.statusName === "error") {

			console.error(status);

		}

	}, []);

	const calls = recipient
		? [context.actions.safeTransferFrom(context.account, recipient, bird.id)]
		: [];

	return (
		<Modal
			show={isOpen}
			onHide={onToggle}>
			<Modal.Header closeButton>
				<Modal.Title>
					{`Transfer ${bird.name}`}
				</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Form>
					<Form.Group
						className="mb-3"
						controlId="recipient">
						<Form.Label>
							{"Recipient"}
						</Form.Label>
						<Form.Control
							id="recipient"
							name="recipient"
							type="text"
							value={recipient}
							onChange={(event) => setRecipient(event.target.value)} />
					</Form.Group>
				</Form>
				<TransactionForm
					key={recipient} // Re-mount when recipient changes
					calls={calls}
					chainId={context.expectedChainId}
					buttonText="Send"
					disabled={!recipient}
					onStatus={handleOnStatus} />
			</Modal.Body>
		</Modal>

	);

};

export default BirdTransferModal;
