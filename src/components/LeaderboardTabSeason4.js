import React from "react";
import { Col, Row } from "react-bootstrap";

import LeaderboardTable from "./LeaderboardTable";

import data from "../constants/points/season-4-top-50.json";

const LeaderboardTabSeason4 = ({ onUserClick }) => {

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
                            {"Big Onchain Spring - Season 4"}
                        </span>
                    </h2>
                </Col>
            </Row>
            <Row>
                <Col>
					<p>
						{"Ran from March 1st, 2025 to May 31st, 2025."}
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
                                href="https://x.com/base_colors"
                                target="_blank"
                                rel="noopener noreferrer nofollow">
                                <b>{"Base Colors"}</b>
                            </a>
                            {" NFT each"}
                        </li>
						<li>
		                    <strong>{"Top 3 -> "}</strong>
		                    {"1 custom Pixel Art NFT each from "}
		                    <a
		                        href="https://x.com/xPoli_arts"
		                        target="_blank"
		                        rel="noopener noreferrer nofollow">
		                        <b>{"xPoli"}</b>
		                    </a>
		                </li>
                      		<li>
                            <strong>{"1st Place -> "}</strong>
                            {"4 "}
                            <a
                                href="https://www.coingecko.com/en/coins/bmx"
                                target="_blank"
                                rel="noopener noreferrer nofollow">
                                <b>{"BMX"}</b>
                            </a>
                        </li>
						<li>
                            <strong>{"1st Place -> "}</strong>
                            {"100,000 "}
                            <a
                                href="https://dexscreener.com/base/0xf02c421e15abdf2008bb6577336b0f3d7aec98f0"
                                target="_blank"
                                rel="noopener noreferrer nofollow">
                                <b>{"QR"}</b>
                            </a>
                        </li>
                    </ul>
                    <p>
                        {"This competition was mostly just for fun. Not financial advice. DYOR :)"}
                    </p>
                </Col>
            </Row>
        </>
    );
};

export default LeaderboardTabSeason4;
