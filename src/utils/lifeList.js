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
	const birdIds = {};
	const events = [];

	Object.entries(raw || {}).forEach(([key, logs]) => {

		const season = parseInt(key.replace("season_", ""), 10);

		// Ignore any non-season entries (e.g. extra metadata in the response)
		if (Number.isNaN(season)) {
			return;
		}

		let total = 0;

		(logs || []).forEach((log) => {

			total += log.amount || 0;

			if (log.species_id >= NUM_SPECIES_TOTAL) {
				return;
			}

			recorded.add(log.species_id);

			// Keep a bird id for each recorded species (their first bird)
			if (birdIds[log.species_id] === undefined &&
				log.bird_id !== null && log.bird_id !== undefined) {
				birdIds[log.species_id] = log.bird_id;
			}

			// Keep track of the log's date to show activity & join date
			if (log.timestamp) {
				events.push({
					season,
					speciesId: log.species_id,
					birdId: log.bird_id ?? null,
					points: log.amount || 0,
					timestamp: log.timestamp,
				});
			}

		});

		pointsBySeason[season] = total;

	});

	// Most recent activity first
	events.sort((a, b) =>
		new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

	// First log across all seasons approximates the join date
	const memberSince = events.length > 0
		? events[events.length - 1].timestamp
		: null;

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
		birdIds,
		events,
		memberSince,
	};

};