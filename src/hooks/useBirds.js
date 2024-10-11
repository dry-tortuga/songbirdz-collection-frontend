import { useEffect, useMemo, useState } from "react";

import {
	COLLECTIONS,
	NUM_BIRDS_TOTAL,
	ALREADY_IDENTIFIED_BIRDS,
} from "../constants";
import { fetchBird } from "../utils/data";

const PAGE_SIZE = 10;

const useBirds = (props) => {

	const {
		context,
		collectionId,
		showOnlyUnidentifiedBirds,
		alreadyIdentifiedList,
	} = props;

	// Keep track of filter state

	const [filters, setFilters] = useState({ collectionId });

	// Keep track of pagination state

	const [data, setData] = useState(null);
	const [pagination, setPagination] = useState(initPaginationState(
		collectionId,
		showOnlyUnidentifiedBirds,
		alreadyIdentifiedList,
	));

	// Re-calculate pagination state if changing filters

	useEffect(() => {

		setPagination(initPaginationState(
			filters.collectionId,
			showOnlyUnidentifiedBirds,
			alreadyIdentifiedList,
		));

	}, [filters.collectionId, showOnlyUnidentifiedBirds, alreadyIdentifiedList]);

	const onChangeFilter = (key, newValue) => {

		setFilters((prev) => ({
			...prev,
			[key]: newValue,
		}));

	};

	const onChangePage = (newValue) => setPagination((prev) => ({
		...prev,
		current_page: newValue,
	}));

	// Fetch the birds data from the backend contract
	useEffect(() => {

		if (pagination.birdIDsPerPage) {

			const startIdxFetch = pagination.current_page * pagination.page_size;
			const endIdxFetch = (pagination.current_page + 1) * pagination.page_size;

			const idsToFetch = pagination.birdIDsPerPage.slice(startIdxFetch, endIdxFetch);

			const fetch = async () => {

				const results = [];

				for (let i = 0; i < idsToFetch.length; i++) {

					const id = idsToFetch[i];

					// Fetch the owner data from the solidity contract
					const [owner] = await context.actions.ownerOf(id);

					// Fetch the meta data from the backend server
					const bird = await fetchBird(id, owner);
		
					results.push(bird);

				}

				setData(results);

			};

			fetch();

		}

	}, [
		context.actions,
		pagination.birdIDsPerPage?.length,
		pagination.current_page,
		pagination.page_size,
		pagination.current_collection_id,
	]);

	return {
		data,
		filters,
		pagination,
		onChangeFilter,
		onChangePage,
	};

};

export default useBirds;

function initPaginationState(collectionId, showOnlyUnidentifiedBirds, alreadyIdentifiedList) {

	let birdIDsPerPage = [];

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

			if (!alreadyIdentifiedList) {

				birdIDsPerPage = null;

			} else if (i >= 2276 && i <= 3999 && !alreadyIdentifiedList[i]) {

				birdIDsPerPage.push(i);

			}

		} else {

			birdIDsPerPage.push(i);

		}

	}

	return {
		birdIDsPerPage,
		page_size: PAGE_SIZE,
		num_pages: birdIDsPerPage ? Math.ceil(birdIDsPerPage.length / PAGE_SIZE) : null,
		current_page: 0,
		current_collection_id: collectionId,
	};

}
