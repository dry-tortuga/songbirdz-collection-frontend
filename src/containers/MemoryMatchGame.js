import React, { useCallback, useEffect, useState } from "react";
import { Badge, Button, Form, ToastContainer } from "react-bootstrap";
import { Link } from "react-router-dom";

import BirdIdentificationModal from "../components/BirdIdentificationModal";
import BirdIdentificationTransactionStatus from "../components/BirdIdentificationTransactionStatus";
import BirdIdentificationTransactionStatusNonSmartWallet from "../components/BirdIdentificationTransactionStatusNonSmartWallet";
import DailyStreakStatus from "../components/DailyStreakStatus";
import WalletConnectionStatus from "../components/WalletConnectionStatus";

import { useWalletContext } from "../contexts/wallet";

import useMintAPI from "../hooks/useMintAPI";

import { storeMemoryMatchGameResult } from "../utils/data";

import openseaLogo from "../images/opensea-logomark-blue.svg";
import magicedenLogo from "../images/magiceden-logo.png";
import warpcastLogo from "../images/warpcast-logo.png";

import "./MemoryMatchGame.css";

// TODO: Leaderboard (Weekly vs. All Time vs. Deck Sizes)

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

    const { account, currentUser, setCurrentUser } = context;

    const [selected, setSelected] = useState({
        firstGuess: -1,
        secondGuess: -1,
    });

    const [birds, setBirds] = useState([]);

    const [difficultyMode, setDifficultyMode] = useState("easy");

    const [matched, setMatched] = useState([]);

    const [movesUsed, setMovesUsed] = useState(0);

    const [hasStarted, setHasStarted] = useState(false);
    const [timeUsed, setTimeUsed] = useState(0);
    const [timeUsedSlow, setTimeUsedSlow] = useState(0);

    const [birdToID, setBirdToID] = useState(null);

    const [activeAudio, setActiveAudio] = useState({
        index: -1,
        audioPlayer: null,
    });

    const [hasLoggedResult, setHasLoggedResult] = useState(false);

    // Keep track of the wallet connection state
    const [showWalletConnectionInfo, setShowWalletConnectionInfo] =
        useState(false);

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

    const handleResetGame = async (difficulty) => {

        setBirds([]);
        setMovesUsed(0);
        setHasStarted(false);
        setTimeUsed(0);
        setTimeUsedSlow(0);
        setSelected({ firstGuess: -1, secondGuess: -1 });
        setMatched([]);
        setActiveAudio({ index: -1, audioPlayer: null })
        setHasLoggedResult(false);

        const newCards = await loadGameCards(8, difficulty);

        setBirds(newCards);

    };

    const {
        // Callback functions to submit the tx onchain
        handleMintSmartWallet,
        handleMintNonSmartWallet,

        // Keep track of the tx state
        txMintSmartWallet,
        txMintNonSmartWallet,

        // Reset the tx state
        resetTxMintSmartWallet,
        resetTxMintNonSmartWallet,
    } = useMintAPI({
        context,
        // Handle updates to the local state after successful mint
        cb: (updatedBirdData, updatedTracker) => {
            if (updatedBirdData) {
                setBirds((prev) => {
                    return prev.map((bird) => {
                        if (bird.id === updatedBirdData.id) {
                            return {
                                ...bird,
                                species: updatedBirdData.species,
                            };
                        }
                        return bird;
                    });
                });
            }
            if (updatedTracker) {
                setCurrentUser((prev) => ({
                    ...prev,
                    dailyStreakTracker: updatedTracker,
                }));
            }
        },
    });

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
    useEffect(() => { handleResetGame(difficultyMode) }, [difficultyMode]);

    // Store result of the game once it is finished
    useEffect(() => {

        if (isFinished && !hasLoggedResult) {

            setHasLoggedResult(true);

            storeMemoryMatchGameResult(account, difficultyMode, {
                score: finalScore,
                duration: timeUsed,
                moves: movesUsed,
            });

        }

    }, [isFinished, hasLoggedResult, account, difficultyMode, finalScore, timeUsed, movesUsed]);

    // Increase the time used by the user every 25 milliseconds until the game is finished
    useEffect(() => {

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

    }, [birds, hasStarted, isFinished]);

    useEffect(() => {

        if (selected.firstGuess !== -1 && selected.secondGuess !== -1) {

            // Increase the number of moves used by the user
            setMovesUsed((prev) => prev + 1);

            const firstName = birds[selected.firstGuess].name;
            const secondName = birds[selected.secondGuess].name;

            const hasAudioSecond = Boolean(birds[selected.secondGuess].audioPlayer);

            // and the first guess matches the second match...
            if (firstName === secondName) {

                console.log("MATCH");

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
                console.log("INCORRECT");

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

    // Re-load the twitter share button if the bird ID or species changes
    useEffect(() => {
        if (window.twttr?.widgets) {
            window.twttr.widgets.load(document.getElementById("game"));
        }
    }, [
        isFinished,
        birdToID,
        txMintSmartWallet?.success,
        txMintNonSmartWallet?.success,
    ]);

    console.log("------------------");
    console.log(birds);
    console.log(selected);
    console.log(matched);
    console.log(`hasStarted=${hasStarted}`);
    console.log(`isFinished=${isFinished}`);
    console.log(`movesUsed=${movesUsed}`);
    console.log(`timeUsed=${timeUsed}`);
    console.log("------------------");

    return (
        <div id="game" className={`container ${isFinished ? "game-over" : ""}`}>
            <div className="row">
                <div className="col">
                    <h1 className="text-center">
                        <span className="mb-2 mb-md-3">
                            {isFinished ? "Game Over!" : "Memory Match"}
                        </span>
                    </h1>
                    <div className="d-flex align-items-center justify-content-center mb-2 mb-md-3">
                        <span className="game-score me-1 me-md-3">
                            {"Score:"}
                            <Badge
                                className="ms-1 ms-md-2 align-middle"
                                bg="success"
                                pill
                            >
                                <span>{isFinished ? finalScore : "TBD"}</span>
                            </Badge>
                        </span>
                        <span className="game-time me-1 me-md-3">
                            {"Time:"}
                            <Badge
                                className="ms-1 ms-md-2 align-middle"
                                bg="info"
                                pill
                            >
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
                                pill
                            >
                                <span>{movesUsed}</span>
                            </Badge>
                        </span>
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
                    </div>
                    {isFinished && (
                        <div className="d-flex align-items-center justify-content-center flex-wrap">
                            <div className="social-media-share d-flex align-items-center me-4">
                                <span className="me-2">{"Share on:"}</span>
                                <span className="me-2">
                                    <a
                                        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`I just scored ${finalScore}/1000 in the memory match game from @songbirdz_cc on @base!\n\n Can you beat my score?\n\n Play at`)}`}
                                        className="twitter-share-button"
                                        data-hashtags="songbirdz,birds,onchain,matchinggame,games"
                                        data-url="https://songbirdz.cc/memory-match"
                                    >
                                        <i className="fa-brands fa-x-twitter" />
                                    </a>
                                </span>
                                <span>
                                    <a
                                        href={`https://warpcast.com/~/compose?text=${encodeURIComponent(`I just scored ${finalScore}/1000 in the Songbirdz memory match game from @dry-tortuga on @base!\n\n Can you beat my score?\n\n Play at https://songbirdz.cc/memory-match`)}`}
                                        className="farcaster-share-button"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <img
                                            className="warpcast-logo"
                                            src={warpcastLogo}
                                            alt="Warpcast"
                                        />
                                    </a>
                                </span>
                            </div>
                            <Button
                                className="new-game-btn"
                                variant="primary"
                                onClick={() => handleResetGame(difficultyMode)}
                            >
                                {"New Game"}
                            </Button>
                        </div>
                    )}
                </div>
            </div>
            <div className="row">
                {birds.map((bird, index) => (
                    <div key={index} className="col-3">
                        <div
                            className={`
								grid-card
								${selected.firstGuess === index || selected.secondGuess === index ? "selected" : ""}
								${matched.includes(index) ? "match" : ""}
							`}
                            onClick={() => debouncedHandleClick(bird, index)}
                        >
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
                                    <div className="icon-buttons flex align-items-center gap-2">
                                        <button
                                            className="icon-btn"
                                            style={{ cursor: "pointer" }}
                                            onClick={() => handlePlayBirdSong(bird, index)}>
                                            <i
                                                className={`fa-solid fa-music ${activeAudio?.index === index ? 'fa-beat' : ''}`}
                                                style={{ color: "#ffffff" }} />
                                        </button>
                                        {bird.species === "UNIDENTIFIED" && (
                                            <button
                                                className="icon-btn"
                                                style={{ cursor: "pointer" }}
                                                onClick={() =>
                                                    setBirdToID(bird)
                                                }
                                            >
                                                <i
                                                    className="fas fa-binoculars"
                                                    style={{ color: "#ffffff" }}
                                                ></i>
                                            </button>
                                        )}
                                        <Link
                                            to={`/collection/${bird.id}`}
                                            className="icon-btn"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <i
                                                className="fas fa-info-circle"
                                                style={{ color: "#ffffff" }}
                                            ></i>
                                        </Link>
                                        {bird.species !== "UNIDENTIFIED" && (
                                            <>
                                                <button className="icon-btn d-none d-sm-flex">
                                                    <a
                                                        href={`https://opensea.io/assets/base/${context.contractAddress}/${bird.id}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        <img
                                                            src={openseaLogo}
                                                            alt="OpenSea"
                                                        />
                                                    </a>
                                                </button>
                                                <button className="icon-btn d-none d-sm-flex">
                                                    <a
                                                        href={`https://magiceden.io/item-details/base/${context.contractAddress}/${bird.id}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        <img
                                                            src={magicedenLogo}
                                                            alt="MagicEden"
                                                        />
                                                    </a>
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
            {birdToID && (
                <BirdIdentificationModal
                    id={birdToID?.id}
                    cached={false}
                    isOpen={Boolean(birdToID)}
                    context={context}
                    onSubmitNonSmartWallet={handleMintNonSmartWallet}
                    onSubmitSmartWallet={handleMintSmartWallet}
                    onToggle={() => setBirdToID(null)}
                />
            )}
            {isFinished && (
                <ToastContainer
                    className="p-3"
                    style={{ zIndex: 5 }}
                    position="top-end"
                >
                    {showWalletConnectionInfo && (
                        <WalletConnectionStatus
                            onClose={() => setShowWalletConnectionInfo(false)}
                        />
                    )}
                    {/* Smart Wallet Users */}
                    {(txMintSmartWallet?.pending ||
                        txMintSmartWallet?.success ||
                        txMintSmartWallet?.error) && (
                        <BirdIdentificationTransactionStatus
                            tx={txMintSmartWallet}
                            onClose={resetTxMintSmartWallet}
                        />
                    )}
                    {/* Non-Smart Wallet Users */}
                    {(txMintNonSmartWallet?.pending ||
                        txMintNonSmartWallet?.success ||
                        txMintNonSmartWallet?.error) && (
                        <BirdIdentificationTransactionStatusNonSmartWallet
                            tx={txMintNonSmartWallet}
                            onClose={resetTxMintNonSmartWallet}
                        />
                    )}
                    {(currentUser?.dailyStreakTracker?.status === "created" ||
                        currentUser?.dailyStreakTracker?.status ===
                            "updated") && (
                        <DailyStreakStatus
                            data={currentUser?.dailyStreakTracker}
                        />
                    )}
                </ToastContainer>
            )}
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

    return timebonus + triesbonus;

}

async function loadGameCards(numBirds, difficulty) {

    // Generate array of random numbers 0-5999 without duplicates
    let cardArray = [];

    while (cardArray.length < numBirds) {
        let num = Math.floor(Math.random() * 5999);
        if (!cardArray.includes(num)) {
            cardArray.push(num);
        }
    }

    // Await all metadata calls in parallel
    const cardData = await Promise.all(
        cardArray.map(async (birdId) => {
            const response = await fetch(
                `https://songbirdz.cc/birds/metadata/${birdId}`,
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
