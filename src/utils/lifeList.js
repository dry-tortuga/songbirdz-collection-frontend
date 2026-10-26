import { COLLECTIONS, FAMILIES, NUM_SPECIES_TOTAL } from "../constants";

export const SPECIES_STATE = Object.freeze({
	MISSING: "missing", // not recorded
	HELD: "held", // owner holds a bird of this species, no badge yet (needs the Life List contract)
	LEGACY: "legacy", // claimable from season history (needs the Life List contract)
	RECORDED: "recorded", // minted or bought, they count the same
});

export const STATE_LABELS = {
	missing: "Not recorded",
	held: "You own one, not yet recorded",
	legacy: "Claimable from season history",
	recorded: "Recorded",
};

// Species 0-199 = flock 0, 200-599 = flocks 1-8 (50 each), 600-799 = flock 9
export const flockIndexForSpecies = (id) => {
	if (id < 200) { return 0; }
	if (id >= 600) { return 9; }
	return Math.floor((id - 200) / 50) + 1;
};

export const flockNameForSpecies = (id) => COLLECTIONS[flockIndexForSpecies(id)]?.name || "";

// Flat, sorted list of all species (ids >= 1000 are season bonus tasks, not species)
export const ALL_SPECIES = FAMILIES
	.flatMap((family) => family.species.map((species) => ({
		id: species.id,
		label: species.label,
		family: family.name,
	})))
	.filter((species) => species.id < NUM_SPECIES_TOTAL)
	.sort((a, b) => a.id - b.id);

// Phase 1 adapter: builds the Life List from the existing per-season point logs.
// Phase 2 replaces this with the on-chain bitmap and adds HELD and LEGACY states.
export const buildLifeList = (raw) => {

	const recorded = new Set();
	const pointsBySeason = {};

	Object.entries(raw || {}).forEach(([key, logs]) => {

		const season = parseInt(key.replace("season_", ""), 10);

		let total = 0;

		(logs || []).forEach((log) => {

			total += log.amount || 0;

			if (log.species_id < NUM_SPECIES_TOTAL) {
				recorded.add(log.species_id);
			}

		});

		pointsBySeason[season] = total;

	});

	const states = {};

	ALL_SPECIES.forEach((species) => {
		states[species.id] = recorded.has(species.id)
			? SPECIES_STATE.RECORDED
			: SPECIES_STATE.MISSING;
	});

	return {
		states,
		count: recorded.size,
		pointsBySeason,
		totalPoints: Object.values(pointsBySeason).reduce((sum, value) => sum + value, 0),
	};

};