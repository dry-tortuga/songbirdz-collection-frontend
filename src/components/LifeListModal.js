import React from "react";
import { Link } from "react-router-dom";
import { Badge, Button, Form, Modal } from "react-bootstrap";
import { Name } from "@coinbase/onchainkit/identity";

import { FAMILIES } from "../constants";
import useLifeList from "../hooks/useLifeList";

import AccountOwner from "./AccountOwner";

import "./LifeListModal.css";

const sortedFamilies = FAMILIES.sort((family1, family2) => {

	if (family1.name < family2.name) {
		return -1;
	}

	if (family2.name < family1.name) {
		return 1;
	}

	return 0;

});

const LifeListModal = (props) => {

	const { address, isOpen, onToggle } = props;

	const { data } = useLifeList({ address: address?.account });

	if (!address) {
		return null;
	}

	console.debug(data);

	return (
		<Modal
			className="life-list-modal"
			show={isOpen}
			onHide={onToggle}>
			<Modal.Header closeButton>
				<Modal.Title
					className="w-100"
					as={(props) => <h2 {...props} />}>
					<div className="me-1">
						{"Birding Life List"}
					</div>
					<div className="flex flex-column flex-sm-row align-items-sm-center gap-2 user-details">
						<AccountOwner
							account={address?.account}
							size="lg" />
						<Badge
							className="ms-sm-auto"
							bg="info">
							{address.total}
							{' '}
							{address.total === 1
								? 'Birder Point'
								: 'Birder Points'
							}
						</Badge>
						<Badge
							className="ms-sm-3"
							bg="success">
							{'#'}
							{address.rank}
						</Badge>
					</div>
				</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				{sortedFamilies.map((family) => (
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
