import React, { useEffect, useMemo, useState } from "react";
import { Badge, Col, Pagination, Row, Table } from "react-bootstrap";
import PropTypes from "prop-types";

import { NUM_SPECIES_TOTAL } from "../constants";

import { useFarcasterContext } from "../contexts/farcaster";
import { useWalletContext } from "../contexts/wallet";

import useLifeListLeaderboard from "../hooks/useLifeListLeaderboard";

import AccountOwner from "./AccountOwner";

const PAGE_SIZE = 10;

const LeaderboardTabSpeciesRanks = ({ onUserClick }) => {

	const { fPopulateUsers } = useFarcasterContext();
    const { account } = useWalletContext();

    // Get the list of users in the top 50
    const { data } = useLifeListLeaderboard({ account });

    const [currentPage, setCurrentPage] = useState(1);

	const [farcasterUsers, setFarcasterUsers] = useState(null);

	// Calculate pagination for raw users
	const paginationInfo = useMemo(() => {

		if (!data) { return null; }

		const totalPages = Math.ceil(data.length / PAGE_SIZE);

		const startIndex = (currentPage - 1) * PAGE_SIZE;
		const endIndex = startIndex + PAGE_SIZE;

		const currentUsers = data.slice(startIndex, endIndex);

		return {
			currentUsers,
			totalPages,
			startIndex,
			endIndex,
		};

	}, [data, currentPage]);

	// Add farcaster user data for current page only
	useEffect(() => {

		const populate = async () => {

			if (!paginationInfo || !paginationInfo.currentUsers) {
				setFarcasterUsers(null);
				return;
			}

			const result = await fPopulateUsers(paginationInfo.currentUsers);

			setFarcasterUsers(result);

		}

		populate();

	}, [paginationInfo, fPopulateUsers]);

	// Calculate final pagination state
	const paginationState = useMemo(() => {

		if (!farcasterUsers || !paginationInfo) { return null; }

		return {
			currentUsers: farcasterUsers,
			totalPages: paginationInfo.totalPages,
			startIndex: paginationInfo.startIndex,
			endIndex: paginationInfo.endIndex,
		};

	}, [farcasterUsers, paginationInfo]);

	const handlePageChange = (pageNumber) => {
		setCurrentPage(pageNumber);
	};

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
						{(!paginationState || !paginationState.currentUsers) &&
							<div className="mt-3">
								<i className="fa-solid fa-spinner fa-spin fa-xl" />
							</div>
						}
						{paginationState?.currentUsers?.length > 0 &&
							<tbody>
								{paginationState.currentUsers.map((user, index) => {

									let spacer;

									if ((paginationState.startIndex + index) === 50) {
										spacer = (
											<tr key={paginationState.startIndex + index}>
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
												key={paginationState.startIndex + index}
												className={user.address === account?.toLowerCase() ? 'table-primary' : ''}>
												<td>
													{paginationState.startIndex + index + 1}
												</td>
												<td>
													<a
														href="#"
														title="View Life List"
														style={{ textDecoration: 'none' }}
														onClick={() =>
															onUserClick({
																account: user.address,
																rank: null,
																farcaster: user.farcaster,
															})
														}>
														<AccountOwner
															user={{ address: user.address, farcaster: user.farcaster }}
															showLinkToProfile={false} />
													</a>
													{user.address === account?.toLowerCase() &&
														<Badge
															bg="info"
															className="ms-2">
															{"You"}
														</Badge>
													}
												</td>
												<td>
													{user.count}
												</td>
												<td>
													{`${((user.count / NUM_SPECIES_TOTAL) * 100).toFixed(0)}%`}
												</td>
											</tr>
										</>
									);

								})}
							</tbody>
						}
					</Table>
					{paginationState?.totalPages > 1 && (
						<Pagination className="justify-content-center">
							<Pagination.First
								disabled={currentPage === 1}
								onClick={() => handlePageChange(1)} />
							{[...Array(paginationState.totalPages)].map((_, index) => (
								<Pagination.Item
									key={index + 1}
									active={(index + 1) === currentPage}
									onClick={() => handlePageChange(index + 1)}>
									{index + 1}
								</Pagination.Item>
							))}
							<Pagination.Last
								disabled={currentPage === paginationState.totalPages}
								onClick={() => handlePageChange(paginationState.totalPages)} />
						</Pagination>
					)}
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
						{`There are ${NUM_SPECIES_TOTAL} unique species to identify, with varying rarity levels associated with each species (i.e. the number of birds for that species, ranges from 1 to 50).`}
					</p>
					<p>
						{"Once you identify (i.e. own) a species, it will be permanently stored in the Life List for your address, so you are free to sell or trade with others. No need to hoard all your birds :)"}
					</p>
				</Col>
			</Row>
        </>
    );
};

LeaderboardTabSpeciesRanks.propTypes = {
	onUserClick: PropTypes.func.isRequired,
};

export default LeaderboardTabSpeciesRanks;
