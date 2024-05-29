import { useEffect, useState } from "react";

import { fetchBird } from "../utils/data";

const useBird = ({ context, id }) => {

	const [data, setData] = useState(null);
	const [fetchedId, setFetchedId] = useState(null);

	// Fetch the bird data from the backend contract
	useEffect(() => {

		if (!context.account) {
			return;
		}

		if (!context.isOnCorrectChain) {
			return;
		}

		if (id === fetchedId) {
			return;
		}

		const fetch = async () => {

			try {

				setFetchedId(id);

				// Fetch the owner data from the solidity contract
				const [owner] = await context.actions.ownerOf(id);

				// Fetch the meta data from the backend server
				const result = await fetchBird(id, owner);

				setData(result);

			} catch (error) {
				console.error(error);
			}

		}

		fetch();

	}, [context.account, context.isOnCorrectChain, context.actions, id, fetchedId]);

	// Reset data on chain changes
	useEffect(() => {

		if (data && !context.isOnCorrectChain) {

			setData(null);
			setFetchedId(null);

		}

	}, [context, data]);

	return [data, setData];

};

export default useBird;
