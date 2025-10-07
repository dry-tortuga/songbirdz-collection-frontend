import { useEffect, useState } from "react";

import { fetchBirdOfTheWeek } from "../utils/data";

const useBirdOfTheWeek = () => {

	const [data, setData] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	// Fetch the data from the backend server
	useEffect(() => {

		const fetch = async () => {

			try {

				const result = await fetchBirdOfTheWeek();

				setData(result);

			} catch (apiError) {

				console.error(apiError);
				setError(apiError);

			} finally {
				setLoading(false);
			}

		}

		fetch();

	}, []);

	return {
		data,
		loading,
		error,
	};

};

export default useBirdOfTheWeek;
