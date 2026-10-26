import React from "react";
import PropTypes from "prop-types";
import { Table } from "react-bootstrap";

import { useWalletContext } from "../contexts/wallet";

import usePagination from "../hooks/usePagination";

import AccountOwner from "./AccountOwner";
import PaginationControls from "./PaginationControls";

import "./LeaderboardTable.css";

// Birder Points table (used by the read-only season archive)
const LeaderboardTable = ({ users }) => {

	const { account } = useWalletContext();

	const { page, totalPages, start, pageItems, setPage } = usePagination(users, 10);

	const isCurrentUser = (user) => Boolean(
		account && user.address.toLowerCase() === account.toLowerCase(),
	);

	return (
		<>
			<Table className="leaderboard-table fw-normal" hover responsive>
				<thead>
					<tr>
						<th scope="col">{"#"}</th>
						<th scope="col">{"Account"}</th>
						<th scope="col">{"Birder Points"}</th>
					</tr>
				</thead>
				<tbody>
					{pageItems.length === 0 &&
						<tr>
							<td colSpan="3">{"Nothing to show here..."}</td>
						</tr>
					}
					{pageItems.map((user, index) => (
						<tr
							key={user.address}
							className={isCurrentUser(user) ? "current-user" : ""}>
							<td>
								{start + index + 1}
								{isCurrentUser(user) &&
									<span className="ms-3">{"(You)"}</span>
								}
							</td>
							<td>
								<AccountOwner user={{ address: user.address }} />
							</td>
							<td>{user.total}</td>
						</tr>
					))}
				</tbody>
			</Table>
			<PaginationControls page={page} totalPages={totalPages} onChange={setPage} />
		</>
	);

};

LeaderboardTable.propTypes = {
	users: PropTypes.arrayOf(PropTypes.shape({
		address: PropTypes.string.isRequired,
		total: PropTypes.number.isRequired,
	})).isRequired,
};

export default LeaderboardTable;
