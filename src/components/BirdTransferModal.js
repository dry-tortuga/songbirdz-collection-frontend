import React, { useState } from "react";
import {
	Transaction,
	TransactionButton,
	TransactionSponsor,
	TransactionStatus,
	TransactionStatusAction,
	TransactionStatusLabel,
} from "@coinbase/onchainkit/transaction";
import { Form, Modal } from "react-bootstrap";

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
				<Transaction
					key={recipient} // Re-mount when recipient changes
					address={context.account}
					calls={[context.actions.safeTransferFrom(
						context.account,
						recipient,
						bird.id,
					)]}
					isSponsored
					onStatus={handleOnStatus}>
					<TransactionButton
						className="btn btn-info mt-4"
						text="Send" />
					<TransactionSponsor text="SongBirdz" />
					<TransactionStatus>
						<TransactionStatusLabel />
						<TransactionStatusAction />
					</TransactionStatus>
				</Transaction>
			</Modal.Body>
		</Modal>

	);

};

export default BirdTransferModal;
