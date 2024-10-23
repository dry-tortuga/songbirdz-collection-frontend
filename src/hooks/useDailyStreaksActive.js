import { useEffect, useState } from "react";

import { fetchDailyStreaksActive } from "../utils/data";

const TOTAL_SIZE = 52;

const useDailyStreaksActive = ({ account }) => {

	const [data, setData] = useState(null);

	// Reset the data if the account changes
	useEffect(() => setData(null), [account]);

	// Fetch the data from the backend server
	useEffect(() => {

		if (!data) {

			const fetch = async () => {

				const results = await fetchDailyStreaksActive(account, TOTAL_SIZE);

				setData(results);

			};

			fetch();

		}

	}, [data, account]);

	return { data, setData };

};

export default useDailyStreaksActive;
