import { useEffect, useState } from "react";

import { ADRESSES_TO_IGNORE } from "../constants";

import { fetchLifeListLeaderboard } from "../utils/data";

const TOTAL_SIZE = 55;

const useLifeListLeaderboard = ({ account }) => {

    const [data, setData] = useState(null);

    // Reset the leaderboard data if the account changes
    useEffect(() => setData(null), [account]);

    // Fetch the leaderboard data
    useEffect(() => {

        if (!data) {

            const fetch = async () => {

                // Fetch the leaderboard data from the backend server
                let users = await fetchLifeListLeaderboard(account, TOTAL_SIZE);

                users = users
                	.filter((user) => !ADRESSES_TO_IGNORE.includes(user.address))
                 	.slice(0, 51);

                setData(users);

            };

            fetch();

        }

    }, [data, account]);

    return { data, setData };

};

export default useLifeListLeaderboard;
