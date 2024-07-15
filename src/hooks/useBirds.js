import { useEffect, useMemo, useState } from "react";

import { NUM_BIRDS_TOTAL, ALREADY_IDENTIFIED_BIRDS } from "../constants";
import { fetchBird } from "../utils/data";

const PAGE_SIZE = 10;

const useBirds = ({ context, collection, showOnlyUnidentifiedBirds }) => {

	// Keep track of pagination state

	const [data, setData] = useState(null);
	const [pagination, setPagination] = useState(initPaginationState(collection, showOnlyUnidentifiedBirds));

	// Re-calculate pagination state if changing filters

	useEffect(() => {

		setPagination(initPaginationState(collection, showOnlyUnidentifiedBirds));

	}, [collection, showOnlyUnidentifiedBirds]);

	const onChangePage = (newValue) => setPagination((prev) => ({
		...prev,
		current_page: newValue,
	}));

	// Fetch the birds data from the backend contract
	useEffect(() => {

		if (context.account && context.isOnCorrectChain) {

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
		context.account,
		context.isOnCorrectChain,
		context.actions,
		pagination.birdIDsPerPage.length,
		pagination.current_page,
		pagination.page_size,
	]);

	// Reset data on chain changes...
	useEffect(() => {

		if (data && !context.isOnCorrectChain) {

			setData(null);
			setPagination(initPaginationState(collection, showOnlyUnidentifiedBirds));

		}

	}, [context, data, collection, showOnlyUnidentifiedBirds]);

	return {
		data,
		pagination,
		onChangePage,
	};

};

export default useBirds;

function initPaginationState(collection, showOnlyUnidentifiedBirds) {

	const birdIDsPerPage = [];

	let startIdx = 0, endIdx = NUM_BIRDS_TOTAL;

	// Check if filtering results for a specific collection
	if (collection) {
		startIdx = collection.min_id;
		endIdx = collection.max_id;
	}

	for (let i = startIdx; i < endIdx; i++) {

		// Check if filtering results to hide already identified birds
		if (!showOnlyUnidentifiedBirds) {
			birdIDsPerPage.push(i);
		}

	}

	return {
		birdIDsPerPage,
		page_size: PAGE_SIZE,
		num_pages: Math.ceil(birdIDsPerPage.length / PAGE_SIZE),
		current_page: 0,
	};

}
