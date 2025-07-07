import { useEffect, useState } from "react";

import { ADRESSES_TO_IGNORE } from "../constants";

import { useFarcasterContext } from "../contexts/farcaster";
import { fetchPointsLeaderboard } from "../utils/data";

const TOTAL_SIZE = 54;

const usePointsLeaderboard = ({ account, season }) => {

	const { fPopulateUsers } = useFarcasterContext();

    const [data, setData] = useState(null);

    // Reset the leaderboard data if the account changes
    useEffect(() => setData(null), [account]);

    // Fetch the leaderboard data
    useEffect(() => {

        if (!data && season >= 1) {

            const fetch = async () => {

                // Fetch the leaderboard data from the backend server
                let users = await fetchPointsLeaderboard(season, account, TOTAL_SIZE);

                users = users
                	.filter((user) => !ADRESSES_TO_IGNORE.includes(user.address))
                 	.slice(0, 51);

				users = await fPopulateUsers(users);

                setData(users);

            };

            fetch();

        }

    }, [data, account, season, fPopulateUsers]);

    return { data, setData };

};

export default usePointsLeaderboard;
