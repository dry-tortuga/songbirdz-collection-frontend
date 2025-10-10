import { AUDIO_CONTRIBUTORS, COLLECTION_BIRD_SIZE } from "../constants";

async function fetchBird(id, owner, cached) {

	const data = {
		id,
		name: `Songbird #${id}`,
		owner,
		species: null,
		audio: `${process.env.REACT_APP_SONGBIRDZ_STATIC_URL}/audio/${id}.mp3`,
		audio_contributor_species: AUDIO_CONTRIBUTORS[id]?.species,
		audio_contributor_name: AUDIO_CONTRIBUTORS[id]?.author,
		image: `${process.env.REACT_APP_SONGBIRDZ_STATIC_URL}/images/${id}.jpg`,
		imageLg: `${process.env.REACT_APP_SONGBIRDZ_STATIC_URL}/images/${id}-lg.jpg`,
		collection: Math.floor(id / COLLECTION_BIRD_SIZE),
		cached,
	};

	// Fetch the off-chain species metadata from the back-end server
	const finalData = await populateMetadata(data);

	return finalData;

}

async function fetchPointsLeaderboard(season, address, size) {

	let finalData;

	try {

		let url = `${process.env.REACT_APP_SONGBIRDZ_BACKEND_URL}/birds/points/leaderboard?season=${season}&limit=${size}`;

		if (address) {
			url += `&address=${address.toLowerCase()}`;
		}

		// Fetch the points data from the back-end server
		const response = await fetch(url);

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

async function fetchLifeListData(address) {

	let finalData;

	try {

		// Fetch the points data from the back-end server
		const response = await fetch(
			`${process.env.REACT_APP_SONGBIRDZ_BACKEND_URL}/birds/life-list/data?address=${address}`
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

async function fetchLifeListLeaderboard(address, size) {

	let finalData;

	try {

		let url = `${process.env.REACT_APP_SONGBIRDZ_BACKEND_URL}/birds/life-list/leaderboard?limit=${size}`;

		if (address) {
			url += `&address=${address.toLowerCase()}`;
		}

		// Fetch the leaderboard data from the back-end server
		const response = await fetch(url);

		// Parse the leaderboard data
		if (response.status === 200) {
			finalData = await response.json();
		}

	} catch (error) {

		console.debug("---- ERROR FETCHING LIFE LIST LEADERBOARD DATA ----");
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
				`${process.env.REACT_APP_SONGBIRDZ_BACKEND_URL}/birds/metadata/${data.id}`
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

async function fetchDailyStreaksActive(address, size) {

	let finalData;

	try {

		let url = `${process.env.REACT_APP_SONGBIRDZ_BACKEND_URL}/birds/daily-streaks/active?limit=${size}`;

		if (address) {
			url += `&address=${address.toLowerCase()}`;
		}

		// Fetch the points data from the back-end server
		const response = await fetch(url);

		// Parse the points data
		if (response.status === 200) {
			finalData = await response.json();
		}

	} catch (error) {

		console.debug("---- ERROR FETCHING DAILY STREAK ACTIVE DATA ----");
		console.debug(error);
		console.debug("-------------------------------------------------");

	}

	return finalData;

}

async function fetchDailyStreak(address) {

	let finalData;

	try {

		const url = `${process.env.REACT_APP_SONGBIRDZ_BACKEND_URL}/birds/daily-streak?address=${address.toLowerCase()}`;

		// Fetch the points data from the back-end server
		const response = await fetch(url);

		// Parse the points data
		if (response.status === 200) {
			finalData = await response.json();
		}

	} catch (error) {

		console.debug("---- ERROR FETCHING DAILY STREAK DATA FOR CURRENT USER ----");
		console.debug(error);
		console.debug("-----------------------------------------------------------");

	}

	return finalData;

}

async function updateDailyStreak(address) {

	try {

		// Post to the daily streak API in the back-end server

		const response = await fetch(
			`${process.env.REACT_APP_SONGBIRDZ_BACKEND_URL}/birds/daily-streak`,
			{
				method: 'POST',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ address }),
			},
		);

		if (response.status !== 200) {
			console.error("Error updating the daily streak...");
			return null;
		}

		const responseData = await response.json();

		return responseData;

	} catch (error) {

		console.error(error);
		return null;

	}

}

async function getMemoryMatchGamesPlayedToday(address) {

	try {

		// Fetch the number of games played today for the current user from
		// the memory match game API in the back-end server

		const response = await fetch(
			`${process.env.REACT_APP_SONGBIRDZ_BACKEND_URL}/birds/memory-match/games-played?address=${address}`,
		);

		if (response.status !== 200) {
			console.error("Error fetching the memory match games played...");
			return { count: 3 };
		}

		const responseData = await response.json();

		return responseData.count;

	} catch (error) {

		console.error(error);
		return null;

	}

}

async function storeMemoryMatchGameResult(address, mode, result) {

	try {

		// Post to the memory match game API in the back-end server

		const response = await fetch(
			`${process.env.REACT_APP_SONGBIRDZ_BACKEND_URL}/birds/memory-match/log`,
			{
				method: 'POST',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					address,
					mode,
					score: result.score,
					duration: result.duration,
					moves: result.moves,
				}),
			},
		);

		if (response.status !== 200) {
			console.error("Error storing the memory match game result...");
			return null;
		}

		const responseData = await response.json();

		return responseData;

	} catch (error) {

		console.error(error);
		return null;

	}

}

async function fetchBirdOfTheWeek() {

	let finalData;

	try {

		const url = `${process.env.REACT_APP_SONGBIRDZ_BACKEND_URL}/birds/bird-of-the-week`;

		// Fetch the data from the back-end server
		const response = await fetch(url);

		// Parse the data
		if (response.status === 200) {
			finalData = await response.json();
		}

	} catch (error) {

		console.debug("----- ERROR FETCHING BIRD OF THE WEEK DATA ------");
		console.debug(error);
		console.debug("-------------------------------------------------");

	}

	return finalData;

}

export {
	fetchBird,
	fetchPointsLeaderboard,
	fetchLifeListData,
	fetchLifeListLeaderboard,
	fetchUnidentifiedList,
	fetchDailyStreaksActive,
	fetchDailyStreak,
	updateDailyStreak,
	populateMetadata,
	getMemoryMatchGamesPlayedToday,
	storeMemoryMatchGameResult,
	fetchBirdOfTheWeek,
};
