import React, { useMemo } from "react";
import PropTypes from "prop-types";

import { COLLECTIONS } from "../constants";
import { ALL_SPECIES, SPECIES_STATE, flockIndexForSpecies } from "../utils/lifeList";

const FlockProgress = ({ states }) => {

	const rows = useMemo(() => COLLECTIONS.map((collection, index) => {

		const items = ALL_SPECIES.filter((species) => flockIndexForSpecies(species.id) === index);
		const done = items.filter((species) => states[species.id] === SPECIES_STATE.RECORDED).length;

		return { name: collection.name, done, total: items.length };

	}), [states]);

	return (
		<div className="profile-flock-progress">
			{rows.map((row) => (
				<div key={row.name} className="flock-row">
					<div className="d-flex justify-content-between">
						<span>{row.name}</span>
						<span className="flock-score">{`${row.done}/${row.total}`}</span>
					</div>
					<div
						className="flock-bar"
						role="progressbar"
						aria-label={`${row.name}: ${row.done} of ${row.total} recorded`}>
						<div
							className="flock-bar-fill"
							style={{ width: `${row.total ? (row.done / row.total) * 100 : 0}%` }} />
					</div>
				</div>
			))}
		</div>
	);

};

FlockProgress.propTypes = { states: PropTypes.objectOf(PropTypes.string).isRequired };

export default FlockProgress;
