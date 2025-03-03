import React, { useMemo, useState } from "react";
import { Badge, Form, Modal } from "react-bootstrap";

import { COLLECTIONS, FAMILIES } from "../constants";
import useLifeList from "../hooks/useLifeList";

import AccountOwner from "./AccountOwner";

import "./LifeListModal.css";

const SEASON_2_BONUS_POINT_SPECIES = [{
	id: 1000,
	label: 'Posted on X',
}, {
	id: 1001,
	label: 'Joined Telegram',
}, {
	id: 1002,
	label: 'Joined Discord',
}, {
	id: 1003,
	label: 'Hit 7 Day Streak',
}, {
	id: 1004,
	label: 'Hit 14 Day Streak',
}, {
	id: 1005,
	label: 'Hit 30 Day Streak',
}];

const SEASON_3_BONUS_POINT_SPECIES = [{
	id: 1006,
	label: 'Posted on X',
}, {
	id: 1007,
	label: 'Posted on Farcaster',
}, {
	id: 1008,
	label: 'Joined Telegram',
}, {
	id: 1009,
	label: 'Joined Discord',
}, {
	id: 1010,
	label: 'Hit 7 Day Streak',
}, {
	id: 1011,
	label: 'Hit 14 Day Streak',
}, {
	id: 1012,
	label: 'Hit 30 Day Streak',
}];

const SEASON_4_BONUS_POINT_SPECIES = [{
	id: 1013,
	label: 'Posted on X',
}, {
	id: 1014,
	label: 'Posted on Farcaster',
}, {
	id: 1015,
	label: 'Joined Telegram',
}, {
	id: 1016,
	label: 'Joined Farcaster Channel',
}, {
	id: 1017,
	label: 'Hit 7 Day Streak',
}, {
	id: 1018,
	label: 'Hit 14 Day Streak',
}, {
	id: 1019,
	label: 'Hit 30 Day Streak',
}];

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

		const speciesByIDSeason1 = data?.season_1 || {};
		const speciesByIDSeason2 = data?.season_2 || {};
		const speciesByIDSeason3 = data?.season_3 || {};
		const speciesByIDSeason4 = data?.season_4 || {};

        let results = {}, total = 0;

        if (filter === "1") {

            results = { ...speciesByIDSeason1 };

            Object.values(speciesByIDSeason1).forEach((data) => {
				total += data.amount;
			});

        } else if (filter === "2") {

            results = { ...speciesByIDSeason2 };

            Object.values(speciesByIDSeason2).forEach((data) => {
				total += data.amount;
			});

		} else if (filter === "3") {

			results = { ...speciesByIDSeason3 };

			Object.values(speciesByIDSeason3).forEach((data) => {
				total += data.amount;
			});

		} else if (filter === "4") {

            results = { ...speciesByIDSeason4 };

            Object.values(speciesByIDSeason4).forEach((data) => {
				total += data.amount;
			});

        } else {

            results = {
                ...speciesByIDSeason1,
                ...speciesByIDSeason2,
                ...speciesByIDSeason3,
                ...speciesByIDSeason4,
            };

            if (filter === "0") {

                Object.values(speciesByIDSeason1).forEach((data) => {
    				total += data.amount;
    			});

                Object.values(speciesByIDSeason2).forEach((data) => {
    				total += data.amount;
    			});

                Object.values(speciesByIDSeason3).forEach((data) => {
    				total += data.amount;
    			});

                Object.values(speciesByIDSeason4).forEach((data) => {
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
		} else if (species.id >= 350 && species.id < 400) {
			collectionId = 4;
		} else if (species.id >= 400 && species.id < 450) {
			collectionId = 5;
		} else if (species.id >= 450 && species.id < 500) {
			collectionId = 6;
		} else if (species.id >= 1000) {
			collectionId = -1;
		}

		const collection = COLLECTIONS[collectionId];

		return (
			<div className="flex align-items-center">
				<span className="fw-bold">
					{species.label}
				</span>
				{collection &&
					<span
						className="ms-1"
						style={{ fontSize: "0.85rem" }}>
						{`(${collection.name})`}
					</span>
				}
				{isIdentified && (
					filter === "1" ||
					filter === "2" ||
					filter === "3" ||
					filter === "4"
				) &&
					<Badge
						className="ms-2"
						bg="info">
						{dataToShow?.[species.id]?.amount}
						{"x"}
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
		} else if (filter === "Fire & Ice") {
			collectionId = 4;
		} else if (filter === "Predator & Prey") {
			collectionId = 5;
		} else if (filter === "Lovebirds") {
			collectionId = 6;
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

				if (collectionId === 4 && species.id >= 350 && species.id < 400) {
					return true;
				}

				if (collectionId === 5 && species.id >= 400 && species.id < 450) {
					return true;
				}

				if (collectionId === 6 && species.id >= 450 && species.id < 500) {
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
							{" "}
							{pointTotalToShow === 1
								? "Birder Point"
								: "Birder Points"
							}
						</Badge>
						{(
							filter === "1" ||
							filter === "2" ||
							filter === "3" ||
							filter === "4"
						) && address.rank &&
							<Badge
								className="ms-sm-3"
								bg="success">
								{"#"}
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
					<option value="0">{"All Seasons"}</option>
					<option value="1">{"Season 1"}</option>
					<option value="2">{"Season 2"}</option>
					<option value="3">{"Season 3"}</option>
					<option value="4">{"Season 4"}</option>
					{COLLECTIONS.map((collection) => (
						<option
						    key={collection.name}
						    value={collection.name}>
							{collection.name}
						</option>
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
				{filter === "2" &&
					<div>
						<h4>{"Bonus Points"}</h4>
						<div className="mb-4">
							{renderSpeciesList(SEASON_2_BONUS_POINT_SPECIES)}
						</div>
					</div>
				}
				{filter === "3" &&
					<div>
						<h4>{"Bonus Points"}</h4>
						<div className="mb-4">
							{renderSpeciesList(SEASON_3_BONUS_POINT_SPECIES)}
						</div>
					</div>
				}
				{filter === "4" &&
					<div>
						<h4>{"Bonus Points"}</h4>
						<div className="mb-4">
							{renderSpeciesList(SEASON_4_BONUS_POINT_SPECIES)}
						</div>
					</div>
				}
			</Modal.Body>
		</Modal>
	);

};

export default LifeListModal;
