import React from "react";
import { Col, Row } from "react-bootstrap";

import LeaderboardTable from "./LeaderboardTable";

import data from "../constants/points/season-3-top-50.json";

const LeaderboardTabSeason3 = ({ onUserClick }) => {

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
                            {"Big Onchain Winter - Season 3"}
                        </span>
                    </h2>
                </Col>
            </Row>
            <Row>
                <Col>
					<p>
						{"Ran from December 1st, 2024 to February 28th, 2025."}
					</p>
                    <p>
                    	{"Accounts with the most Birder Points received:"}
                    </p>
                    <ul style={{ listStyle: "disc" }}>
	                   	<li>
	                        <strong>{"Top 10 -> "}</strong>
	                        {"0.25 ETH split amongst the top 10"}
	                    </li>
                        <li>
                            <strong>{"Top 10 -> "}</strong>
                            {"1 "}
                            <a
                                href="https://x.com/ShibaPunkz"
                                target="_blank"
                                rel="noopener noreferrer nofollow">
                                <b>{"Based ShibaPunkz"}</b>
                            </a>
                            {" NFT each"}
                        </li>
                        <li>
                            <strong>{"Top 10 -> "}</strong>
                            {"1 "}
                            <a
                                href="https://x.com/BaseBullsNFT"
                                target="_blank"
                                rel="noopener noreferrer nofollow">
                                <b>{"BaseBulls"}</b>
                            </a>
                            {" NFT each"}
                        </li>
                        <li>
                            <strong>{"Top 10 -> "}</strong>
                            {"$3.50 worth of "}
                            <a
                                href="https://x.com/toastonbase"
                                target="_blank"
                                rel="noopener noreferrer nofollow">
                                <b>{"TOAST"}</b>
                            </a>
                            {" each... enough to treat yourself to a nice loaf of bread"}
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

export default LeaderboardTabSeason3;
