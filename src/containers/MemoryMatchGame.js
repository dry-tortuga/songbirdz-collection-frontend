import React, { useEffect, useState } from "react";
import { Badge, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

import homeImage1 from "../images/home1.png";
import homeImage2 from "../images/home2.jpg";
import homeImage3 from "../images/home3.jpg";
import homeImage4 from "../images/home4.jpg";
import homeImage5 from "../images/home5.jpg";

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

// Card data
const cardsArray = [
  {
	name: 'shell',
	img: 'https://songbirdz.cc/images/0.jpg',
  },
  {
	name: 'star',
	img: 'https://songbirdz.cc/images/1.jpg',
  },
  {
	name: 'bobomb',
	img: 'https://songbirdz.cc/images/2.jpg',
  },
  /*{
	name: 'mario',
	img: 'https://songbirdz.cc/images/3.jpg',
  },
  {
	name: 'luigi',
	img: 'https://songbirdz.cc/images/4.jpg',
  },
  {
	name: 'peach',
	img: 'https://songbirdz.cc/images/5.jpg',
  },
  {
	name: '1up',
	img: 'https://songbirdz.cc/images/6.jpg',
  },
  {
	name: 'mushroom',
	img: 'https://songbirdz.cc/images/7.jpg',
  },
  {
	name: 'thwomp',
	img: 'https://songbirdz.cc/images/8.jpg',
  },
  {
	name: 'bulletbill',
	img: 'https://songbirdz.cc/images/9.jpg',
  },
  {
	name: 'coin',
	img: 'https://songbirdz.cc/images/10.jpg',
  },
  {
	name: 'goomba',
	img: 'https://songbirdz.cc/images/11.jpg',
  },*/
];

// Duplicate array to create a match for each card
let gameGrid = cardsArray.concat(cardsArray);

// Randomize game grid on each load
gameGrid.sort(() => 0.5 - Math.random())

const TIME_DELAY = 1000; // 1 second

const MemoryMatchGame = () => {

	const [selected, setSelected] = useState({
		firstGuess: -1,
		secondGuess: -1,
	});

	const [matched, setMatched] = useState([]);

	const [movesUsed, setMovesUsed] = useState(0);

	const [timeUsed, setTimeUsed] = useState(0);

	const isFinished = matched.length === gameGrid.length;

	let finalScore = 0;

	if (isFinished) {
		finalScore = calculateGameScore(gameGrid.length, TIME_DELAY, movesUsed, timeUsed);
	}

	const handleClick = (card, index) => {

		// Ignore clicks once the game is over
		if (isFinished) { return };

		// Ignore clicks on an already matched card
		if (matched.includes(index)) { return; }

		// Ignore clicks on the same card twice
		if (selected.firstGuess === index || selected.secondGuess === index)  {
			return;
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

	const handleResetGame = () => {

		setMovesUsed(0);
		setTimeUsed(0);
		setSelected({ firstGuess: -1, secondGuess: -1 });
		setMatched([]);

	};

	// Increase the time used by the user every 25 milliseconds until the game is finished
	useEffect(() => {

		if (!isFinished) {

			const listener = setInterval(() => setTimeUsed((prev) => prev + 25), 25);

			return () => clearInterval(listener);

		}

	}, [isFinished]);

	useEffect(() => {

		if (selected.firstGuess !== -1 && selected.secondGuess !== -1) {

			// Increase the number of moves used by the user
			setMovesUsed((prev) => prev + 1);

			const firstName = gameGrid[selected.firstGuess].name;
			const secondName = gameGrid[selected.secondGuess].name;

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

	console.log('------------------');
	console.log(selected);
	console.log(matched);
	console.log(`isFinished=${isFinished}`);
	console.log(`movesUsed=${movesUsed}`);
	console.log(`timeUsed=${timeUsed}`);
	console.log('------------------');

	return (
		<div
			id="game"
			className={`container ${isFinished ? 'game-over' : ''}`}>
			{isFinished &&
				<section className="row">
					<div className="col">
						<div className="h1 d-flex align-items-center">
							<span className="me-5">
								{"Game Over!"}
							</span>
							<span className="me-5">
								{"Your Score:"}
								<Badge
									className="ms-1 align-middle"
									bg="success"
									style={{ fontSize: '0.9rem' }}
									pill>
									<span>
										{finalScore}
									</span>
								</Badge>
							</span>
							<span className="me-5">
								{"Time:"}
								<Badge
									className="ms-1 align-middle"
									bg="info"
									style={{ fontSize: '0.9rem' }}
									pill>
									<span>
										{timeUsed / 1000}
										{"s"}
									</span>
								</Badge>
							</span>
							<span className="me-5">
								{"Accuracy:"}
								<Badge
									className="ms-1 align-middle"
									bg="secondary"
									style={{ fontSize: '0.9rem' }}
									pill>
									<span>
										{((gameGrid.length / 2) / movesUsed) * 100}
										{"%"}
									</span>
								</Badge>
							</span>
							<Button
								variant="primary"
								onClick={handleResetGame}>
								{'Start New Game'}
							</Button>
						</div>
					</div>
				</section>
			}
			<section className="row">
				{gameGrid.map((card, index) => (
					<div
						key={index}
						className="col-2 col-sm-2">
						<div
							className={`
								grid-card
								${(selected.firstGuess === index || selected.secondGuess === index) ? 'selected' : ''}
								${matched.includes(index) ? 'match' : ''}
							`}
							onClick={() => handleClick(card, index)}>
							<div className="front" />
							<div
								className="back"
								style={{ backgroundImage: `url(${card.img})` }} />
						</div>
					</div>
				))}
			</section>
		</div>
	);

};

export default MemoryMatchGame;

// Perfect score = 1,000 points
function calculateGameScore(width, timeDelay, movesUsed, timeUsed) {

	// Calculate the minimum number of tries required to win
	const minRequiredTries = width / 2;

	// Calculate the minimum number of time required to win (in milliseconds)
	const minRequiredTime = (timeDelay * minRequiredTries);

	const numTriesBoost = 50 + minRequiredTries;

	const timeUsedBoost = 50000 + minRequiredTime;

	// (deduct) 0.008 points for each millisecond = max of 500 pts
	let timebonus = ((timeUsedBoost - timeUsed) * 8) / 1000;

	// (deduct) 10 points for each move = max of 500 pts
	let triesbonus = (numTriesBoost - movesUsed) * 10;

	if (timebonus < 0) { timebonus = 0; }

	if (triesbonus < 0) { triesbonus = 0; }

	return timebonus + triesbonus;

}
