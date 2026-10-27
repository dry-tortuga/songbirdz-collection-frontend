import { useEffect, useState } from "react";

import { fetchSpeciesSupply } from "../utils/data";

// Module-level cache so the supply map is only fetched once per page load
let cached = null;

const useSpeciesSupply = () => {

	const [supply, setSupply] = useState(cached);

	useEffect(() => {

		if (supply) {
			return undefined;
		}

		let cancelled = false;

		fetchSpeciesSupply().then((data) => {

			if (!cancelled && data) {
				cached = data;
				setSupply(data);
			}

		});

		return () => { cancelled = true; };

	}, [supply]);

	return supply;

};

export default useSpeciesSupply;
