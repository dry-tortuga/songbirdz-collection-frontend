import React, { useMemo } from "react";
import { Table } from "react-bootstrap";
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

	const firstToFinish = completed > 0 ? top[0] : null;

	const { page, totalPages, pageItems, setPage } = usePagination(top, 10);

	// The mockup's "Ready to record" count is gated behind the Phase 2 Life List
	// contract, so the CTA currently shows how many species are still missing
	const speciesToGo = me ? Math.max(0, NUM_SPECIES_TOTAL - me.count) : 0;

	return (
		<>
			<div className="leaderboard-race-banner">
				<b>{"Race to 800"}</b>
				<span className="race-text">
					{completed > 0
						? `${completed} birder${completed === 1 ? " has" : "s have"} completed the Life List.`
						: "Nobody has recorded all 800 species yet."}
					{firstToFinish &&
						<>
							{" First to finish: "}
							<AccountOwner user={{ address: firstToFinish.address }} />
						</>
					}
				</span>
				<span className="race-pill">{"Sort: species"}</span>
			</div>
			{!data &&
				<div className="my-3">
					<i className="fa-solid fa-spinner fa-spin fa-xl" role="status" aria-label="Loading" />
				</div>
			}
			{data &&
				<Table className="leaderboard-life-list-table" hover responsive>
					<thead>
						<tr>
							<th scope="col" className="rank-col">{"#"}</th>
							<th scope="col">{"Birder"}</th>
							<th scope="col" className="lifelist-col">{"Life List"}</th>
							<th scope="col" className="action-col" aria-label="Profile link" />
						</tr>
					</thead>
					<tbody>
						{pageItems.length === 0 &&
							<tr><td colSpan="4">{"Nothing to show here..."}</td></tr>
						}
						{pageItems.map((user) => (
							<tr
								key={user.address}
								className={user.address === account?.toLowerCase() ? "table-primary" : ""}>
								<td>{user.rank}</td>
								<td>
									<AccountOwner user={{
										address: user.address,
										rarestBirdId: user.rarest_bird_id,
									}} />
								</td>
								<td className="lifelist-col">
									<div className="d-flex align-items-center gap-2">
										<div
											className="leaderboard-progress"
											role="progressbar"
											aria-label={`${user.count} of ${NUM_SPECIES_TOTAL} species`}>
											<div
												className="progress-fill"
												style={{ width: `${(user.count / NUM_SPECIES_TOTAL) * 100}%` }} />
										</div>
										<span className="leaderboard-count text-nowrap">
											{`${user.count}/${NUM_SPECIES_TOTAL}`}
										</span>
									</div>
								</td>
								<td className="action-col">
									<Link
										className="view-profile text-nowrap"
										title="View Life List"
										to={`/profile/${user.address.toLowerCase()}`}>
										{"View profile"}
									</Link>
								</td>
							</tr>
						))}
					</tbody>
				</Table>
			}
			<PaginationControls page={page} totalPages={totalPages} onChange={setPage} />
			<p className="leaderboard-note">
				{"Ties go to whoever reached the count first. Every row opens the full profile."}
			</p>
			{me &&
				<div className="leaderboard-you-bar">
					<b>{"You"}</b>
					<span>{`Rank ${me.rank}`}</span>
					<div
						className="leaderboard-progress you-progress"
						role="progressbar"
						aria-label={`${me.count} of ${NUM_SPECIES_TOTAL} species`}>
						<div
							className="progress-fill"
							style={{ width: `${(me.count / NUM_SPECIES_TOTAL) * 100}%` }} />
					</div>
					<span>{`${me.count}/${NUM_SPECIES_TOTAL}`}</span>
					<Link
						className="you-cta"
						title="View my profile"
						to="/profile">
						{speciesToGo > 0
							? `Species to go: ${speciesToGo}`
							: "Life List complete"}
					</Link>
				</div>
			}
		</>
	);

};

export default LeaderboardTabLifeList;
