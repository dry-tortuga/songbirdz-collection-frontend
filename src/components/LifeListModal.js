import React, { useMemo, useState } from "react";
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

	const [season, setSeason] = useState(0);

	if (!address) {
		return null;
	}

	const [dataToShow, pointTotalToShow] = useMemo(() => {

		const results = {};
		let total = 0;

		const speciesByIDSeason1 = results.season_1;
		const speciesByIDSeason2 = results.season_2;

		if (season === 0 || season === 1) {

			results = { ...results, ...speciesByIDSeason1 };

			Object.values(speciesByIDSeason1).forEach((data) => {
				total += data.amount;
			});

		}

		if (season === 0 || season === 2) {

			results = { ...results, ...speciesByIDSeason2 };

			Object.values(speciesByIDSeason2).forEach((data) => {
				total += data.amount;
			});

		}

		return [results, total];

	}, [season]);


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
							{pointTotalToShow}
							{' '}
							{pointTotalToShow === 1
								? 'Birder Point'
								: 'Birder Points'
							}
						</Badge>
						{season !== 0 &&
							<Badge
								className="ms-sm-3"
								bg="success">
								{'#'}
								{address.rank}
							</Badge>
						}
					</div>
				</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Form.Select
					aria-label="Choose the season to view"
					value={season}
					onChange={(event) => setSeason(event.target.value)}>
					<option value={0}>{'All Seasons'}</option>
					<option value={1}>{'Season 1'}</option>
					<option value={2}>{'Season 2'}</option>
				</Form.Select>
				{sortedFamilies.map((family) => (
					<>
						<h4>{family.name}</h4>
						<div className="mb-4">
							{family.species.map((species) => {

								const isIdentified = Boolean(dataToShow?.[species.id]);

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
