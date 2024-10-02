import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { Button, Table } from "react-bootstrap";

import { useWalletContext } from "../contexts/wallet";

import AccountOwner from "./AccountOwner";

// import "./DailyStreakCompetition.css";

const DailyStreakCompetition = (props) => {

	const { users, onUserClick } = props;

	const { contractInterface } = useWalletContext();

	const filter = contractInterface.encodeFilterTopics("Transfer", [
		"0x0000000000000000000000000000000000000000"
	]);

	console.log(`Printing event details:`);

	// const transferEvents = await contract.queryFilter('Transfer', block - 10, block);

	return (
		<Table
			className="daily-streak-table fw-normal"
			hover
			responsive>
			<thead>
				<tr>
					<th scope="col">
						{"Rank"}
					</th>
					<th
						className="ps-5"
						scope="col">
						{"Account"}
					</th>
					<th scope="col">
						{"Daily Streak"}
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
							<span>
								{index + 1}
							</span>
							{(account && user.address.toLowerCase() === account.toLowerCase()) &&
								<span className="ms-3">
									{"(You)"}
								</span>
							}
						</td>
						<td>
							<a
								href="#"
								title="View Life List"
								onClick={() => onUserClick({
									account: user.address,
									total: user.total,
									// rank: index + 1,
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

export default DailyStreakCompetition;
