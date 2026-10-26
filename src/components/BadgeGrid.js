import React, { useMemo } from "react";
import PropTypes from "prop-types";

import { SPECIES_STATE, flockIndexForSpecies, flockNameForSpecies } from "../utils/lifeList";

import BadgeTile from "./BadgeTile";

const groupSpecies = (species, groupBy) => {

	if (groupBy === "none") {
		return [{ key: "all", title: null, items: species }];
	}

	const groups = new Map();

	species.forEach((item) => {

		const title = groupBy === "family" ? item.family : flockNameForSpecies(item.id);

		if (!groups.has(title)) {
			groups.set(title, { key: title, title, items: [] });
		}

		groups.get(title).items.push(item);

	});

	const result = [...groups.values()];

	if (groupBy === "family") {
		result.sort((a, b) => a.title.localeCompare(b.title));
	}

	return result;

};

const BadgeGrid = (props) => {

	const { species, states, groupBy, selectedId, supplyById, onSelect } = props;

	const groups = useMemo(() => groupSpecies(species, groupBy), [species, groupBy]);

	if (species.length === 0) {
		return <p className="text-muted">{"No species match these filters."}</p>;
	}

	return (
		<>
			{groups.map((group) => {

				const recorded = group.items.filter(
					(item) => states[item.id] === SPECIES_STATE.RECORDED,
				).length;

				return (
					<section
						key={group.key}
						className="mb-4"
						aria-label={group.title || "All species"}>
						{group.title &&
							<h3 className="h5 mb-2">
								{group.title}
								<small className="text-muted ms-2">
									{`${recorded} / ${group.items.length}`}
								</small>
							</h3>
						}
						<div className="badge-grid">
							{group.items.map((item) => (
								<BadgeTile
									key={item.id}
									species={item}
									state={states[item.id] || SPECIES_STATE.MISSING}
									flockIndex={flockIndexForSpecies(item.id)}
									supply={supplyById?.[item.id]}
									selected={item.id === selectedId}
									onSelect={onSelect} />
							))}
						</div>
					</section>
				);

			})}
		</>
	);

};

BadgeGrid.propTypes = {
	species: PropTypes.arrayOf(PropTypes.shape({ id: PropTypes.number.isRequired })).isRequired,
	states: PropTypes.objectOf(PropTypes.string).isRequired,
	groupBy: PropTypes.oneOf(["flock", "family", "none"]),
	selectedId: PropTypes.number,
	supplyById: PropTypes.objectOf(PropTypes.number),
	onSelect: PropTypes.func.isRequired,
};

BadgeGrid.defaultProps = { groupBy: "flock" };

export default BadgeGrid;
