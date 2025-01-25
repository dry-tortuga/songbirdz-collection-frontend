import { useEffect, useState } from "react";

import { COLLECTIONS, NUM_BIRDS_TOTAL } from "../constants";
import { fetchBird } from "../utils/data";

const useBirdsV2 = (props) => {

	const {
		context,
		collectionId,
		showOnlyUnidentifiedBirds,
		alreadyIdentifiedList,
	} = props;

	const [filters, setFilters] = useState({ collectionId });

	const [identifiedCurrentSession, setIdentifiedCurrentSession] = useState({});

	const [data, setData] = useState(null);

	const onChangeFilter = (key, newValue) => {

		setFilters((prev) => ({
			...prev,
			[key]: newValue,
		}));

	};

	// Fetch the birds data from the backend contract
	useEffect(() => {

		const fetch = async () => {

			const idsToFetch = initBirdsState(
				filters.collectionId,
				showOnlyUnidentifiedBirds,
				alreadyIdentifiedList,
				identifiedCurrentSession,
			);

			if (idsToFetch) {

				const results = [];

				for (let i = 0; i < idsToFetch.length; i++) {

					const id = idsToFetch[i].id;
                    const cached = idsToFetch[i].cached;

					const owner = null;

					// Fetch the metadata from the backend server
					const bird = await fetchBird(id, owner, cached);

					results.push(bird);

				}

				setData(results);

			}

		};

		fetch();

	}, [
		context.actions,
		filters.collectionId,
		showOnlyUnidentifiedBirds,
		alreadyIdentifiedList,
		identifiedCurrentSession,
	]);

	return {
		data,
		filters,
		identifiedCurrentSession,
		onChangeFilter,
		onChangeIdentified:
			(id) => setIdentifiedCurrentSession((prev) => ({ ...prev, [id]: true })),
	};

};

export default useBirdsV2;

function initBirdsState(collectionId, showOnlyUnidentifiedBirds, alreadyIdentifiedList, identifiedCurrentSession) {

	let result = [];

	if (!alreadyIdentifiedList) {
		return null;
	}

	let startIdx = 0, endIdx = NUM_BIRDS_TOTAL;

	// Check if filtering results for a specific collection

	const filteredCollection = COLLECTIONS[collectionId];

	if (filteredCollection) {
		startIdx = filteredCollection.min_id;
		endIdx = filteredCollection.max_id + 1;
	}

	for (let i = startIdx; i < endIdx; i++) {

		// Check if filtering results to hide already identified birds
		if (showOnlyUnidentifiedBirds) {

			if (i >= 2335 &&
				i < NUM_BIRDS_TOTAL &&
				!alreadyIdentifiedList[i] &&
				!identifiedCurrentSession[i]) {
                result.push({ id: i, cached: false });
			}

		// Otherwise, include all birds by default
		} else {

            const cached =
                i < 2335 ||
                alreadyIdentifiedList[i] ||
                identifiedCurrentSession[i];

            result.push({ id: i, cached });

		}

	}

	return result;

}
