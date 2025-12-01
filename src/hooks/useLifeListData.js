import { useEffect, useState } from "react";

import { fetchLifeListData } from "../utils/data";

const useLifeListData = ({ address }) => {

	const [data, setData] = useState(null);

	// Fetch the life list data for a user
	useEffect(() => {

		if (!data && address) {

			const fetch = async () => {

				// Fetch the life list data from the backend server
				const results = await fetchLifeListData(address);

				const resultsSeason1 = results.season_1;
				const resultsSeason2 = results.season_2;
                const resultsSeason3 = results.season_3;
                const resultsSeason4 = results.season_4;
                const resultsSeason5 = results.season_5;
                const resultsSeason6 = results.season_6;
                const resultsSeason7 = results.season_7;

				// Convert results into map of species ID -> data
				const speciesByID = {
					season_1: {},
					season_2: {},
                    season_3: {},
                    season_4: {},
                    season_5: {},
                    season_6: {},
                    season_7: {},
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

				for (let i = 0, len = resultsSeason3.length; i < len; i++) {

					const temp = resultsSeason3[i];

					speciesByID.season_3[temp.species_id] = {
						...temp,
					};

				}

				for (let i = 0, len = resultsSeason4.length; i < len; i++) {

					const temp = resultsSeason4[i];

					speciesByID.season_4[temp.species_id] = {
						...temp,
					};

				}

				for (let i = 0, len = resultsSeason5.length; i < len; i++) {

					const temp = resultsSeason5[i];

					speciesByID.season_5[temp.species_id] = {
						...temp,
					};

				}

				for (let i = 0, len = resultsSeason6.length; i < len; i++) {

					const temp = resultsSeason6[i];

					speciesByID.season_6[temp.species_id] = {
						...temp,
					};

				}

				for (let i = 0, len = resultsSeason7.length; i < len; i++) {

					const temp = resultsSeason7[i];

					speciesByID.season_7[temp.species_id] = {
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

export default useLifeListData;
