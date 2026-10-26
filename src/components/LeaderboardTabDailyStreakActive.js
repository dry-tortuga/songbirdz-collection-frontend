import React from "react";
import { Col, Row, Table } from "react-bootstrap";

import { useWalletContext } from "../contexts/wallet";

import useDailyStreaksActive from "../hooks/useDailyStreaksActive";

import AccountOwner from "./AccountOwner";

const LeaderboardTabDailyStreakActive = () => {

	const { account } = useWalletContext();

	const { data } = useDailyStreaksActive({ account });

	const isCurrentUser = (user) => Boolean(
		account && user.address.toLowerCase() === account.toLowerCase(),
	);

	return (
		<>
			<Row className="mb-4">
				<Col>
					{!data &&
						<i className="fa-solid fa-spinner fa-spin fa-xl" role="status" aria-label="Loading" />
					}
					{data &&
						<Table className="daily-streak-table fw-normal" hover responsive>
							<thead>
								<tr>
									<th scope="col">{"#"}</th>
									<th scope="col">{"Account"}</th>
									<th scope="col">{"Daily Streak"}</th>
								</tr>
							</thead>
							<tbody>
								{data.length === 0 &&
									<tr><td colSpan="3">{"Nothing to show here..."}</td></tr>
								}
								{data.map((user, index) => (
									<tr
										key={user.address}
										className={isCurrentUser(user) ? "table-primary" : ""}>
										<td>
											{index + 1}
											{isCurrentUser(user) &&
												<span className="ms-3">{"(You)"}</span>
											}
										</td>
										<td>
											<AccountOwner user={{ address: user.address }} />
										</td>
										<td>
											{user.login_streak}
											{` (as of ${user.last_login})`}
										</td>
									</tr>
								))}
							</tbody>
						</Table>
					}
				</Col>
			</Row>
			<Row className="mt-3 mb-3">
				<Col>
					<h2>{"How does the Daily Streak work?"}</h2>
				</Col>
			</Row>
			<Row>
				<Col>
					<p>
						{"Identify a new bird every day (i.e. mint one for 0.0015 ETH). Days end at 8pm ET, midnight UTC!"}
					</p>
					<ul style={{ listStyle: "disc" }}>
						<li>{"Once your active streak hits 7 days, you'll earn 50 bonus Birder Points."}</li>
						<li>{"Once your active streak hits 14 days, you'll earn 125 bonus Birder Points."}</li>
						<li>{"Once your active streak hits 30 days, you'll earn 300 bonus Birder Points."}</li>
						<li>{"Once your active streak hits 75 days, you'll earn 1000 bonus Birder Points."}</li>
					</ul>
				</Col>
			</Row>
		</>
	);

};

export default LeaderboardTabDailyStreakActive;
