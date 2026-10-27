import React, { Suspense, lazy } from "react";
import { Col, Container, Row, Tab, Tabs } from "react-bootstrap";
import { useSearchParams } from "react-router-dom";

import { ARCHIVE_SEASONS, LATEST_ARCHIVE_SEASON } from "../constants/seasons";

import "./Leaderboard.css";

const LeaderboardTabLifeList = lazy(() => import("../components/LeaderboardTabLifeList"));
const LeaderboardTabDailyStreakActive = lazy(() => import("../components/LeaderboardTabDailyStreakActive"));
const LeaderboardTabHallOfFame = lazy(() => import("../components/LeaderboardTabHallOfFame"));

const TAB_LIFE_LIST = "life-list";
const TAB_DAILY_STREAK = "daily-streak";
const TAB_HALL_OF_FAME = "hall-of-fame";

const TABS = [TAB_LIFE_LIST, TAB_DAILY_STREAK, TAB_HALL_OF_FAME];

// The active tab and archived season live in the URL (?tab=hall-of-fame&season=3) so they can be shared
const Leaderboard = () => {

	const [params, setParams] = useSearchParams();

	const requestedTab = params.get("tab");
	const activeTab = TABS.includes(requestedTab) ? requestedTab : TAB_LIFE_LIST;

	const requestedSeason = parseInt(params.get("season"), 10);
	const seasonId = ARCHIVE_SEASONS.some((season) => season.id === requestedSeason)
		? requestedSeason
		: LATEST_ARCHIVE_SEASON;

	const handleSelectTab = (key) => {
		setParams(key === TAB_LIFE_LIST ? {} : { tab: key });
	};

	const handleSeasonChange = (id) => {
		setParams({ tab: TAB_HALL_OF_FAME, season: String(id) });
	};

	return (
		<div id="leaderboard-page" className="leaderboard-page">
			<Container className="mt-4">
				<Row className="mb-3">
					<Col>
						<h1>{"Leaderboard"}</h1>
					</Col>
				</Row>
				<Tabs
					id="leaderboard-tabs"
					className="mb-3"
					activeKey={activeTab}
					onSelect={handleSelectTab}>
					<Tab eventKey={TAB_LIFE_LIST} title="Life List">
						{activeTab === TAB_LIFE_LIST &&
							<Suspense fallback={<div />}>
								<LeaderboardTabLifeList />
							</Suspense>
						}
					</Tab>
					<Tab eventKey={TAB_DAILY_STREAK} title="Daily Streak">
						{activeTab === TAB_DAILY_STREAK &&
							<Suspense fallback={<div />}>
								<LeaderboardTabDailyStreakActive />
							</Suspense>
						}
					</Tab>
					<Tab eventKey={TAB_HALL_OF_FAME} title="Hall of Fame">
						{activeTab === TAB_HALL_OF_FAME &&
							<Suspense fallback={<div />}>
								<LeaderboardTabHallOfFame
									seasonId={seasonId}
									onSeasonChange={handleSeasonChange} />
							</Suspense>
						}
					</Tab>
				</Tabs>
			</Container>
		</div>
	);

};

export default Leaderboard;
