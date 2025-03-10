import { useCallback, useEffect, useState } from "react";

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

			const response = await fetch(
				`${process.env.REACT_APP_SONGBIRDZ_BACKEND_URL}/birds/memory-match/leaderboard?address=${account}&mode=${difficultyMode}&sort_by=${sortBy}&size=20`
			);

			if (!response.ok) {
				throw new Error('Failed to fetch the leaderboard.');
			}

			const results = await response.json();

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
