import { useEffect, useState } from "react";

import { fetchDailyStreak } from "../utils/data";

const useCurrentUser = ({ account }) => {

	const [data, setData] = useState(null);

	// Fetch the daily streak data for the user from the backend server
	useEffect(() => {

		if (account) {

			setData(null);

			const fetch = async () => {

				const tracker = await fetchDailyStreak(account);

				setData({ dailyStreakTracker: tracker });

			};

			fetch();

		}

	}, [account]);

	return [data, setData];

};

export default useCurrentUser;
