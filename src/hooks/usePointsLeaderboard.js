import { useEffect, useState } from "react";

import { ADRESSES_TO_IGNORE } from "../constants";
import { fetchPointsLeaderboard } from "../utils/data";

const TOTAL_SIZE = 55;

const usePointsLeaderboard = ({ account, season }) => {

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

                setData(users);

            };

            fetch();

        }

    }, [data, account, season]);

    return { data, setData };

};

export default usePointsLeaderboard;
