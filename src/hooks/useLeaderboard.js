import { useEffect, useState } from "react";

import { fetchLeaderboard } from "../utils/data";

const TOTAL_SIZE = 53;

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

                let timestampMessage;

                if (season === 3) {
                    timestampMessage = "Runs from December 1st, 2024 12AM UTC to February 28th, 2025 11PM UTC. Leaderboard attempts to update in real-time, but points to be manually confirmed on a weekly basis in case any ERC-721 events are missed. Last confirmed on January 17th, 2025 2:30PM UTC. ";
                }

                setData({
                    users,
                    timestampMessage,
                });

            };

            fetch();

        }

    }, [data, account, season]);

    return { data, setData };

};

export default useLeaderboard;
