import { useEffect, useState } from "react";

import { useWalletContext } from "../contexts/wallet";

import { fetchBird } from "../utils/data";

const useBird = ({ context, id, cached }) => {

    const { currentUser } = useWalletContext();

	const [data, setData] = useState(null);

	// Fetch the bird data from the backend contract
	useEffect(() => {

		const fetch = async () => {

			try {

                let owner = null;

                // Check to see if bird has been identified in this current session
                if (currentUser?.identified?.[id]) {

                    setData(currentUser.identified[id]);

                } else {

                    // Check cache to see if bird has already been successfully identified
                    if (cached) {

                        // Fetch the owner data from the solidity contract
                        [owner] = await context.actions.ownerOf(id);

                    }

                    // Fetch the meta data from the backend server
                    const result = await fetchBird(id, owner, cached);

                    setData(result);

                }

			} catch (error) {
				console.error(error);
			}

		}

		fetch();

	}, [context.actions, id, currentUser?.identified]);

	return [data, setData];

};

export default useBird;
