import { useCallback, useEffect, useState } from "react";

const TOTAL_SIZE = 20;

const useMemoryMatchGameLeaderboard = ({ account, difficultyMode, sortBy = "total" }) => {

	const [showLeaderboard, setShowLeaderboard] = useState(false);

	const [data, setData] = useState({
		data: null,
		loading: false,
		error: null,
	});

	const fetchLeaderboard = useCallback(async () => {

		setData({ loading: true, data: null, error: null });

		try {

			// const response = await fetch(
			//	`${process.env.REACT_APP_SONGBIRDZ_BACKEND_URL}/birds/memory-match/leaderboard?address=${account}&mode=${difficultyMode}&sort_by=${sortBy}&size=${TOTAL_SIZE}`
			// );

			// if (!response.ok) {
			//	throw new Error('Failed to fetch the leaderboard.');
			// }

			// const results = await response.json();

			const results = [{
				address: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
				total: 1250,
				today: 250,
				rank: 1
			}, {
				address: "0x9D7b0aC84B5A9067f17C82A46D10068114C5D827",
				total: 980,
				today: 180,
				rank: 2
			}, {
				address: "0x4b29CeF0842B99d6227742785B93149Bd1aA43A8",
				total: 875,
				today: 175,
				rank: 3
			}, {
				address: "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65",
				total: 750,
				today: 150,
				rank: 4
			}, {
				address: "0x90F79bf6EB2c4f870365E785982E1f101E93b906",
				total: 600,
				today: 100,
				rank: 5
			}];

			setData({ loading: false, error: null, data: results });

		} catch (error) {
			setData({ loading: false, error: error.message, data: null });
		}

	}, [account, difficultyMode, sortBy]);

	// Fetch the leaderboard data when showing for the first time
	// and/or changing difficulty mode
	useEffect(() => {

		if (showLeaderboard) {
			fetchLeaderboard();
		}

	}, [showLeaderboard, fetchLeaderboard]);

	return {
		showLeaderboard,
		setShowLeaderboard,
		leaderboardData: data,
		setLeaderboardData: setData,
	};

};

export default useMemoryMatchGameLeaderboard;
