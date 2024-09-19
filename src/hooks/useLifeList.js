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

				const resultsSeason1 = results.season_1;
				const resultsSeason2 = results.season_2;

				// Convert results into map of species ID -> data
				const speciesByID = {
					season_1: {},
					season_2: {},
				};

				for (let i = 0, len = resultsSeason1.length; i < len; i++) {

					const temp = resultsSeason1[i];

					speciesByID.season_1[temp.species_id] = {
						...temp,
					};

				}

				for (let i = 0, len = resultsSeason2.length; i < len; i++) {

					const temp = resultsSeason2[i];

					speciesByID.season_2[temp.species_id] = {
						...temp,
					};

				}

				setData(speciesByID);

			};

			fetch();

		}

	}, [data]);

	return { data };

};

export default useLifeList;
