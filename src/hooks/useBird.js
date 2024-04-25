import { useEffect, useState } from "react";

import { fetchBird } from "../utils/data";

const useBird = ({ context, id }) => {

	const [data, setData] = useState(null);
	const [fetchedId, setFetchedId] = useState(null);

	// Fetch the bird data from the backend contract
	useEffect(() => {

		if (context.songBirdzContract &&
			context.account &&
			context.chainId === process.env.REACT_APP_BASE_NETWORK_CHAIN_ID &&
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

	return [data, setData];

};

export default useBird;
