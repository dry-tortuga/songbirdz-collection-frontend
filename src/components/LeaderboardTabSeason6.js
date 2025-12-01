import React from "react";
import PropTypes from "prop-types";
import { Col, Row } from "react-bootstrap";

import { useFarcasterContext } from "../contexts/farcaster";

import LeaderboardTable from "./LeaderboardTable";

import data from "../constants/points/season-6-top-50.json";

const LeaderboardTabSeason6 = ({ onUserClick }) => {

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
							{"Big Onchain Fall 2.0 - Season 6"}
						</span>
					</h2>
				</Col>
			</Row>
			<Row>
				<Col>
					<p>
						{"Ran from September 1st, 2025 to November 30th, 2025."}
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
							<strong>{"Top 10 -> "}</strong>
							{"1 "}
							<a
								href="https://x.com/blueprint_token/status/1988251715129282942"
								target="_blank"
								rel="noopener noreferrer nofollow"
								onClick={fOpenExternalURL}>
								<b>{"Blueprint Pack"}</b>
							</a>
							{" from "}
							<a
								href="https://vibechain.com/market/blueprint-3"
								target="_blank"
								rel="noopener noreferrer nofollow"
								onClick={fOpenExternalURL}>
								<b>{"Vibe Market"}</b>
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

LeaderboardTabSeason6.propTypes = {
	onUserClick: PropTypes.func.isRequired,
};

export default LeaderboardTabSeason6;
