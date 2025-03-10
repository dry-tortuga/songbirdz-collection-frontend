import { useEffect, useState } from 'react';

import { getMemoryMatchGamesPlayedToday } from "../utils/data";

const useMemoryMatchGamesPlayed = ({ account }) => {

	const [gamesPlayedToday, setGamesPlayedToday] = useState(0);

	useEffect(() => {

		if (account) {

			const fetchGamesPlayed = async () => {
				try {
					const gamesPlayed = await getMemoryMatchGamesPlayedToday(account);
					setGamesPlayedToday(gamesPlayed);
				} catch (error) {
					console.error('Error fetching games played:', error);
					setGamesPlayedToday(3);
				}
			};

			fetchGamesPlayed();

		} else {
			setGamesPlayedToday(0);
		}

	}, [account]);

	return { gamesPlayedToday, setGamesPlayedToday };

};

export default useMemoryMatchGamesPlayed;
