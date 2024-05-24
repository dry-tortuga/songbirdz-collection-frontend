import { COLLECTION_BIRD_SIZE } from "../constants";

async function fetchBird(context, id) {

	console.debug("fetching bird #" + id);

	const data = {
		id,
		name: `Songbird #${id}`,
		owner: null,
		species: null,
		image: `${process.env.PUBLIC_URL}/images/${id}.jpg`,
		imageLg: `${process.env.PUBLIC_URL}/images/${id}-lg.jpg`,
		collection: Math.floor(id / COLLECTION_BIRD_SIZE),
	};

	// Fetch the owner data from the solidity contract
	const [owner] = await context.actions.ownerOf(id);

	data.owner = owner;

	// Fetch the off-chain metadata from the back-end server
	const finalData = await populateMetadata(data);

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
	populateMetadata,
};
