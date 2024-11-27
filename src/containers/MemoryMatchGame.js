import React, { useEffect, useState } from "react";
import { Badge, Button, ToastContainer } from "react-bootstrap";
import { Link } from "react-router-dom";

import BirdIdentificationModal from "../components/BirdIdentificationModal";
import BirdIdentificationTransactionStatus from "../components/BirdIdentificationTransactionStatus";
import BirdIdentificationTransactionStatusNonSmartWallet from "../components/BirdIdentificationTransactionStatusNonSmartWallet";
import DailyStreakStatus from "../components/DailyStreakStatus";
import WalletConnectionStatus from "../components/WalletConnectionStatus";

import { useWalletContext } from "../contexts/wallet";

import useMintAPI from "../hooks/useMintAPI";

import homeImage1 from "../images/home1.png";
import homeImage2 from "../images/home2.jpg";
import homeImage3 from "../images/home3.jpg";
import homeImage4 from "../images/home4.jpg";
import homeImage5 from "../images/home5.jpg";
import openseaLogo from "../images/opensea-logomark-blue.svg";
import magicedenLogo from "../images/magiceden-logo.png";

import "./MemoryMatchGame.css";

// TODO: Leaderboard (Weekly vs. All Time vs. Deck Sizes)
// TODO: Share on X or Farcaster
// TODO: Audio -> Image (medium difficulty)
// TODO: Audio -> Audio (hard difficulty)
// TODO: Mobile first design

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

const TIME_DELAY = 1000; // 1 second

const MemoryMatchGame = () => {
  const context = useWalletContext();

  const { currentUser, setCurrentUser } = context;

  const [selected, setSelected] = useState({
    firstGuess: -1,
    secondGuess: -1,
  });

  const [birds, setBirds] = useState([]);

  const [matched, setMatched] = useState([]);

  const [movesUsed, setMovesUsed] = useState(0);

  const [hasStarted, setHasStarted] = useState(false);
  const [timeUsed, setTimeUsed] = useState(0);
  const [timeUsedSlow, setTimeUsedSlow] = useState(0);

  const [birdToID, setBirdToID] = useState(null);

  // Keep track of the wallet connection state
  const [showWalletConnectionInfo, setShowWalletConnectionInfo] =
    useState(false);

  const isFinished = birds.length > 0 && matched.length === birds.length;

  let finalScore = 0;

  if (isFinished) {
    finalScore = calculateGameScore(
      birds.length,
      TIME_DELAY,
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
      setSelected((prev) => ({ ...prev, firstGuess: index }));
      return;
    }

    if (selected.secondGuess === -1) {
      setSelected((prev) => ({ ...prev, secondGuess: index }));
      return;
    }
  };

  const handleResetGame = async () => {
    setBirds([]);
    setMovesUsed(0);
    setHasStarted(false);
    setTimeUsed(0);
    setTimeUsedSlow(0);
    setSelected({ firstGuess: -1, secondGuess: -1 });
    setMatched([]);

    const newCards = await loadGameCards(4);

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
        //setBird(updatedBirdData);
      }
      if (updatedTracker) {
        setCurrentUser((prev) => ({
          ...prev,
          dailyStreakTracker: updatedTracker,
        }));
      }
    },
  });

  // Load the birds on initial load
  useEffect(() => {
    handleResetGame();
  }, []);

  // Increase the time used by the user every 25 milliseconds until the game is finished
  useEffect(() => {
    if (birds.length > 0 && hasStarted && !isFinished) {
      const listener1 = setInterval(() => setTimeUsed((prev) => prev + 25), 25);

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

          setSelected({ firstGuess: -1, secondGuess: -1 });
        }, TIME_DELAY);
      } else {
        console.log("INCORRECT");

        // reset the guesses
        setTimeout(() => {
          setSelected({ firstGuess: -1, secondGuess: -1 });
        }, TIME_DELAY);
      }
    }
  }, [selected.firstGuess, selected.secondGuess]);

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
      <section className="row">
        <div className="col">
          <div className="h1 d-flex align-items-center">
            <span className="me-5">
              {isFinished ? "Game Over!" : "Memory Match"}
            </span>
            <span className="me-5 fs-3">
              {"Score:"}
              <Badge
                className="ms-1 align-middle"
                bg="success"
                style={{ fontSize: "0.9rem" }}
                pill
              >
                <span>{isFinished ? finalScore : "TBD"}</span>
              </Badge>
            </span>
            <span className="me-5 fs-3">
              {"Time:"}
              <Badge
                className="ms-1 align-middle"
                bg="info"
                style={{ fontSize: "0.9rem" }}
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
            <span className="me-5 fs-3">
              {"Moves:"}
              <Badge
                className="ms-1 align-middle"
                bg="secondary"
                style={{ fontSize: "0.9rem" }}
                pill
              >
                <span>{movesUsed}</span>
              </Badge>
            </span>
            {isFinished && (
              <Button variant="primary" onClick={handleResetGame}>
                {"Start New Game"}
              </Button>
            )}
          </div>
        </div>
      </section>
      <section className="row">
        {birds.map((bird, index) => (
          <div key={index} className="col-2 col-sm-2">
            <div
              className={`
								grid-card
								${selected.firstGuess === index || selected.secondGuess === index ? "selected" : ""}
								${matched.includes(index) ? "match" : ""}
							`}
              onClick={() => handleClick(bird, index)}
            >
              <div className="front" />
              <div
                className="back"
                style={{ backgroundImage: `url(${bird.image})` }}
              />
              {isFinished && (
                <div className="species-row">
                  <span className="species-name">{bird.species}</span>
                  <div className="icon-buttons flex align-items-center gap-2">
                    {bird.species === "UNIDENTIFIED" && (
                      <button
                        className="icon-btn"
                        onClick={() => setBirdToID(bird)}
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
                        <button className="icon-btn">
                          <a
                            href={`https://opensea.io/assets/base/${context.contractAddress}/${bird.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <img
                              src={openseaLogo}
                              alt="OpenSea"
                              style={{ width: "16px", height: "16px" }}
                            />
                          </a>
                        </button>
                        <button className="icon-btn">
                          <a
                            href={`https://magiceden.io/item-details/base/${context.contractAddress}/${bird.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <img
                              src={magicedenLogo}
                              alt="MagicEden"
                              style={{ width: "16px", height: "16px" }}
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
      </section>
      {birdToID && (
        <BirdIdentificationModal
          isOpen={Boolean(birdToID)}
          bird={birdToID}
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
            currentUser?.dailyStreakTracker?.status === "updated") && (
            <DailyStreakStatus data={currentUser?.dailyStreakTracker} />
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

async function loadGameCards(numBirds) {
  // Generate array of random numbers 0-5000 without duplicates
  let cardArray = [];

  while (cardArray.length < numBirds) {
    let num = Math.floor(Math.random() * 5000);
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
  let gameCards = cardData.map((bird) => {
    return {
      id: parseInt(bird.name.split("#")[1], 10),
      name: bird.name,
      image: bird.image,
      audio: bird.animation_url,
      species: bird.species,
    };
  });

  // Duplicate the array
  gameCards = gameCards.concat(gameCards);

  // Randomize order
  gameCards.sort(() => 0.5 - Math.random());

  return gameCards;
}
