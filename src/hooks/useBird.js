import { useEffect, useState } from "react";

import { fetchBird } from "../utils/data";

const useBird = ({ context, id }) => {

	const [data, setData] = useState(null);
	const [fetchedId, setFetchedId] = useState(null);

	// Fetch the bird data from the backend contract
	useEffect(() => {

		if (context.songBirdzContract &&
			context.account &&
			context.isOnCorrectChain &&
			id !== fetchedId) {

			const fetch = async () => {

				try {

					const result = await fetchBird(context.songBirdzContract, id);

					setFetchedId(id);
					setData(result);

				} catch (error) {
					console.error(error);
				}

			}

			fetch();

		}

	}, [context, id, fetchedId, data]);

	// Reset data on chain changes...
	useEffect(() => {

		if (!context.isOnCorrectChain) {

			setData(null);
			setFetchedId(null);

		}

	}, [context]);

	return [data, setData];

};

export default useBird;
