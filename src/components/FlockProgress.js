import React, { useMemo } from "react";
import PropTypes from "prop-types";
import { ProgressBar } from "react-bootstrap";

import { COLLECTIONS } from "../constants";
import { ALL_SPECIES, SPECIES_STATE, flockIndexForSpecies } from "../utils/lifeList";

const FlockProgress = ({ states }) => {

	const rows = useMemo(() => COLLECTIONS.map((collection, index) => {

		const items = ALL_SPECIES.filter((species) => flockIndexForSpecies(species.id) === index);
		const done = items.filter((species) => states[species.id] === SPECIES_STATE.RECORDED).length;

		return { name: collection.name, done, total: items.length };

	}), [states]);

	return (
		<ul className="list-unstyled mb-0">
			{rows.map((row) => (
				<li key={row.name} className="mb-2">
					<div className="d-flex justify-content-between">
						<span>{row.name}</span>
						<span className="text-muted">{`${row.done} / ${row.total}`}</span>
					</div>
					<ProgressBar
						now={row.total ? (row.done / row.total) * 100 : 0}
						style={{ height: "0.6rem" }}
						aria-label={`${row.name}: ${row.done} of ${row.total} recorded`} />
				</li>
			))}
		</ul>
	);

};

FlockProgress.propTypes = { states: PropTypes.objectOf(PropTypes.string).isRequired };

export default FlockProgress;
