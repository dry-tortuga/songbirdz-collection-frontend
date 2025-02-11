import React, { Suspense, useState, lazy } from "react";
import {
    Col,
    Container,
    Row,
    Tab,
    Tabs,
} from "react-bootstrap";

const DailyStreakActiveResults = lazy(() => import("../components/DailyStreakActiveResults"));
const LeaderboardTabSeason1 = lazy(() => import("../components/LeaderboardTabSeason1"));
const LeaderboardTabSeason2 = lazy(() => import("../components/LeaderboardTabSeason2"));
const LeaderboardTabSeason3 = lazy(() => import("../components/LeaderboardTabSeason3"));
const LifeListModal = lazy(() => import("../components/LifeListModal"));

const TAB_SEASON_1 = "season-1";
const TAB_SEASON_2 = "season-2";
const TAB_SEASON_3 = "season-3";
const TAB_DAILY_STREAK_ACTIVE = "daily-streak-active";

const Leaderboard = () => {

    const [activeTab, setActiveTab] = useState(TAB_SEASON_3);
    const [lifeListModalAddress, setLifeListModalAddress] = useState(null);

    return (
        <div
            id="leaderboard-page"
            className="leaderboard-page">
            <Container className="mt-4">
                <Row className="mb-3">
                    <Col>
                        <h1 className="d-flex align-items-center">
                            <span className="me-auto">{"Leaderboard"}</span>
                        </h1>
                    </Col>
                </Row>
                <Tabs
                    id="leaderboard-tabs"
                    className="mb-3"
                    activeKey={activeTab}
                    onSelect={setActiveTab}>
                    <Tab eventKey={TAB_SEASON_1} title="Season 1">
                        {activeTab === TAB_SEASON_1 &&
                            <Suspense fallback={<div />}>
                                <LeaderboardTabSeason1 onUserClick={setLifeListModalAddress} />
                            </Suspense>
                        }
                    </Tab>
                    <Tab eventKey={TAB_SEASON_2} title="Season 2">
                        {activeTab === TAB_SEASON_2 &&
                            <Suspense fallback={<div />}>
                                <LeaderboardTabSeason2 onUserClick={setLifeListModalAddress} />
                            </Suspense>
                        }
                    </Tab>
                    <Tab eventKey={TAB_SEASON_3} title="Season 3 (Active)">
                        {activeTab === TAB_SEASON_3 &&
                            <Suspense fallback={<div />}>
                                <LeaderboardTabSeason3 onUserClick={setLifeListModalAddress} />
                            </Suspense>
                        }
                    </Tab>
                    <Tab eventKey={TAB_DAILY_STREAK_ACTIVE} title="Daily Streak (Active)">
                        {activeTab === TAB_DAILY_STREAK_ACTIVE &&
                            <Suspense fallback={<div />}>
                                <DailyStreakActiveResults />
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
