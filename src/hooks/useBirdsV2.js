import { useEffect, useState } from "react";

import { COLLECTIONS, NUM_BIRDS_TOTAL } from "../constants";
import { fetchBird } from "../utils/data";

const useBirdsV2 = (props) => {

	const {
		context,
		collectionId,
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
				alreadyIdentifiedList,
				identifiedCurrentSession,
			);

			if (idsToFetch) {

				const results = [];

				for (let i = 0; i < idsToFetch.length; i++) {

					const id = idsToFetch[i];

					const owner = null;

					// Fetch the metadata from the backend server
					const bird = await fetchBird(id, owner);

					results.push(bird);

				}

				setData(results);

			}

		};

		fetch();

	}, [
		context.actions,
		filters.collectionId,
		alreadyIdentifiedList,
		identifiedCurrentSession,
	]);

	return {
		data,
		filters,
		onChangeFilter,
		onChangeIdentified:
		  (id) => setIdentifiedCurrentSession((prev) => ({ ...prev, [id]: true })),
	};

};

export default useBirdsV2;

function initBirdsState(collectionId, alreadyIdentifiedList, identifiedCurrentSession) {

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

		if (i >= 2335 &&
			i < NUM_BIRDS_TOTAL &&
			!alreadyIdentifiedList[i] &&
			!identifiedCurrentSession[i]) {
			result.push(i);
		}

	}

	return result;

}
