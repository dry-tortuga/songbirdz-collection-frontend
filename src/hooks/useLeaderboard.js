import { useEffect, useState } from "react";

import { fetchLeaderboard } from "../utils/data";

const TOTAL_SIZE = 52;

const useLeaderboard = () => {

	const [data, setData] = useState(null);

	// Fetch the leaderboard data
	useEffect(() => {

		if (!data) {

			const fetch = async () => {

				// Fetch the leaderboard data from the backend server
				const results = await fetchLeaderboard(TOTAL_SIZE);

				setData(results);

			};

			fetch();

		}

	}, [data]);

	return { data };

};

export default useLeaderboard;
