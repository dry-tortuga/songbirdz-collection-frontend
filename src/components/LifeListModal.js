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
						<div className="mb-4">
							{family.species.map((species) => {

								const isIdentified = Boolean(data?.[species.id]);

								return (
									<Form.Check
										id={`disabled-default-${species.id}`}
										type="checkbox"
										label={isIdentified ? (
											<div className="flex align-items-center">
												{species.label}
												<Badge
													className="ms-2"
													bg="info">
													{data?.[species.id]?.amount}
													{'x'}
												</Badge>
											</div>
										) : species.label}
										checked={isIdentified}
										disabled />
								);

							})}
						</div>
					</>
				))}
			</Modal.Body>
		</Modal>
	);

};

export default LifeListModal;
