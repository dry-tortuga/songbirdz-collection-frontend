import { useEffect, useMemo, useState } from "react";

import { NUM_BIRDS_TOTAL } from "../constants";
import { fetchBird } from "../utils/data";

const PAGE_SIZE = 10;

const useBirds = ({ context, collection }) => {

	// eslint-disable-next-line no-unused-vars
	const [startIdx, endIdx, numPages] = useMemo(() => {

		let startIdxResult, endIndexResult;

		if (collection) {

			startIdxResult = collection.min_id;
			endIndexResult = collection.max_id;

		} else {

			startIdxResult = 0;
			endIndexResult = NUM_BIRDS_TOTAL - 1;

		}

		const numTotal = endIndexResult - startIdxResult + 1;

		const numPagesResult = Math.ceil(numTotal / PAGE_SIZE);

		return [startIdxResult, endIndexResult, numPagesResult];

	}, [collection]);

	// Keep track of pagination state

	const [data, setData] = useState(null);
	const [pagination, setPagination] = useState({
		page_size: PAGE_SIZE,
		num_pages: numPages,
		current_page: 0,
	});

	const onChangePage = (newValue) => setPagination((prev) => ({
		...prev,
		current_page: newValue,
	}));

	// Fetch the birds data from the backend contract
	useEffect(() => {

		if (context.account && context.isOnCorrectChain) {

			const startIdxFetch = startIdx + (pagination.current_page * pagination.page_size);
			const endIdxFetch = startIdx + ((pagination.current_page + 1) * pagination.page_size);

			const fetch = async () => {

				const results = [];

				for (let i = startIdxFetch; i < endIdxFetch; i++) {

					// Fetch the owner data from the solidity contract
					const [owner] = await context.actions.ownerOf(i);

					// Fetch the meta data from the backend server
					const bird = await fetchBird(i, owner);
		
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
		startIdx,
		pagination.current_page,
		pagination.page_size,
	]);

	// Reset data on chain changes...
	useEffect(() => {

		if (data && !context.isOnCorrectChain) {

			setData(null);
			setPagination({
				page_size: PAGE_SIZE,
				num_pages: numPages,
				current_page: 0,
			});

		}

	}, [context, data, numPages]);

	return {
		data,
		pagination,
		onChangePage,
	};

};

export default useBirds;
