import { useEffect, useState } from "react";
import { useReadContract } from "wagmi";

import SongBirdzContract from "../abi/SongBirdz.json";
import { fetchBird } from "../utils/data";

const useBird = ({ context, id }) => {

	const [data, setData] = useState(null);
	const [fetchedId, setFetchedId] = useState(null);

	const result = useReadContract({
		abi: SongBirdzContract.abi,
		address:
			'0x7C3B795e2174C5E0C4F7d563A2FB34F024C8390B' ||
			process.env.REACT_APP_SONGBIRDZ_CONTRACT_ADDRESS,
		functionName: "ownerOf",
		args: [id],
	});

	console.log(result);

	// Fetch the bird data from the backend contract
	useEffect(() => {

		if (context.songBirdzContract &&
			context.account &&
			context.isOnCorrectChain &&
			id !== fetchedId) {

			const fetch = async () => {

				try {

					const result = await fetchBird(context.songBirdzContract, id);

					setFetchedId(id);
					setData(result);

				} catch (error) {
					console.error(error);
				}

			}

			fetch();

		}

	}, [context, id, fetchedId, data]);

	// Reset data on chain changes...
	useEffect(() => {

		if (!context.isOnCorrectChain) {

			setData(null);
			setFetchedId(null);

		}

	}, [context]);

	return [data, setData];

};

export default useBird;
