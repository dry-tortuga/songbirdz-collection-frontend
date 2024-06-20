import React from "react";
import { Link } from "react-router-dom";
import { Badge, Button, Form, Modal } from "react-bootstrap";
import { Name } from "@coinbase/onchainkit/identity";

import { FAMILIES } from "../constants";
import useLifeList from "../hooks/useLifeList";

import AccountOwner from "./AccountOwner";

import "./LifeListModal.css";

const LifeListModal = (props) => {

	const { address, isOpen, onToggle } = props;

	const { data } = useLifeList({ address });

	console.log(data);

	return (
		<Modal
			className="life-list-modal"
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
									id={`disabled-default-${species.id}`}
									type="checkbox"
									label={
										<span>
											{species.label}
											<Badge
												className="ms-1"
												bg="info">
												{data?.[species.id]?.amount}
											</Badge>
										</span>
									checked={Boolean(data?.[species.id])}
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
