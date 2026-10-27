import { useEffect, useState } from "react";

import { fetchLifeListData, fetchLifeListLeaderboard } from "../utils/data";
import { buildLifeList } from "../utils/lifeList";

const LEADERBOARD_SIZE = 55;

const EMPTY = { data: null, loading: false, error: false };

// Loads one user's Life List and rank. Refetches whenever the address changes.
const useLifeList = ({ address }) => {

	const [result, setResult] = useState(EMPTY);

	useEffect(() => {

		if (!address) {
			setResult(EMPTY);
			return undefined;
		}

		let cancelled = false;

		setResult({ data: null, loading: true, error: false });

		Promise.all([
			fetchLifeListData(address),
			fetchLifeListLeaderboard(address, LEADERBOARD_SIZE),
		]).then(([raw, board]) => {

			if (cancelled) { return; }

			if (!raw) {
				setResult({ data: null, loading: false, error: true });
				return;
			}

			const entry = (board || []).find((user) => user.address === address);

			setResult({
				data: {
					...buildLifeList(raw),
					rank: entry?.rank ?? null,
					rarestBirdId: entry?.rarest_bird_id ?? null,
				},
				loading: false,
				error: false,
			});

		});

		return () => { cancelled = true; };

	}, [address]);

	return result;

};

export default useLifeList;
