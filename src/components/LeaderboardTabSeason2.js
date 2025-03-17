import React from "react";
import { Col, Row } from "react-bootstrap";

import LeaderboardTable from "./LeaderboardTable";

import data from "../constants/points/season-2-top-50.json";

const LeaderboardTabSeason2 = ({ onUserClick }) => {

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
                            {"Big Onchain Fall - Season 2"}
                        </span>
                    </h2>
                </Col>
            </Row>
            <Row>
                <Col>
                    <p>
                        {"Ran from September 1st, 2024 to November 30th, 2024."}
                    </p>
                    <p>
                        {"Accounts with the most Birder Points received:"}
                    </p>
                    <ul style={{ listStyle: "disc" }}>
                        <li>
                            <strong>{"Top 10 -> "}</strong>
                            {"1 airdrop from each of the remaining 7 flocks in the Songbirdz collection, i.e. 7 birds each!"}
                        </li>
                        <li>
                            <strong>{"Top 10 -> "}</strong>
                            {"0.25 ETH split amongst the top 10"}
                        </li>
                        <li>
                            <strong>{"Top 5 -> "}</strong>
                            {"$10 worth of "}
                            <a
                                href="https://x.com/basedpeplo"
                                target="_blank"
                                rel="noopener noreferrer nofollow">
                                <b>{"PEPLO"}</b>
                            </a>
                        </li>
                        <li>
                            <strong>{"1st Place -> "}</strong>
                            {"1 plot on the "}
                            <a
                                href="https://millionbithomepage.com/"
                                target="_blank"
                                rel="noopener noreferrer nofollow">
                                <b>{"Million Bit Homepage"}</b>
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

export default LeaderboardTabSeason2;
