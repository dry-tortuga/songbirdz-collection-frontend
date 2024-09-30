import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Badge, Button, Form, Modal } from "react-bootstrap";
import { Name } from "@coinbase/onchainkit/identity";

import { COLLECTIONS, FAMILIES } from "../constants";
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

	const [filter, setFilter] = useState("0");

	if (!address) {
		return null;
	}

	const [dataToShow, pointTotalToShow] = useMemo(() => {

		let results = {};
		let total = 0;

		const speciesByIDSeason1 = data?.season_1 || {};
		const speciesByIDSeason2 = data?.season_2 || {};

		if (filter !== "2") {

			results = { ...results, ...speciesByIDSeason1 };

			if (filter === "0" || filter === "1") {

				Object.values(speciesByIDSeason1).forEach((data) => {
					total += data.amount;
				});

			}

		}

		if (filter != "1") {

			results = { ...results, ...speciesByIDSeason2 };

			if (filter === "0" || filter === "2") {

				Object.values(speciesByIDSeason2).forEach((data) => {
					total += data.amount;
				});

			}

		}

		return [results, total];

	}, [filter, data]);

	const renderLabel = (species, isIdentified) => {

		let collectionId = 0;

		if (species.id >= 200 && species.id < 250) {
			collectionId = 1;
		} else if (species.id >= 250 && species.id < 300) {
			collectionId = 2;
		} else if (species.id >= 300 && species.id < 350) {
			collectionId = 3;
		}

		const collection = COLLECTIONS[collectionId];

		return (
			<div className="flex align-items-center">
				<span className="fw-bold">
					{species.label}
				</span>
				<span
					className="ms-1"
					style={{ fontSize: '0.85rem' }}>
					{`(${collection.name})`}
				</span>
				{isIdentified && (filter === "1" || filter === "2") &&
					<Badge
						className="ms-2"
						bg="info">
						{dataToShow?.[species.id]?.amount}
						{'x'}
					</Badge>
				}
			</div>
		)

	};

	const renderSpeciesList = (familySpecies) => {

		let filteredFamilySpecies = [...familySpecies];

		let collectionId = -1;

		if (filter === "Picasso Genesis") {
			collectionId = 0;
		} else if (filter === "Deep Blue") {
			collectionId = 1;
		} else if (filter === "Small & Mighty") {
			collectionId = 2;
		} else if (filter === "Night & Day") {
			collectionId = 3;
		}

		if (collectionId >= 0) {

			filteredFamilySpecies = filteredFamilySpecies.filter((species) => {

				if (collectionId === 0 && species.id >= 0 && species.id < 200) {
					return true;
				}

				if (collectionId === 1 && species.id >= 200 && species.id < 250) {
					return true;
				}

				if (collectionId === 2 && species.id >= 250 && species.id < 300) {
					return true;
				}

				if (collectionId === 3 && species.id >= 300 && species.id < 350) {
					return true;
				}

				return false;

			});

		}

		return filteredFamilySpecies.map((species) => {

			const isIdentified = Boolean(dataToShow?.[species.id]);

			return (
				<Form.Check
					key={species.id}
					id={`disabled-default-${species.id}`}
					type="checkbox"
					label={renderLabel(species, isIdentified)}
					checked={isIdentified}
					disabled />
			);

		});

	};

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
						{(filter === "1" || filter === "2") && address.rank &&
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
					aria-label="Choose a specific season or collection to view"
					className="mb-3"
					value={filter}
					onChange={(event) => setFilter(event.target.value)}>
					<option value="0">{'All Seasons'}</option>
					<option value="1">{'Season 1'}</option>
					<option value="2">{'Season 2'}</option>
					{COLLECTIONS.map((collection) => (
						<option value={collection.name}>{collection.name}</option>						
					))}
				</Form.Select>
				{sortedFamilies.map((family) => (
					<div key={family.name}>
						<h4>{family.name}</h4>
						<div className="mb-4">
							{renderSpeciesList(family.species)}
						</div>
					</div>
				))}
			</Modal.Body>
		</Modal>
	);

};

export default LifeListModal;
