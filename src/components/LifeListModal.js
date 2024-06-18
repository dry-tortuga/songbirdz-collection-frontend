import React from "react";
import { Link } from "react-router-dom";
import { Button, Form, Modal } from "react-bootstrap";
import { Name } from "@coinbase/onchainkit/identity";

import { FAMILIES } from "../constants";

import AccountOwner from "./AccountOwner";

// import "./LifeListModal.css";

const LifeListModal = (props) => {

	const { address, isOpen, onToggle } = props;

	return (
		<Modal
			show={isOpen}
			onHide={onToggle}>
			<Modal.Header closeButton>
				<Modal.Title>
					<span className="me-1">
						{"Birding Life List for"}
					</span>
					<Name address={address} />
				</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<AccountOwner account={address} />
				{FAMILIES.map((family) => (
					<>
						<h4>{family.name}</h4>
						<div>
							{family.species.map((species) => (
								<Form.Check
									id={`disabled-default-${species}`}
									type="checkbox"
									label={species}
									disabled />
							))}
						</div>
					</>
				))}
			</Modal.Body>
		</Modal>
	);

};

export default LifeListModal;
