import React, { useMemo, useState } from "react";
import { Badge, Pagination, Table } from "react-bootstrap";

import AccountOwner from "./AccountOwner";

import { useWalletContext } from "../contexts/wallet";

const PAGE_SIZE = 10;

const MemoryMatchGameLeaderboard = (props) => {

	const { data, loading, error, sortBy, setSortBy } = props;

	const { account } = useWalletContext();

	const [currentPage, setCurrentPage] = useState(1);

    // Calculate pagination
	const paginationState = useMemo(() => {

		const numItems = data ? data.length : 0;

		const totalPages = Math.ceil(numItems / PAGE_SIZE);

		const startIndex = (currentPage - 1) * PAGE_SIZE;
		const endIndex = startIndex + PAGE_SIZE;

		const currentData = data ? data.slice(startIndex, endIndex) : null;

		return {
			currentData,
			totalPages,
			startIndex,
			endIndex,
		};

	}, [data, currentPage]);

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
				{paginationState.currentData && (
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
								{paginationState.currentData.map((entry, index) => {

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
												className={entry.address === account?.toLowerCase() ? 'table-primary' : ''}>
												<td>{entry.rank}</td>
												<td>
													<AccountOwner user={{ address: entry.address }} />
													{entry.address === account?.toLowerCase() &&
														<Badge
															bg="info"
															className="ms-2">
															{"You"}
														</Badge>
													}
												</td>
												<td>{entry.today}</td>
												<td>{entry.total}</td>
											</tr>
										</>
									);

								})}
								{paginationState.currentData.length === 0 && (
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
			                        onClick={() => handlePageChange(1)}
			                        disabled={currentPage === 1} />
			                    {[...Array(paginationState.totalPages)].map((_, index) => (
			                        <Pagination.Item
			                            key={index + 1}
			                            active={(index + 1) === currentPage}
			                            onClick={() => handlePageChange(index + 1)}>
			                            {index + 1}
			                        </Pagination.Item>
			                    ))}
			                    <Pagination.Last
			                        onClick={() => handlePageChange(paginationState.totalPages)}
			                        disabled={currentPage === paginationState.totalPages} />
			                </Pagination>
			            )}
					</>
				)}
			</div>
		</div>
	);

};

export default MemoryMatchGameLeaderboard;
