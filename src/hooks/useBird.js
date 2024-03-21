import { useEffect, useState } from "react";

import { fetchBird } from "../utils/data";

const useBird = ({ context, id }) => {

	const [data, setData] = useState(null);

	// Fetch the bird data from the backend contract
	useEffect(() => {

		if (context.songBirdzContract && context.account && !data) {

			const fetch = async () => {

				try {

					const result = await fetchBird(context.songBirdzContract, id);

					setData(result);

				} catch (error) {
					console.error(error);
				}

			}

			fetch();

		}

	}, [context, id, data]);

	return [data, setData];

};

export default useBird;
