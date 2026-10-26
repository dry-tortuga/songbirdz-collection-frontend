import { useEffect, useState } from "react";

import { fetchDailyStreak } from "../utils/data";

const useDailyStreak = ({ address }) => {

	const [tracker, setTracker] = useState(null);

	useEffect(() => {

		setTracker(null);

		if (!address) { return undefined; }

		let cancelled = false;

		fetchDailyStreak(address).then((result) => {
			if (!cancelled) { setTracker(result || null); }
		});

		return () => { cancelled = true; };

	}, [address]);

	return tracker;

};

export default useDailyStreak;