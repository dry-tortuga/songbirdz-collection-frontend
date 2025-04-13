import React, { useCallback, useEffect, useState } from "react";
import { Alert, Badge, Button, Form, Table } from "react-bootstrap";
import { Link } from "react-router-dom";

import AccountOwner from "../components/AccountOwner";

import { NUM_BIRDS_TOTAL } from "../constants";

import { useFarcasterContext } from "../contexts/farcaster";
import { useIdentificationContext } from "../contexts/identification";
import { useWalletContext } from "../contexts/wallet";

import useMemoryMatchGamesPlayed from "../hooks/useMemoryMatchGamesPlayed";
import useMemoryMatchGameLeaderboard from "../hooks/useMemoryMatchGameLeaderboard";

import { storeMemoryMatchGameResult } from "../utils/data";

import warpcastLogo from "../images/warpcast-logo.png";

import "./MemoryMatchGame.css";

// TODO: Allow 3 games per day in each difficulty mode
// TODO: Neynar API for rendering farcaster user pfps and names???
// TODO: Check if inside the farcaster frame and update/hide share links

/*

MIT License

Copyright (c) 2018 Tania Rascia

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

*/

const MemoryMatchGame = () => {

	const context = useWalletContext();

	const { fComposeCast } = useFarcasterContext();

	const { account, currentUser } = context;

	const { setIsIdentifyingBird, setBirdToID } = useIdentificationContext();

	const [selected, setSelected] = useState({
		firstGuess: -1,
		secondGuess: -1,
	});

	const [birds, setBirds] = useState([]);

	const [difficultyMode, setDifficultyMode] = useState("easy");
	const [sortBy, setSortBy] = useState("total");

	const [matched, setMatched] = useState([]);

	const [movesUsed, setMovesUsed] = useState(0);

	const [hasStarted, setHasStarted] = useState(false);
	const [timeUsed, setTimeUsed] = useState(0);
	const [timeUsedSlow, setTimeUsedSlow] = useState(0);

	const [activeAudio, setActiveAudio] = useState({
		index: -1,
		audioPlayer: null,
	});

	const [hasLoggedResult, setHasLoggedResult] = useState(false);
	const [showConnectWallet, setShowConnectWallet] = useState(false);

	const { gamesPlayedToday, setGamesPlayedToday } = useMemoryMatchGamesPlayed({ account });

	const {
		showLeaderboard,
		setShowLeaderboard,
		leaderboardData,
		// setLeaderboardData,
	} = useMemoryMatchGameLeaderboard({ account, difficultyMode, sortBy });

	const isFinished = birds.length > 0 && matched.length === birds.length;

	let finalScore = 0;

	if (isFinished) {
		finalScore = calculateGameScore(
			birds.length,
			1000,
			movesUsed,
			timeUsed,
		);
	}

	const handleClick = (card, index) => {

		// Ignore clicks until the birds are loaded
		if (birds.length === 0) {
			return;
		}

		// Ignore clicks once the game is over
		if (isFinished) {
			return;
		}

		// Ignore clicks on an already matched card
		if (matched.includes(index)) {
			return;
		}

		// Ignore clicks on the same card twice
		if (selected.firstGuess === index || selected.secondGuess === index) {
			return;
		}

		if (!hasStarted) {
			setHasStarted(true);
		}

		if (selected.firstGuess === -1) {

			// Start playing the audio for the first bird...
			const selectedFirstBird = birds[index];

			if (selectedFirstBird.audioPlayer) {
				selectedFirstBird.audioPlayer.loop = true;
				selectedFirstBird.audioPlayer.play();
			}

			setSelected((prev) => ({ ...prev, firstGuess: index }));

			return;

		}

		if (selected.secondGuess === -1) {

			// Stop playing the audio (if any) for the first bird...
			const selectedFirstBird = birds[selected.firstGuess];

			if (selectedFirstBird.audioPlayer) {
				selectedFirstBird.audioPlayer.pause();
			}

			// Start playing the audio (if any) for the second bird...
			const selectedSecondBird = birds[index];

			if (selectedSecondBird.audioPlayer) {
				selectedSecondBird.audioPlayer.loop = true;
				selectedSecondBird.audioPlayer.play();
			}

			setSelected((prev) => ({ ...prev, secondGuess: index }));

			return;

		}

	};

	const debouncedHandleClick = useCallback(
		debounce(handleClick, 50),
		[handleClick]
	);

	const handleResetGame = async (difficulty, autoStart) => {

		setBirds([]);
		setMovesUsed(0);
		setTimeUsed(0);
		setTimeUsedSlow(0);
		setSelected({ firstGuess: -1, secondGuess: -1 });
		setMatched([]);
		setActiveAudio({ index: -1, audioPlayer: null })
		setHasLoggedResult(false);
		setShowConnectWallet(false);

		const newCards = await loadGameCards(8, difficulty);

		setBirds(newCards);
		setHasStarted(autoStart);

	};

	const handlePlayBirdSong = (bird, index) => {

		if (activeAudio?.audioPlayer) {
			activeAudio.audioPlayer.pause();

			if (index === activeAudio.index) {
				setActiveAudio({ index: -1, audioPlayer: null });
				return;
			}
		}

		if (!bird.audioPlayer) { bird.audioPlayer = new Audio(bird.audio); }

		bird.audioPlayer.loop = true;
		bird.audioPlayer.play();

		setActiveAudio({
			index,
			audioPlayer: bird.audioPlayer,
		});

	};

	// Load the birds on initial load
	useEffect(() => { handleResetGame(difficultyMode, false) }, [difficultyMode]);

	// Store result of the game once it is finished and prompt for wallet connect if needed
	useEffect(() => {

		if (isFinished && !hasLoggedResult) {

			if (!account) {

				setShowConnectWallet(true);

			} else if (gamesPlayedToday < 3) {

				setHasLoggedResult(true);
				setGamesPlayedToday((prev) => prev + 1);

				storeMemoryMatchGameResult(account, difficultyMode, {
					score: finalScore,
					duration: timeUsed,
					moves: movesUsed,
				});

			}

		}

	}, [
		isFinished,
		hasLoggedResult,
		account,
		difficultyMode,
		finalScore,
		timeUsed,
		movesUsed,
	]);

	// Increase the time used by the user every 25 milliseconds until the game is finished
	useEffect(() => {

		console.log('------------ setTimeUsed --------------');
		console.log(birds.length);
		console.log(`hasStarted=${hasStarted}`);
		console.log(`isFinished=${isFinished}`);

		if (birds.length > 0 && hasStarted && !isFinished) {

			const listener1 = setInterval(
				() => setTimeUsed((prev) => prev + 25),
				25,
			);

			const listener2 = setInterval(
				() => setTimeUsedSlow((prev) => prev + 1),
				1000,
			);

			return () => {
				clearInterval(listener1);
				clearInterval(listener2);
			};

		}

	}, [birds.length, hasStarted, isFinished]);

	useEffect(() => {

		if (selected.firstGuess !== -1 && selected.secondGuess !== -1) {

			// Increase the number of moves used by the user
			setMovesUsed((prev) => prev + 1);

			const firstName = birds[selected.firstGuess].name;
			const secondName = birds[selected.secondGuess].name;

			const hasAudioSecond = Boolean(birds[selected.secondGuess].audioPlayer);

			// and the first guess matches the second match...
			if (firstName === secondName) {

				// run the match function
				setTimeout(() => {

					setMatched((prev) => [
						...prev,
						selected.firstGuess,
						selected.secondGuess,
					]);

					// Stop playing the audio (if any) for the second bird...
					const selectedSecondBird = birds[selected.secondGuess];

					if (selectedSecondBird.audioPlayer) {
						selectedSecondBird.audioPlayer.pause();
					}

					setSelected({ firstGuess: -1, secondGuess: -1 });

				}, hasAudioSecond ? 3000 : 1000);

			} else {

				// reset the guesses
				setTimeout(() => {

					// Stop playing the audio (if any) for the second bird...
					const selectedSecondBird = birds[selected.secondGuess];

					if (selectedSecondBird.audioPlayer) {
						selectedSecondBird.audioPlayer.pause();
					}

					setSelected({ firstGuess: -1, secondGuess: -1 });

				}, hasAudioSecond ? 3000 : 1000);

			}

		}

	}, [selected.firstGuess, selected.secondGuess]);

	// Re-load the birds if any are successfully identified in the current session
	useEffect(() => {

		if (currentUser?.identified) {

			setBirds((prev) => {
				return prev.map((bird) => {

					if (currentUser?.identified?.[bird.id]) {
						return {
							id: parseInt(bird.name.split("#")[1], 10),
							name: bird.name,
							image: bird.image,
							audio: bird.animation_url,
							species: currentUser?.identified?.[bird.id].species,
							cached: false,
						};
					}

					return bird;
				});
			});

		}

	}, [birds, currentUser?.identified]);

	// Re-load the twitter share button if the game ends or re-starts
	useEffect(() => {
		if (window.twttr?.widgets) {
			window.twttr.widgets.load(document.getElementById("game"));
		}
	}, [isFinished]);

	// TODO: How to check if inside the farcaster frame???
	console.log(window.sdk);
	console.log(window.frame);

	return (
		<div id="game" className={`container ${isFinished ? "game-over" : ""}`}>
			{gamesPlayedToday >= 3 && (
				<Alert
					variant="warning"
					className="my-3">
					{"Heads Up: You've played 3 games today! You can keep playing as much as you want, but you'll have to come back tomorrow in order to add to the leaderboard!"}
				</Alert>
			)}
			{showConnectWallet && (
				<Alert
					variant="info"
					className="my-3"
					dismissible
					onClose={() => setShowConnectWallet(false)}>
						{"Heads Up: Connect your wallet to add your score to the leaderboard! (FYI: No transaction or signing required.)"}
				</Alert>
			)}
			<div className="row">
				<div className="col">
					<h1 className="text-center">
						<span className="mb-2 mb-md-3">
							{(isFinished && !showLeaderboard) ? "Game Over!" : "Memory Match"}
						</span>
					</h1>
					<div className="d-flex align-items-center justify-content-center mb-2 mb-md-3">
						{showLeaderboard &&
							<h3 className="mb-0 me-4">{"Leaderboard"}</h3>
						}
						{!showLeaderboard &&
							<>
								<span className="game-score me-1 me-md-3">
									{"Score:"}
									<Badge
										className="ms-1 ms-md-2 align-middle"
										bg="success"
										pill>
										<span>{isFinished ? finalScore : "TBD"}</span>
									</Badge>
								</span>
								<span className="game-time me-1 me-md-3">
									{"Time:"}
									<Badge
										className="ms-1 ms-md-2 align-middle"
										bg="info"
										pill>
										{isFinished && (
											<span>
												{timeUsed / 1000}
												{"s"}
											</span>
										)}
										{!isFinished && (
											<span>
												{timeUsedSlow}
												{"s"}
											</span>
										)}
									</Badge>
								</span>
								<span className="game-moves me-1 me-md-3">
									{"Moves:"}
									<Badge
										className="ms-1 ms-md-2 align-middle"
										bg="secondary"
										pill>
										<span>{movesUsed}</span>
									</Badge>
								</span>
							</>
						}
						<Form.Select
							className="game-mode-select"
							value={difficultyMode}
							disabled={hasStarted && !isFinished}
							style={{ maxWidth: "100px" }}
							onChange={(event) => setDifficultyMode(event.target.value)}>
							<option value="easy">Easy</option>
							<option value="medium">Medium</option>
							<option value="hard">Hard</option>
						</Form.Select>
						{showLeaderboard &&
							<Button
								variant="outline-primary"
								className="ms-auto"
								onClick={() => setShowLeaderboard(false)}>
								<i className="fas fa-arrow-left me-2" />
								{"Back"}
							</Button>
						}
					</div>
				</div>
			</div>
			{showLeaderboard &&
				<div className="row">
					<div className="col">
						{leaderboardData.loading && (
							<div className="text-center">
								<i className="fas fa-spinner fa-spin" />
							</div>
						)}
						{leaderboardData.error && (
							<div className="alert alert-danger">
								{leaderboardData.error}
							</div>
						)}
						{leaderboardData.data && (
							<Table
								className="leaderboard-table fw-normal"
								hover
								responsive>
								<thead>
									<tr>
										<th scope="col">
											{"#"}
										</th>
										<th scope="col">
											{"Account"}
										</th>
										<th
											scope="col"
											style={{cursor: "pointer"}}
											onClick={() => setSortBy("today")}>
											<div className="d-flex align-items-center">
												<span>{"Today"}</span>
												{sortBy === "today" &&
													<i
														className="fas fa-sort-down ms-1"
														style={{ marginTop: '-0.25rem' }} />
												}
											</div>
										</th>
										<th
											scope="col"
											style={{cursor: "pointer"}}
											onClick={() => setSortBy("total")}>
											<div className="d-flex align-items-center">
												<span>{"Total"}</span>
												{sortBy === "total" &&
													<i
														className="fas fa-sort-down ms-1"
														style={{ marginTop: '-0.25rem' }} />
												}
											</div>
										</th>
									</tr>
								</thead>
								<tbody>
									{leaderboardData.data.map((entry, index) => {

										let spacer;

										if (index === 20) {
											spacer = (
												<tr key={index}>
													<td colSpan="4" className="text-center">
														<i className="fas fa-ellipsis-h" />
													</td>
												</tr>
											);
										}

										return (
											<>
												{spacer}
												<tr
													key={index}
													className={entry.address === account?.toLowerCase() ? 'table-primary' : ''}>
													<td>{entry.rank}</td>
													<td>
														<AccountOwner account={entry.address} />
														{entry.address === account?.toLowerCase() &&
															<Badge
																bg="info"
																className="ms-2">
																{"You"}
															</Badge>
														}
													</td>
													<td>{entry.today}</td>
													<td>{entry.total}</td>
												</tr>
											</>
										);

									})}
									{leaderboardData.data.length === 0 && (
										<tr>
											<td colSpan="6" className="text-center">
												{"No scores recorded yet."}
											</td>
										</tr>
									)}
								</tbody>
							</Table>
						)}
					</div>
				</div>
			}
			{!showLeaderboard &&
				<>
					{!hasStarted &&
						<div className="row">
							<div className="col">
								<div className="d-flex flex-column gap-3">
									<Button
										className="w-100"
										variant="primary"
										onClick={() => setHasStarted(true)}>
										{"Start Game"}
									</Button>
									<a
										href={`https://warpcast.com/~/compose?text=${encodeURIComponent('Join me for a game of memory match from /songbirdz on @base!\n\nThink you can beat me?')}&embeds[]=${encodeURIComponent('https://songbirdz.cc/memory-match')}`}
										className="btn btn-dark w-100 d-flex align-items-center justify-content-center"
										target="_blank"
										rel="noopener noreferrer"
										onClick={(event) => fComposeCast(event, {
											text: `Join me for a game of memory match from /songbirdz on @base!\n\nThink you can beat me?`,
											embeds: ['https://songbirdz.cc/memory-match'],
										})}>
										<img
											className="warpcast-logo me-2"
											src={warpcastLogo}
											alt=""
											style={{ height: 20, width: 20 }} />
										{"Share on Warpcast"}
									</a>
									<a
										href={`https://twitter.com/intent/tweet?text=${encodeURIComponent('Join me for a game of memory match from @songbirdz_cc on @base!\n\nThink you can beat me?\n\nPlay at https://songbirdz.cc/memory-match')}`}
										className="btn btn-dark w-100"
										target="_blank"
										rel="noopener noreferrer">
										<i className="fa-brands fa-x-twitter me-2" />
										{"Share on X"}
									</a>
									<Button
										className="w-100"
										variant="secondary"
										onClick={() => setShowLeaderboard(true)}>
										<i className="fas fa-trophy me-2" />
										{"View Leaderboard"}
									</Button>
								</div>
							</div>
						</div>
					}
					{isFinished && (
						<div className="d-flex flex-column gap-3 mb-3 align-items-center justify-content-center">
							<Button
								className="w-100"
								variant="primary"
								onClick={() => handleResetGame(difficultyMode, true)}>
								{"New Game"}
							</Button>
							<a
								href={`https://warpcast.com/~/compose?text=${encodeURIComponent(`I just scored ${finalScore}/1000 in the memory match game (${difficultyMode} mode) from /songbirdz on @base!\n\nThink you can you beat me?`)}&embeds[]=${encodeURIComponent('https://songbirdz.cc/memory-match')}`}
								className="btn btn-dark w-100 d-flex align-items-center justify-content-center"
								target="_blank"
								rel="noopener noreferrer"
								onClick={(event) => fComposeCast(event, {
									text: `I just scored ${finalScore}/1000 in the memory match game (${difficultyMode} mode) from /songbirdz on @base!\n\nThink you can you beat me?`,
									embeds: ['https://songbirdz.cc/memory-match'],
								})}>
								<img
									className="warpcast-logo me-2"
									src={warpcastLogo}
									alt=""
									style={{ height: 20, width: 20 }} />
								{"Share on Warpcast"}
							</a>
							<a
								href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`I just scored ${finalScore}/1000 in the memory match game (${difficultyMode} mode) from @songbirdz_cc on @base!\n\nThink you can beat me?\n\nPlay at https://songbirdz.cc/memory-match`)}`}
								className="btn btn-dark w-100"
								target="_blank"
								rel="noopener noreferrer">
								<i className="fa-brands fa-x-twitter me-2" />
								{"Share on X"}
							</a>
							<Button
								className="w-100"
								variant="secondary"
								onClick={() => setShowLeaderboard(true)}>
								<i className="fas fa-trophy me-2" />
								{"View Leaderboard"}
							</Button>
						</div>
					)}
					{birds.length > 0 && hasStarted &&
						<div className="row mb-3">
							{birds.map((bird, index) => (
								<div key={index} className="col-3">
									<div
										className={`
											grid-card
											${selected.firstGuess === index || selected.secondGuess === index ? "selected" : ""}
											${matched.includes(index) ? "match" : ""}
										`}
										onClick={() => debouncedHandleClick(bird, index)}>
										<div className="front" />
										<div
											className="back"
											style={(bird.audioPlayer && !isFinished) ? { backgroundColor: '#eee' } : { backgroundImage: `url(${bird.image})` }}>
											{bird.audioPlayer && !isFinished &&
												<i className={
													`fa-solid
													fa-music
													${((selected.firstGuess === index && selected.secondGuess === -1) || selected.secondGuess === index) ? 'fa-beat' : ''}`
												} />
											}
										</div>
										{isFinished && (
											<div className="species-row flex-column">
												<span className="species-name text-center">
													{bird.species}
												</span>
												<div className="icon-buttons flex align-items-center gap-4">
													<button
														className="icon-btn"
														style={{ cursor: "pointer" }}
														onClick={() => handlePlayBirdSong(bird, index)}>
														<i
															className={`fa-solid fa-music ${activeAudio?.index === index ? 'fa-beat' : ''}`}
															style={{ color: "#ffffff" }} />
													</button>
													{bird.species === "UNIDENTIFIED" ? (
														<button
															className="icon-btn"
															style={{ cursor: "pointer" }}
															onClick={() => {
																setIsIdentifyingBird(true);
																setBirdToID(bird);
															}}>
															<i
																className="fas fa-binoculars"
																style={{ color: "#ffffff" }} />
														</button>
													) : (
														<Link
															to={`/collection/${bird.id}`}
															className="icon-btn"
															target="_blank"
															rel="noopener noreferrer">
															<i
																className="fas fa-info-circle"
																style={{ color: "#ffffff" }} />
														</Link>
													)}
												</div>
											</div>
										)}
									</div>
								</div>
							))}
						</div>
					}
				</>
			}
		</div>
	);

};

export default MemoryMatchGame;

// Perfect score = 1,000 points
function calculateGameScore(width, timeDelay, movesUsed, timeUsed) {

	// Calculate the minimum number of tries required to win
	const minRequiredTries = width / 2;

	// Calculate the minimum number of time required to win (in milliseconds)
	const minRequiredTime = timeDelay * minRequiredTries;

	const numTriesBoost = 50 + minRequiredTries;

	const timeUsedBoost = 50000 + minRequiredTime;

	// (deduct) 0.008 points for each millisecond = max of 500 pts
	let timebonus = ((timeUsedBoost - timeUsed) * 8) / 1000;

	// (deduct) 10 points for each move = max of 500 pts
	let triesbonus = (numTriesBoost - movesUsed) * 10;

	if (timebonus < 0) {
		timebonus = 0;
	}

	if (triesbonus < 0) {
		triesbonus = 0;
	}

	return Math.floor(timebonus + triesbonus);

}

async function loadGameCards(numBirds, difficulty) {

	// Generate array of random bird IDs (without duplicates)
	let cardArray = [];

	while (cardArray.length < numBirds) {
		let num = Math.floor(Math.random() * (NUM_BIRDS_TOTAL - 1));
		if (!cardArray.includes(num) && num >= 6000) {
			cardArray.push(num);
		}
	}

	// Await all metadata calls in parallel
	const cardData = await Promise.all(
		cardArray.map(async (birdId) => {
			const response = await fetch(
				`${process.env.REACT_APP_SONGBIRDZ_BACKEND_URL}/birds/metadata/${birdId}`,
			);
			const metadata = await response.json();
			return metadata;
		}),
	);

	// Map to card objects
	const gameCardsOriginal = cardData.map((bird) => ({
		id: parseInt(bird.name.split("#")[1], 10),
		name: bird.name,
		image: bird.image,
		audio: bird.animation_url,
		species: bird.species,
		cached: false,
	}));

	// Make a copy of the card objects
	const gameCardsCopy = [...gameCardsOriginal.map((bird) => ({ ...bird }))];

	let result = [];

	if (difficulty === "easy") {

		result = [...gameCardsOriginal, ...gameCardsCopy];

	} else if (difficulty === "medium") {

		result = [
			...gameCardsOriginal,
			...gameCardsCopy.map((bird) => ({
				...bird,
				audioPlayer: new Audio(bird.audio),
			})),
		];

	} else if (difficulty === "hard") {

		result = [
			...gameCardsOriginal.map((bird) => ({
				...bird,
				audioPlayer: new Audio(bird.audio),
			})),
			...gameCardsCopy.map((bird) => ({
				...bird,
				audioPlayer: new Audio(bird.audio),
			})),
		];

	}

	// Randomize order
	result.sort(() => 0.5 - Math.random());
	result.sort(() => 0.5 - Math.random());
	result.sort(() => 0.5 - Math.random());
	result.sort(() => 0.5 - Math.random());

	return result;

}

function debounce(fn, delay) {
	let timerId;
	return (...args) => {
		clearTimeout(timerId);
		timerId = setTimeout(() => fn(...args), delay);
	}
}
