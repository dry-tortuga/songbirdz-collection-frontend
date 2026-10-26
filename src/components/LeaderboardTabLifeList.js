import React, { useMemo } from "react";
import { Badge, Col, ProgressBar, Row, Table } from "react-bootstrap";
import { Link } from "react-router-dom";

import { NUM_SPECIES_TOTAL } from "../constants";

import { useWalletContext } from "../contexts/wallet";

import usePagination from "../hooks/usePagination";
import useLifeListLeaderboard from "../hooks/useLifeListLeaderboard";

import AccountOwner from "./AccountOwner";
import PaginationControls from "./PaginationControls";

const TOP_SIZE = 50;

const LeaderboardTabLifeList = () => {

	const { account } = useWalletContext();

	const { data } = useLifeListLeaderboard({ account });

	// The server may append the current user after the top 50, so rank them separately
	const ranked = useMemo(
		() => (data || []).map((user, index) => ({ ...user, rank: user.rank ?? index + 1 })),
		[data],
	);

	const top = useMemo(() => ranked.filter((user) => user.rank <= TOP_SIZE), [ranked]);

	const me = account
		? ranked.find((user) => user.address === account.toLowerCase())
		: null;

	const completed = top.filter((user) => user.count >= NUM_SPECIES_TOTAL).length;

	const { page, totalPages, pageItems, setPage } = usePagination(top, 10);

	return (
		<>
			<Row className="mb-3">
				<Col>
					<div className="p-3 border rounded">
						<strong>{"Race to 800"}</strong>
						{" "}
						<span className="text-muted">
							{completed > 0
								? `${completed} birder${completed === 1 ? " has" : "s have"} recorded every species.`
								: "Nobody has recorded all 800 species yet."}
						</span>
					</div>
				</Col>
			</Row>
			<Row className="mb-4">
				<Col>
					{!data &&
						<i className="fa-solid fa-spinner fa-spin fa-xl" role="status" aria-label="Loading" />
					}
					{data &&
						<Table className="fw-normal" hover responsive>
							<thead>
								<tr>
									<th scope="col">{"#"}</th>
									<th scope="col">{"Birder"}</th>
									<th scope="col">{"Life List"}</th>
								</tr>
							</thead>
							<tbody>
								{pageItems.length === 0 &&
									<tr><td colSpan="3">{"Nothing to show here..."}</td></tr>
								}
								{pageItems.map((user) => (
									<tr
										key={user.address}
										className={user.address === account?.toLowerCase() ? "table-primary" : ""}>
										<td>{user.rank}</td>
										<td>
											<AccountOwner user={{ address: user.address }} />
										</td>
										<td style={{ minWidth: "12rem" }}>
											<div className="d-flex align-items-center gap-2">
												<ProgressBar
													className="flex-grow-1"
													now={(user.count / NUM_SPECIES_TOTAL) * 100}
													style={{ height: "0.75rem" }}
													aria-label={`${user.count} of ${NUM_SPECIES_TOTAL} species`} />
												<span className="text-nowrap">
													{`${user.count} / ${NUM_SPECIES_TOTAL}`}
												</span>
											</div>
										</td>
									</tr>
								))}
							</tbody>
						</Table>
					}
					<PaginationControls page={page} totalPages={totalPages} onChange={setPage} />
				</Col>
			</Row>
			{me &&
				<div
					className="d-flex align-items-center gap-3 p-3 border-top bg-body-secondary"
					style={{ position: "sticky", bottom: 0, zIndex: 2 }}>
					<Badge bg="info">{"You"}</Badge>
					<span>{`Rank ${me.rank}`}</span>
					<span>{`${me.count} / ${NUM_SPECIES_TOTAL} species`}</span>
					<Link className="ms-auto" to="/profile">{"View my profile"}</Link>
				</div>
			}
			<Row className="mt-3 mb-3">
				<Col>
					<h2>{"How does the Life List leaderboard work?"}</h2>
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
					<p>
						{"Select any birder to open their profile and see which species they have recorded."}
					</p>
				</Col>
			</Row>
		</>
	);

};

export default LeaderboardTabLifeList;
