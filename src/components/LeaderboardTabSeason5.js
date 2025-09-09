import React from "react";
import PropTypes from "prop-types";
import { Col, Row } from "react-bootstrap";

import { useFarcasterContext } from "../contexts/farcaster";

import LeaderboardTable from "./LeaderboardTable";

import data from "../constants/points/season-5-top-50.json";

const LeaderboardTabSeason5 = ({ onUserClick }) => {

	const { fOpenExternalURL } = useFarcasterContext();

	return (
		<>
			<Row className="mb-4">
				<Col>
					<LeaderboardTable
						users={data}
						onUserClick={onUserClick} />
				</Col>
			</Row>
			<Row className="mb-3">
				<Col>
					<h2 className="d-flex align-items-center">
						<span className="me-auto">
							{"Big Onchain Summer 2.0 - Season 5"}
						</span>
					</h2>
				</Col>
			</Row>
			<Row>
				<Col>
					<p>
						{"Ran from June 1st, 2025 to August 31st, 2025."}
					</p>
					<p>
						{"Accounts with the most Birder Points received:"}
					</p>
					<ul style={{ listStyle: "disc" }}>
						<li>
							<strong>{"Top 10 -> "}</strong>
							{"0.25 ETH split amongst the top 10 (% based on Birder Points)"}
						</li>
						<li>
							<strong>{"Top 5 -> "}</strong>
							{"1986.5 "}
							<a
								href="https://dexscreener.com/base/0x64cc19a52f4d631ef5be07947caba14ae00c52eb"
								target="_blank"
								rel="noopener noreferrer nofollow"
								onClick={fOpenExternalURL}>
								<b>{"KIBBLE"}</b>
							</a>
							{" (~$10 each) from "}
							<a
								href="https://x.com/cattownbase/"
								target="_blank"
								rel="noopener noreferrer nofollow"
								onClick={fOpenExternalURL}>
								<b>{"Cat Town"}</b>
							</a>
						</li>
						<li>
							<strong>{"Top 3 -> "}</strong>
							{"1 trophy each in the Songbirdz "}
							<a
								href="https://opensea.io/collection/songbirdz-hall-of-fame"
								target="_blank"
								rel="noopener noreferrer nofollow"
								onClick={fOpenExternalURL}>
								<b>{"Hall of Fame"}</b>
							</a>
						</li>
					</ul>
					<p>
						{"This competition was just for fun. Not financial advice. DYOR :)"}
					</p>
				</Col>
			</Row>
		</>
	);
};

LeaderboardTabSeason5.propTypes = {
	onUserClick: PropTypes.func.isRequired,
};

export default LeaderboardTabSeason5;
