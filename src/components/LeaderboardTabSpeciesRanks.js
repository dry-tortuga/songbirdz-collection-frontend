import React from "react";
import { Badge, Col, Row, Table } from "react-bootstrap";

import { NUM_SPECIES_TOTAL } from "../constants";

import { useWalletContext } from "../contexts/wallet";

import useLifeListLeaderboard from "../hooks/useLifeListLeaderboard";

import AccountOwner from "./AccountOwner";

const LeaderboardTabSpeciesRanks = ({ onUserClick }) => {

    const { account } = useWalletContext();

    // Get the list of users in the top 50
    const { data } = useLifeListLeaderboard({ account });

    return (
        <>
            <Row className="mb-4">
                <Col>
	                <Table
						className="life-list-species-ranks-table fw-normal"
						hover
						responsive>
						<thead>
							<tr>
								<th scope="col">
									{"#"}
								</th>
								<th
									className="ps-5"
									scope="col">
									{"Account"}
								</th>
								<th scope="col">
									{"Species"}
								</th>
								<th scope="col">
									{"Completion"}
								</th>
							</tr>
						</thead>
						{!data &&
							<div className="mt-3">
								<i className="fa-solid fa-spinner fa-spin fa-xl" />
							</div>
						}
						{data?.length === 0 &&
							<div className="mt-3">
								{"Nothing to show here..."}
							</div>
						}
						{data?.length > 0 &&
							<tbody>
								{data.map((entry, index) => {

									let spacer;

									if (index === 50) {
										spacer = (
											<tr key={index}>
												<td colSpan="4" className="text-center">
													<i className="fas fa-ellipsis-h" />
												</td>
											</tr>
										);
									}

									return (
										<>
											{spacer}
											<tr
												key={index}
												className={entry.address === account?.toLowerCase() ? 'table-primary' : ''}>
												<td>{entry.rank}</td>
												<td>
													<a
														href="#"
														title="View Life List"
														onClick={() =>
															onUserClick({
																account: entry.address,
																total: 0,
															})
														}>
														<AccountOwner account={entry.address} />
													</a>
													{entry.address === account?.toLowerCase() &&
														<Badge
															bg="info"
															className="ms-2">
															{"You"}
														</Badge>
													}
												</td>
												<td>{entry.count}</td>
												<td>{`${((entry.count / NUM_SPECIES_TOTAL) * 100).toFixed(0)}%`}</td>
											</tr>
										</>
									);

								})}
							</tbody>
						}
					</Table>
                </Col>
            </Row>
            <Row className="mt-3 mb-3">
				<Col>
					<h2 className="d-flex align-items-center">
						<span className="me-auto">
							{"How does the \"Species\" leaderboard work?"}
						</span>
					</h2>
				</Col>
			</Row>
			<Row>
				<Col>
					<p>
						{"Keep track of your progress towards identifying (i.e. owning) each unique species in the Songbirdz collection!"}
					</p>
					<p>
						{`As of now, there are ${NUM_SPECIES_TOTAL} unique species to identify, with a "pending" final total of 800 once all the flocks are released into the wild!`}
					</p>
					<p>
						{"Once you identify (i.e. own) a species, it will be permanently stored in the Life List for your address, so you are free to sell or trade with others. No need to hoard all your birds :)"}
					</p>
				</Col>
			</Row>
        </>
    );
};

export default LeaderboardTabSpeciesRanks;
