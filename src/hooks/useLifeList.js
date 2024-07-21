import { useEffect, useState } from "react";

import { fetchLifeList } from "../utils/data";

const useLifeList = ({ address }) => {

	const [data, setData] = useState(null);

	// Fetch the life list data for a user
	useEffect(() => {

		if (!data && address) {

			const fetch = async () => {

				// Fetch the life list data from the backend server
				const results = await fetchLifeList(address);

				// Convert results into map of species ID -> data
				const speciesByID = {};

				for (let i = 0, len = results.length; i < len; i++) {

					const result = results[i];

					speciesByID[result.species_id] = result;

				}

				setData(speciesByID);

			};

			fetch();

		}

	}, [data]);

	return { data };

};

export default useLifeList;
