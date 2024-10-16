import { useEffect, useState } from "react";

import { fetchLeaderboard } from "../utils/data";

const TOTAL_SIZE = 52;

const useLeaderboard = ({ account, season }) => {

	const [data, setData] = useState(null);

	// Reset the leaderboard data if the account changes
	useEffect(() => setData(null), [account]);

	// Fetch the leaderboard data
	useEffect(() => {

		if (!data && season >= 1) {

			const fetch = async () => {

				// Fetch the leaderboard data from the backend server
				const users = await fetchLeaderboard(season, account, TOTAL_SIZE);

				setData({
					users,
					timestampMessage:
						season === 1
							? "Results are final as of August 31st, 2024 11:00 PM UTC."
							: "Results last updated on October 10th, 2024 10:45 PM UTC. Leaderboard attempts to update in real-time, but points to be manually confirmed on a weekly basis in case any ERC-721 events are missed."
				});

			};

			fetch();

		}

	}, [data, account, season]);

	return { data, setData };

};

export default useLeaderboard;
