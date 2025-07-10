import React, { useEffect, useMemo, useState } from "react";
import { Badge, Pagination, Table } from "react-bootstrap";
import PropTypes from "prop-types";

import AccountOwner from "./AccountOwner";

import { useFarcasterContext } from "../contexts/farcaster";
import { useWalletContext } from "../contexts/wallet";

const PAGE_SIZE = 10;

const MemoryMatchGameLeaderboard = (props) => {

	const { data, loading, error, sortBy, setSortBy } = props;

	const { fPopulateUsers } = useFarcasterContext();
	const { account } = useWalletContext();

	const [currentPage, setCurrentPage] = useState(1);

	const [farcasterUsers, setFarcasterUsers] = useState(null);

	// Calculate pagination
	const paginationInfo = useMemo(() => {

		const numItems = data ? data.length : 0;

		const totalPages = Math.ceil(numItems / PAGE_SIZE);

		const startIndex = (currentPage - 1) * PAGE_SIZE;
		const endIndex = startIndex + PAGE_SIZE;

		const currentUsers = data ? data.slice(startIndex, endIndex) : null;

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
		<div className="row">
			<div className="col">
				{loading && (
					<div className="text-center">
						<i className="fas fa-spinner fa-spin" />
					</div>
				)}
				{error && (
					<div className="alert alert-danger">
						{error}
					</div>
				)}
				{paginationState?.currentUsers && (
					<>
						<Table
							className="leaderboard-table fw-normal"
							hover
							responsive>
							<thead>
								<tr>
									<th scope="col">
										{"#"}
									</th>
									<th scope="col">
										{"Account"}
									</th>
									<th
										scope="col"
										style={{cursor: "pointer"}}
										onClick={() => setSortBy("today")}>
										<div className="d-flex align-items-center">
											<span>{"Today"}</span>
											{sortBy === "today" &&
												<i
													className="fas fa-sort-down ms-1"
													style={{ marginTop: '-0.25rem' }} />
											}
										</div>
									</th>
									<th
										scope="col"
										style={{cursor: "pointer"}}
										onClick={() => setSortBy("total")}>
										<div className="d-flex align-items-center">
											<span>{"Total"}</span>
											{sortBy === "total" &&
												<i
													className="fas fa-sort-down ms-1"
													style={{ marginTop: '-0.25rem' }} />
											}
										</div>
									</th>
								</tr>
							</thead>
							<tbody>
								{paginationState.currentUsers.map((user, index) => {

									const finalIndex = paginationState.startIndex + index;

									let spacer;

									if (finalIndex === 20) {
										spacer = (
											<tr key={finalIndex}>
												<td
													colSpan="4"
													className="text-center">
													<i className="fas fa-ellipsis-h" />
												</td>
											</tr>
										);
									}

									return (
										<>
											{spacer}
											<tr
												key={finalIndex}
												className={user.address === account?.toLowerCase() ? 'table-primary' : ''}>
												<td>{user.rank}</td>
												<td>
													<AccountOwner
														user={{ address: user.address, farcaster: user.farcaster }}
														showLinkToProfile />
													{user.address === account?.toLowerCase() &&
														<Badge
															bg="info"
															className="ms-2">
															{"You"}
														</Badge>
													}
												</td>
												<td>{user.today}</td>
												<td>{user.total}</td>
											</tr>
										</>
									);

								})}
								{paginationState.currentUsers.length === 0 && (
									<tr>
										<td colSpan="6" className="text-center">
											{"No scores recorded yet."}
										</td>
									</tr>
								)}
							</tbody>
						</Table>
						{paginationState.totalPages > 1 && (
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
					</>
				)}
			</div>
		</div>
	);

};

const propTypes = {
	data: PropTypes.arrayOf(PropTypes.shape({
		address: PropTypes.string.isRequired,
		rank: PropTypes.number.isRequired,
		today: PropTypes.number.isRequired,
		total: PropTypes.number.isRequired,
	})),
	loading: PropTypes.bool,
	error: PropTypes.string,
	sortBy: PropTypes.string,
	setSortBy: PropTypes.func.isRequired,
};

MemoryMatchGameLeaderboard.propTypes = propTypes;

export default MemoryMatchGameLeaderboard;
