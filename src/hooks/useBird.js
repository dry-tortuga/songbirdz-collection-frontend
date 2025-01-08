import { useEffect, useState } from "react";

import { fetchBird } from "../utils/data";

const useBird = ({ context, id, cached }) => {

	const [data, setData] = useState(null);
	const [fetchedId, setFetchedId] = useState(null);

	// Fetch the bird data from the backend contract
	useEffect(() => {

		if (id === fetchedId) {
			return;
		}

		const fetch = async () => {

			try {

				setFetchedId(id);

                let owner = null;

                console.log(cached);

                // Check cache to see if bird has already been successfully identified
                if (cached) {

    				// Fetch the owner data from the solidity contract
    				[owner] = await context.actions.ownerOf(id);

                }

				// Fetch the meta data from the backend server
				const result = await fetchBird(id, owner, cached);

				setData(result);

			} catch (error) {
				console.error(error);
			}

		}

		fetch();

	}, [context.actions, id, fetchedId, cached]);

	return [data, setData];

};

export default useBird;
