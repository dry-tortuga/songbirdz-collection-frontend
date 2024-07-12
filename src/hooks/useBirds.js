import { useEffect, useMemo, useState } from "react";

import { NUM_BIRDS_TOTAL, ALREADY_IDENTIFIED_BIRDS } from "../constants";
import { fetchBird } from "../utils/data";

const PAGE_SIZE = 10;

const useBirds = ({ context, collection, showOnlyUnidentifiedBirds }) => {

	// Keep track of pagination state

	const [data, setData] = useState(null);
	const [pagination, setPagination] = useState(initPaginationState(showOnlyUnidentifiedBirds));

	// Re-calculate pagination state if changing filters

	useEffect(() => {

		setPagination(initPaginationState(showOnlyUnidentifiedBirds));

	}, [showOnlyUnidentifiedBirds]);

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
			setPagination(initPaginationState(showOnlyUnidentifiedBirds));

		}

	}, [context, data, showOnlyUnidentifiedBirds]);

	return {
		data,
		pagination,
		onChangePage,
	};

};

export default useBirds;

function initPaginationState(showOnlyUnidentifiedBirds) {

	const birdIDsPerPage = [];

	for (let i = 0; i < NUM_BIRDS_TOTAL; i++) {

		if (!showOnlyUnidentifiedBirds || (
			i >= 370 &&
			i <= 818 &&
			!ALREADY_IDENTIFIED_BIRDS[i]
		)) {
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
