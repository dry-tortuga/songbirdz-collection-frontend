import { useEffect, useState } from "react";

import { fetchBird } from "../utils/data";

const useBird = ({ context, id }) => {

	const [data, setData] = useState(null);
	const [fetchedId, setFetchedId] = useState(null);

	// Fetch the bird data from the backend contract
	useEffect(() => {

		if (context.account &&
			context.isOnCorrectChain &&
			(!fetchedId || id !== fetchedId)) {

			setFetchedId(id);

			// TODO: Debug duplicate fetchBird call()

			const fetch = async () => {

				try {

					const result = await fetchBird(context, id);

					setData(result);

				} catch (error) {
					console.error(error);
				}

			}

			fetch();

		}

	}, [context, id, fetchedId]);

	// Reset data on chain changes
	useEffect(() => {

		if (!context.isOnCorrectChain) {

			setData(null);
			setFetchedId(null);

		}

	}, [context]);

	return [data, setData];

};

export default useBird;
