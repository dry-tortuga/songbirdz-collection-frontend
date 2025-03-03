import React from "react";
import { Col, Row, Table } from "react-bootstrap";

import { useWalletContext } from "../contexts/wallet";

import useDailyStreaksActive from "../hooks/useDailyStreaksActive";

import AccountOwner from "./AccountOwner";

import "./DailyStreakActiveResults.css";

const DailyStreakActiveResults = () => {

	const { account } = useWalletContext();

	const { data } = useDailyStreaksActive({ account });

	return (
		<Row className="mb-4">
			<Col>
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
					{!data &&
						<div className="mt-3">
							<i className="fa-solid fa-spinner fa-spin fa-xl" />
						</div>
					}
					{data?.length === 0 &&
						<div className="mt-3">
							{"Nothing to show here..."}
						</div>
					}
					{data?.length > 0 &&
						<tbody>
							{data.map((user, index) => (
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
										<AccountOwner account={user.address} />
									</td>
									<td>
										{user.login_streak}
										{` (as of ${user.last_login})`}
									</td>
								</tr>
							))}
						</tbody>
					}
				</Table>
				<Row className="mt-3 mb-3">
					<Col>
						<h2 className="d-flex align-items-center">
							<span className="me-auto">
								{"How does the Daily Streak work?"}
							</span>
						</h2>
					</Col>
				</Row>
				<Row>
					<Col>
						<p>
							{"Identify a new bird every day (i.e. mint one for 0.0015 ETH). Days end at 8pm ET, midnight UTC!"}
						</p>
						<ul style={{ listStyle: 'disc' }}>
							<li>
								{"Once your active streak hits 7 days, you'll earn 50 bonus Birder Points in Season 4."}
							</li>
							<li>
								{"Once your active streak hits 14 days, you'll earn 125 bonus Birder Points in Season 4."}
							</li>
							<li>
								{"Once your active streak hits 30 days, you'll earn 300 bonus Birder Points in Season 4."}
							</li>
						</ul>
						<p>
							{"*** In addition to the Birder Points, there could always be additional prizes in the future but this competition is mostly just for fun. Not financial advice. DYOR :) ***"}
						</p>
					</Col>
				</Row>
			</Col>
		</Row>
	);

};

export default DailyStreakActiveResults;
