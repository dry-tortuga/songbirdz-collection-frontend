import React from "react";
import PropTypes from "prop-types";

import { STATE_LABELS } from "../utils/lifeList";

import "./Badge.css";

// One hue per flock so a full grid is easy to scan
const FLOCK_HUES = [30, 205, 130, 260, 5, 45, 335, 160, 85, 285];

// Placeholder glyph until the xPoli badge art is available (see getBadgeArt)
const GLYPH = [
	"00000110", "00001111", "01111110", "11111100",
	"01111110", "00111100", "00010100", "00110110",
];

const GLYPH_RECTS = GLYPH.flatMap((row, y) => (
	[...row].map((cell, x) => (cell === "1" ? { x, y } : null)).filter(Boolean)
));

const BadgeGlyph = () => (
	<svg
		className="badge-tile__glyph"
		viewBox="0 0 8 8"
		shapeRendering="crispEdges"
		aria-hidden="true"
		focusable="false">
		{GLYPH_RECTS.map(({ x, y }) => (
			<rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" />
		))}
	</svg>
);

const BadgeTile = (props) => {

	const { species, state, flockIndex, supply, selected, onSelect } = props;

	const classes = [
		"badge-tile",
		`badge-tile--${state}`,
		supply === 1 ? "badge-tile--supply-1" : "",
		selected ? "badge-tile--selected" : "",
	].join(" ");

	const label = `${species.label}, species ${species.id}, ${STATE_LABELS[state]}`;

	return (
		<button
			type="button"
			className={classes}
			style={{ "--badge-hue": FLOCK_HUES[flockIndex % FLOCK_HUES.length] }}
			title={`${species.label} (${STATE_LABELS[state]})`}
			aria-label={label}
			aria-pressed={Boolean(selected)}
			onClick={() => onSelect(species)}>
			<BadgeGlyph />
			<span className="badge-tile__id" aria-hidden="true">
				{species.id}
			</span>
		</button>
	);

};

BadgeTile.propTypes = {
	species: PropTypes.shape({
		id: PropTypes.number.isRequired,
		label: PropTypes.string.isRequired,
	}).isRequired,
	state: PropTypes.oneOf(["missing", "held", "legacy", "recorded"]).isRequired,
	flockIndex: PropTypes.number.isRequired,
	supply: PropTypes.number,
	selected: PropTypes.bool,
	onSelect: PropTypes.func.isRequired,
};

export default React.memo(BadgeTile);
