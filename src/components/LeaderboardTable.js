import React from "react";
import { Link } from "react-router-dom";
import { Table } from "react-bootstrap";

import AccountOwner from "./AccountOwner";

// import "./LeaderboardTable.css";

const LeaderboardTable = (props) => {

	const { users } = props;

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
					<tr key={index}>
						<td>
							{index + 1}
						</td>
						<td>
							<AccountOwner account={user.address} />
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
