import React from "react";
import { Link } from "react-router-dom";
import { Button, Table } from "react-bootstrap";

import AccountOwner from "./AccountOwner";

import "./LeaderboardTable.css";

const LeaderboardTable = (props) => {

	const { users, onUserClick } = props;

	return (
		<Table
			className="leaderboard-table fw-normal"
			hover
			responsive>
			<thead>
				<tr>
					<th scope="col">
						{"Rank"}
					</th>
					<th scope="col">
						{"Account"}
					</th>
					<th scope="col">
						{"Birder Points"}
					</th>
				</tr>
			</thead>
			<tbody>
				{users.length === 0 &&
					<span>
						{"Nothing to show here..."}
					</span>
				}
				{users.map((user, index) => (
					<tr
						key={index}
						className={index < 10 ? "top-10" : ""}>
						<td>
							{index + 1}
						</td>
						<td>
							<a
								href="#"
								title="View Life List"
								onClick={() => onUserClick(user.address)}>
								<AccountOwner account={user.address} />
							</a>
						</td>
						<td>
							{user.total}
						</td>
					</tr>
				))}
			</tbody>
		</Table>
	);

};

export default LeaderboardTable;
