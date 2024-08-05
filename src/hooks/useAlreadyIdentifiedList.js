import { useEffect, useState } from "react";

import { fetchUnidentifiedList } from "../utils/data";

const useAlreadyIdentifiedList = ({ hideAlreadyIdentifiedParam = false }) => {

	const [data, setData] = useState(null);
	const [showOnlyUnidentifiedBirds, setShowOnlyUnidentifiedBirds] = useState(
		Boolean(hideAlreadyIdentifiedParam)
	);

	useEffect(() => {

		fetchUnidentifiedList().then((result) => {

			if (result?.results) {
				setData(result.results);
			} else {
				setData({});
			}

		}).catch((error) => {

			console.error(error);
			setData({});

		});

	}, []);

	return {
		alreadyIdentifiedList: data,
		showOnlyUnidentifiedBirds,
		setShowOnlyUnidentifiedBirds,
	};

};

export default useAlreadyIdentifiedList;
