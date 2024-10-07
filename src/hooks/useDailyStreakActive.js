import { useEffect, useState } from "react";

import { fetchDailyStreakActive } from "../utils/data";

const TOTAL_SIZE = 52;

const useDailyStreakActive = ({ account }) => {

	const [data, setData] = useState(null);

	// Reset the data if the account changes
	useEffect(() => setData(null), [account]);

	// Fetch the data from the backend server
	useEffect(() => {

		if (!data) {

			const fetch = async () => {

				const results = await fetchDailyStreakActive(account, TOTAL_SIZE);

				setData(results);

			};

			fetch();

		}

	}, [data, account]);

	return { data, setData };

};

export default useDailyStreakActive;
