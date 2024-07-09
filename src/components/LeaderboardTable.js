import React from "react";
import { Link } from "react-router-dom";
import { Button, Table } from "react-bootstrap";

import { useWalletContext } from "../contexts/wallet";

import AccountOwner from "./AccountOwner";

import "./LeaderboardTable.css";

const LeaderboardTable = (props) => {

	const { users, onUserClick } = props;

	const { account } = useWalletContext();

	const filteredUsers = useMemo(() => {

		return users.filter((user) =>
			user.address.toLowerCase() !== "0x3fb4920e09493b2bc7e9b7e14ea7585ca8babf21" &&
			user.address.toLowerCase() !== "0x585d3ef48e12cb1be6837109b0853afe78B5ebe3"
		)

	}, [users]);

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
				{filteredUsers.length === 0 &&
					<span>
						{"Nothing to show here..."}
					</span>
				}
				{filteredUsers.map((user, index) => (
					<tr
						key={index}
						className={
							(account && user.address.toLowerCase() === account.toLowerCase()) ? "current-user" : ""}>
						<td>
							{index + 1}
						</td>
						<td>
							<a
								href="#"
								title="View Life List"
								onClick={() => onUserClick({
									account: user.address,
									total: user.total,
									rank: index + 1,
								})}>
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
