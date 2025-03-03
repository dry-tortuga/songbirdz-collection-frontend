import { useEffect, useState } from "react";

import { fetchLeaderboard } from "../utils/data";

const TOTAL_SIZE = 54;

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

                setData({ users });

            };

            fetch();

        }

    }, [data, account, season]);

    return { data, setData };

};

export default useLeaderboard;
