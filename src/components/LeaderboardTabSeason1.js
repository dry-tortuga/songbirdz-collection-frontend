import React from "react";
import { Col, Row } from "react-bootstrap";

import LeaderboardTable from "./LeaderboardTable";

import data from "../constants/points/season-1-top-50.json";

const LeaderboardTabSeason1 = ({ onUserClick }) => {

    return (
        <>
            <Row className="mb-4">
                <Col>
                    <LeaderboardTable
                        users={data}
                        onUserClick={onUserClick} />
                    <div className="text-center">
                        {data.timestampMessage}
                    </div>
                </Col>
            </Row>
            <Row className="mb-3">
                <Col>
                    <h2 className="d-flex align-items-center">
                        <span className="me-auto">
                            {"Big Onchain Summer - Season 1"}
                        </span>
                    </h2>
                </Col>
            </Row>
            <Row>
                <Col>
                    <p>
                        {"Ran from the Songbirdz genesis date (i.e. April 4th, 2024) to the last day of Onchain Summer on Base (i.e. August 31st, 2024 at 11PM UTC)."}
                    </p>
                    <p>
                        {"Accounts with the most Birder Points received:"}
                    </p>
                    <ul style={{ listStyle: "disc" }}>
                        <li>
                            <strong>{"Top 10 -> "}</strong>
                            {"1 airdrop from each of the remaining 9 flocks in the Songbirdz collection, i.e. 9 birds each!"}
                        </li>
                        <li>
                            <strong>{"Top 10 -> "}</strong>
                            {"0.339975 ETH split amongst the top 10"}
                        </li>
                        <li>
                            <strong>{"Top 10 -> "}</strong>
                            {"1325 "}
                            <a
                                href="https://x.com/toastonbase"
                                target="_blank"
                                rel="noopener noreferrer nofollow">
                                {"TOAST"}
                            </a>
                        </li>
                        <li>
                            <strong>{"Top 10 -> "}</strong>
                            {"5 pack of Paint Cartridges from "}
                            <a
                                href="https://dot.fan"
                                target="_blank"
                                rel="noopener noreferrer nofollow">
                                {"dot.fan"}
                            </a>
                        </li>
                        <li>
                            <strong>{"Top 10 -> "}</strong>
                            {"1000 KIBBLE from "}
                            <a
                                href="https://cat.town"
                                target="_blank"
                                rel="noopener noreferrer nofollow">
                                {"cat.town"}
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

export default LeaderboardTabSeason1;
