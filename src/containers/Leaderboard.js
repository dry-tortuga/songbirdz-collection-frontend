import React, { Suspense, useState, lazy } from "react";
import {
	Col,
	Container,
	Row,
	Tab,
	Tabs,
} from "react-bootstrap";

const LeaderboardTabSeason1 = lazy(() => import("../components/LeaderboardTabSeason1"));
const LeaderboardTabSeason2 = lazy(() => import("../components/LeaderboardTabSeason2"));
const LeaderboardTabSeason3 = lazy(() => import("../components/LeaderboardTabSeason3"));
const LeaderboardTabSeason4 = lazy(() => import("../components/LeaderboardTabSeason4"));
const LeaderboardTabSeason5 = lazy(() => import("../components/LeaderboardTabSeason5"));
const LeaderboardTabSeason6 = lazy(() => import("../components/LeaderboardTabSeason6"));
const LeaderboardTabSeason7 = lazy(() => import("../components/LeaderboardTabSeason7"));
const LeaderboardTabSpeciesRanks = lazy(() => import("../components/LeaderboardTabSpeciesRanks"));
const LeaderboardTabDailyStreakActive = lazy(() => import("../components/LeaderboardTabDailyStreakActive"));
const LifeListModal = lazy(() => import("../components/LifeListModal"));

const TAB_SEASON_1 = "season-1";
const TAB_SEASON_2 = "season-2";
const TAB_SEASON_3 = "season-3";
const TAB_SEASON_4 = "season-4";
const TAB_SEASON_5 = "season-5";
const TAB_SEASON_6 = "season-6";
const TAB_SEASON_7 = "season-7";
const TAB_LIFE_LIST_SPECIES_RANKS = "life-list-species-ranks";
const TAB_DAILY_STREAK_ACTIVE = "daily-streak-active";

const Leaderboard = () => {

	const [activeTab, setActiveTab] = useState(TAB_SEASON_7);
	const [lifeListModalAddress, setLifeListModalAddress] = useState(null);

	return (
		<div
			id="leaderboard-page"
			className="leaderboard-page">
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
				<Tabs
					id="leaderboard-tabs"
					className="mb-3"
					activeKey={activeTab}
					onSelect={setActiveTab}>
					<Tab
						eventKey={TAB_SEASON_7}
						title="Season 7 (Active)">
						{activeTab === TAB_SEASON_7 &&
							<Suspense fallback={<div />}>
								<LeaderboardTabSeason7 onUserClick={setLifeListModalAddress} />
							</Suspense>
						}
					</Tab>
					<Tab
						eventKey={TAB_LIFE_LIST_SPECIES_RANKS}
						title="Species (Active)">
						{activeTab === TAB_LIFE_LIST_SPECIES_RANKS &&
							<Suspense fallback={<div />}>
								<LeaderboardTabSpeciesRanks onUserClick={setLifeListModalAddress} />
							</Suspense>
						}
					</Tab>
					<Tab
						eventKey={TAB_DAILY_STREAK_ACTIVE}
						title="Daily Streak (Active)">
						{activeTab === TAB_DAILY_STREAK_ACTIVE &&
							<Suspense fallback={<div />}>
								<LeaderboardTabDailyStreakActive onUserClick={setLifeListModalAddress} />
							</Suspense>
						}
					</Tab>
					<Tab
						eventKey={TAB_SEASON_6}
						title="Season 6">
						{activeTab === TAB_SEASON_6 &&
							<Suspense fallback={<div />}>
								<LeaderboardTabSeason6 onUserClick={setLifeListModalAddress} />
							</Suspense>
						}
					</Tab>
					<Tab
						eventKey={TAB_SEASON_5}
						title="Season 5">
						{activeTab === TAB_SEASON_5 &&
							<Suspense fallback={<div />}>
								<LeaderboardTabSeason5 onUserClick={setLifeListModalAddress} />
							</Suspense>
						}
					</Tab>
					<Tab
						eventKey={TAB_SEASON_4}
						title="Season 4">
						{activeTab === TAB_SEASON_4 &&
							<Suspense fallback={<div />}>
								<LeaderboardTabSeason4 onUserClick={setLifeListModalAddress} />
							</Suspense>
						}
					</Tab>
					<Tab
						eventKey={TAB_SEASON_3}
						title="Season 3">
						{activeTab === TAB_SEASON_3 &&
							<Suspense fallback={<div />}>
								<LeaderboardTabSeason3 onUserClick={setLifeListModalAddress} />
							</Suspense>
						}
					</Tab>
					<Tab
						eventKey={TAB_SEASON_2}
						title="Season 2">
						{activeTab === TAB_SEASON_2 &&
							<Suspense fallback={<div />}>
								<LeaderboardTabSeason2 onUserClick={setLifeListModalAddress} />
							</Suspense>
						}
					</Tab>
					<Tab
						eventKey={TAB_SEASON_1}
						title="Season 1">
						{activeTab === TAB_SEASON_1 &&
							<Suspense fallback={<div />}>
								<LeaderboardTabSeason1 onUserClick={setLifeListModalAddress} />
							</Suspense>
						}
					</Tab>
				</Tabs>
				{Boolean(lifeListModalAddress) &&
					<Suspense fallback={<div />}>
						<LifeListModal
							key={lifeListModalAddress}
							address={lifeListModalAddress}
							isOpen
							onToggle={() => setLifeListModalAddress(null)}
						/>
					</Suspense>
				}
			</Container>
		</div>
	);
};

export default Leaderboard;
