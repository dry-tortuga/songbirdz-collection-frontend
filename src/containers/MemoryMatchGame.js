import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import homeImage1 from "../images/home1.png";
import homeImage2 from "../images/home2.jpg";
import homeImage3 from "../images/home3.jpg";
import homeImage4 from "../images/home4.jpg";
import homeImage5 from "../images/home5.jpg";

import "./MemoryMatchGame.css";

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
  {
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
  },
];

// Duplicate array to create a match for each card
let gameGrid = cardsArray.concat(cardsArray);

// Randomize game grid on each load
gameGrid.sort(() => 0.5 - Math.random())

const MemoryMatchGame = () => {

	const [selected, setSelected] = useState({
		firstGuess: null,
		secondGuess: null,
	});

	const [matched, setMatched] = useState([]);

	let delay = 1200;

	const handleClick = (card, index) => {

		// Ignore clicking on the same card twice
		if (selected.firstGuess === index ||
			selected.secondGuess === index ||
			matched.includes(index)) {
			return;
		}

		if (!selected.firstGuess) {

			setSelected((prev) => ({ ...prev, firstGuess: index }));
			return;

		}

		if (!selected.secondGuess) {

			setSelected((prev) => ({ ...prev, secondGuess: index }));
			return;

		}

	};

	useEffect(() => {

		if (selected.firstGuess && selected.secondGuess) {

			const firstName = gameGrid[selected.firstGuess].name;
			const secondName = gameGrid[selected.secondGuess].name;

			// and the first guess matches the second match...
			if (firstName === secondName) {

				// run the match function
				setTimeout(() => {

					setMatched((prev) => [
						...prev,
						selected.firstGuess,
						selected.secondGuess,
					]);

					setSelected({ firstGuess: null, secondGuess: null });

				}, delay);

			} else {

				// reset the guesses
				setTimeout(() => {

					setSelected({ firstGuess: null, secondGuess: null });

				}, delay);

			}

		}

	}, [selected.firstGuess, selected.secondGuess]);

	return (
		<div id="game">
			<section className="grid">
				{gameGrid.map((card, index) => (
					<div
						key={index}
						className={`
							card
							${(selected.firstGuess === index || selected.secondGuess === index) ? 'selected' : ''}
							${matched.includes(index) ? 'match' : ''}
						`}
						onClick={() => handleClick(card, index)}>
						<div className="front" />
						<div
							className="back"
							style={{ backgroundImage: `url(${card.img})` }} />
					</div>
				))}
			</section>
		</div>
	);

};

export default MemoryMatchGame;
