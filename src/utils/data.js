import { COLLECTION_BIRD_SIZE } from "../constants";

async function fetchBird(id, owner) {

	console.debug("fetching bird #" + id);

	let image = `${process.env.PUBLIC_URL}/images/${id}.jpg`;
	let imageLg = `${process.env.PUBLIC_URL}/images/${id}-lg.jpg`;

	// Check if it is one of the "1 of 1" species...
	if (id === 2844 || id === 2603 || id === 2673 || id === 2574 || id === 2202) {

		if (!owner) {
			image = `${process.env.PUBLIC_URL}/images/${id}-pre.jpg`;
			imageLg =`${process.env.PUBLIC_URL}/images/${id}-lg-pre.jpg`;
		}

	}

	const data = {
		id,
		name: `Songbird #${id}`,
		owner,
		species: null,
		image,
		imageLg,
		collection: Math.floor(id / COLLECTION_BIRD_SIZE),
	};

	// Fetch the off-chain metadata from the back-end server
	const finalData = await populateMetadata(data);

	return finalData;

}

async function fetchLeaderboard(season, size) {

	let finalData;

	try {

		// Fetch the points data from the back-end server
		const response = await fetch(
			`${process.env.REACT_APP_SONGBIRDZ_BACKEND_URL}/birds/leaderboard?season=${season}&limit=${size}`
		);

		// Parse the points data
		if (response.status === 200) {
			finalData = await response.json();
		}

	} catch (error) {

		console.debug("---- ERROR FETCHING LEADERBOARD DATA ----");
		console.debug(error);
		console.debug("--------------------------------------");

	}

	return finalData;

}

async function fetchLifeList(address) {

	let finalData;

	try {

		// Fetch the points data from the back-end server
		const response = await fetch(
			`${process.env.REACT_APP_SONGBIRDZ_BACKEND_URL}/birds/life-list?address=${address}`
		);

		// Parse the points data
		if (response.status === 200) {
			finalData = await response.json();
		}

	} catch (error) {

		console.debug("---- ERROR FETCHING LIFE LIST DATA ----");
		console.debug(error);
		console.debug("--------------------------------------");

	}

	return finalData;

}

async function fetchUnidentifiedList() {

	let finalData;

	try {

		// Fetch the points data from the back-end server
		const response = await fetch(
			`${process.env.REACT_APP_SONGBIRDZ_BACKEND_URL}/birds/already-identified-list`
		);

		// Parse the points data
		if (response.status === 200) {
			finalData = await response.json();
		}

	} catch (error) {

		console.debug("---- ERROR FETCHING ALREADY IDENTIFIED LIST DATA ----");
		console.debug(error);
		console.debug("--------------------------------------");

	}

	return finalData;

}

async function populateMetadata(data) {

	const finalData = { ...data };

	if (data.owner) {

		try {

			// Fetch the off-chain metadata from the back-end server
			const response = await fetch(
				`${process.env.REACT_APP_SONGBIRDZ_CONTRACT_BASE_URI_METADATA}/${data.id}`
			);

			// Parse the off-chain metadata for the bird
			if (response.status === 200) {

				const responseData = await response.json();

				finalData.species = responseData.species;

			}

		} catch (error) {

			console.debug("---- ERROR FETCHING BIRD METADATA ----");
			console.debug(error);
			console.debug("--------------------------------------");

			finalData.species = "UNIDENTIFIED";

		}

	} else {

		finalData.species = "UNIDENTIFIED";

	}

	return finalData;

}

export {
	fetchBird,
	fetchLeaderboard,
	fetchLifeList,
	fetchUnidentifiedList,
	populateMetadata,
};
