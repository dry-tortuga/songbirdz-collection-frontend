import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Col, Row, Table } from "react-bootstrap";

import { useFarcasterContext } from "../contexts/farcaster";
import { useWalletContext } from "../contexts/wallet";

import useDailyStreaksActive from "../hooks/useDailyStreaksActive";

import AccountOwner from "./AccountOwner";

const LeaderboardTabDailyStreakActive = ({ onUserClick }) => {

	const { fPopulateUsers } = useFarcasterContext();
	const { account } = useWalletContext();

	const { data } = useDailyStreaksActive({ account });

	const [farcasterUsers, setFarcasterUsers] = useState(null);

	// Add farcaster user data
	useEffect(() => {

		const populate = async () => {

			if (!data) {
				setFarcasterUsers(null);
				return;
			}

			const result = await fPopulateUsers(data);

			setFarcasterUsers(result);

		}

		populate();

	}, [data, fPopulateUsers]);

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
								{"#"}
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
					{!farcasterUsers &&
						<div className="mt-3">
							<i className="fa-solid fa-spinner fa-spin fa-xl" />
						</div>
					}
					{farcasterUsers?.length === 0 &&
						<div className="mt-3">
							{"Nothing to show here..."}
						</div>
					}
					{farcasterUsers?.length > 0 &&
						<tbody>
							{farcasterUsers.map((user, index) => (
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
											style={{ textDecoration: 'none' }}
											onClick={() =>
												onUserClick({
													account: user.address,
													rank: null,
													farcaster: user.farcaster,
												})
											}>
											<AccountOwner
												user={{ address: user.address, farcaster: user.farcaster }}
												showLinkToProfile={false} />
										</a>
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
								{"Once your active streak hits 7 days, you'll earn 50 bonus Birder Points in Season 5."}
							</li>
							<li>
								{"Once your active streak hits 14 days, you'll earn 125 bonus Birder Points in Season 5."}
							</li>
							<li>
								{"Once your active streak hits 30 days, you'll earn 300 bonus Birder Points in Season 5."}
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

const propTypes = {
	onUserClick: PropTypes.func.isRequired,
};

LeaderboardTabDailyStreakActive.propTypes = propTypes;

export default LeaderboardTabDailyStreakActive;
