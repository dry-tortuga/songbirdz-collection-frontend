import React, { useCallback, useState } from "react";
import {
	Badge,
	Button,
	Col,
	Container,
	Modal,
	Row,
} from "react-bootstrap";

import { useWalletContext } from "../contexts/wallet";

import LeaderboardTable from "../components/LeaderboardTable";
import LifeListModal from "../components/LifeListModal";

import useLeaderboard from "../hooks/useLeaderboard";

// import "./Leaderboard.css";

const Leaderboard = () => {

	const context = useWalletContext();

	// Get the list of users in the top 50
	const { data: users } = useLeaderboard({ context });

	const [lifeListModalAddress, setLifeListModalAddress] = useState(null);

	console.debug("-------------- Leaderboard -----------");
	console.debug(users);
	console.debug(context);
	console.debug("--------------------------------------")

	return (
		<div className="leaderboard-page">
			<Container className="mt-4">
				<Row className="mb-3">
					<Col>
						<h1 className="d-flex align-items-center">
							<span className="me-auto">
								{"Leaderboard"}
							</span>
						</h1>
					</Col>
				</Row>
				<Row>
					<Col>
						{!users &&
							<i className="fa-solid fa-spinner fa-spin fa-xl me-2" />
						}
						{/*
							{!context.account &&
								<span className="me-1">
									{"Connect your wallet to get started..."}
								</span>
							}
							{!context.isOnCorrectChain &&
								<span className="me-1">
									{"Double check to make sure you're on the Base network..."}
								</span>
							}
							{!context.account &&
								<div className="d-md-none d-flex align-items-center justify-content-center mt-3">
									<Button
										variant="primary"
										onClick={() => context.onConnectWallet()}>
										{"Connect Wallet"}
									</Button>
								</div>
							}
						*/}
						{users &&
							<LeaderboardTable
								users={users}
								onUserClick={setLifeListModalAddress} />
						}
						{users &&
							<LifeListModal
								key={lifeListModalAddress}
								address={lifeListModalAddress}
								isOpen={Boolean(lifeListModalAddress)}
								onToggle={() => setLifeListModalAddress(null)} />
						}
					</Col>
				</Row>
			</Container>
		</div>
	);

};

export default Leaderboard;
