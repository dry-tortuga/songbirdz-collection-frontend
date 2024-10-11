import React, { useCallback, useState } from "react";
import {
	Badge,
	Button,
	Col,
	Container,
	Modal,
	Row,
	Tab,
	Tabs,
} from "react-bootstrap";

import { useWalletContext } from "../contexts/wallet";

import DailyStreakActiveResults from "../components/DailyStreakActiveResults";
import LeaderboardTable from "../components/LeaderboardTable";
import LifeListModal from "../components/LifeListModal";

import useLeaderboard from "../hooks/useLeaderboard";

const TAB_SEASON_1 = "season-1";
const TAB_SEASON_2 = "season-2";
const TAB_DAILY_STREAK_ACTIVE = "daily-streak-active";

const Leaderboard = () => {

	const context = useWalletContext();

	const [activeTab, setActiveTab] = useState(TAB_SEASON_2);

	let season = -1;

	if (activeTab === TAB_SEASON_1) {
		season = 1;
	} else if (activeTab === TAB_SEASON_2) {
		season = 2;
	}

	// Get the list of users in the top 50
	const { data, setData } = useLeaderboard({
		account: context.account,
		season,
	});

	const [lifeListModalAddress, setLifeListModalAddress] = useState(null);

	const handleChangeActiveTab = (newValue) => {

		// Reset the data from the leaderboard (if needed)
		if (activeTab === TAB_SEASON_1 || activeTab === TAB_SEASON_2) {
			setData(null);
		}

		setActiveTab(newValue);

	};

	console.debug("-------------- Leaderboard -----------");
	console.debug(data);
	console.debug(`season=${season}`);
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
				<Tabs
					id="leaderboard-tabs"
					className="mb-3"
					activeKey={activeTab}
					onSelect={handleChangeActiveTab}>
					<Tab
						eventKey={TAB_SEASON_1}
						title="Season 1">
						{activeTab === TAB_SEASON_1 &&
							<>
								<Row className="mb-4">
									<Col>
										{!data &&
											<i className="fa-solid fa-spinner fa-spin fa-xl me-2" />
										}
										{data?.users &&
											<>
												<LeaderboardTable
													users={data.users}
													onUserClick={setLifeListModalAddress} />
												<div className="text-center">
													{data.timestampMessage}
												</div>
											</>
										}
									</Col>
								</Row>
								{data?.users &&
									<>
										<Row className="mb-3">
											<Col>
												<h2 className="d-flex align-items-center">
													<span className="me-auto">
														{"Big Onchain Summer - Season 1"}
													</span>
												</h2>
											</Col>
										</Row>
										<Row>
											<Col>
												<p>
													{"Ran from the Songbirdz genesis date (i.e. April 4th, 2024) to the last day of Onchain Summer on Base (i.e. August 31st, 2024 at UTC 23:00:00)."}
												</p>
												<p>
													{"Accounts with the most Birder Points received:"}
												</p>
												<ul style={{ listStyle: 'disc' }}>
													<li>
														<strong>{"Top 10 -> "}</strong>
														{"1 airdrop from each of the remaining 9 flocks in the Songbirdz collection, i.e. 9 birds each!"}
													</li>
													<li>
														<strong>{"Top 10 -> "}</strong>
														{"0.339975 ETH split amongst the top 10"}
													</li>
													<li>
														<strong>{"Top 10 -> "}</strong>
														{"1325 "}
														<a
															href="https://x.com/toastonbase"
															target="_blank"
															rel="noopener noreferrer nofollow">
															{"TOAST"}
														</a>
													</li>
													<li>
														<strong>{"Top 10 -> "}</strong>
														{"5 pack of Paint Cartridges from "}
														<a
															href="https://dot.fan"
															target="_blank"
															rel="noopener noreferrer nofollow">
															{"dot.fan"}
														</a>
													</li>
													<li>
														<strong>{"Top 10 -> "}</strong>
														{"1000 KIBBLE from "}
														<a
															href="https://cat.town"
															target="_blank"
															rel="noopener noreferrer nofollow">
															{"cat.town"}
														</a>
													</li>
												</ul>
												<p>
													{"This competition was mostly just for fun. Not financial advice. DYOR :)"}
												</p>
											</Col>
										</Row>
									</>
								}
							</>
						}
					</Tab>
					<Tab
						eventKey={TAB_SEASON_2}
						title="Season 2 - Live">
						{activeTab === TAB_SEASON_2 &&
							<>
								<Row className="mb-4">
									<Col>
										{!data &&
											<i className="fa-solid fa-spinner fa-spin fa-xl me-2" />
										}
										{data?.users &&
											<>
												<LeaderboardTable
													users={data.users}
													onUserClick={setLifeListModalAddress} />
												<div className="text-center">
													{data.timestampMessage}
												</div>
											</>
										}
									</Col>
								</Row>
								{data?.users &&
									<>
										<Row className="mb-3">
											<Col>
												<h2 className="d-flex align-items-center">
													<span className="me-auto">
														{"Big Onchain Fall - Season 2"}
													</span>
												</h2>
											</Col>
										</Row>
										<Row>
											<Col>
												<p>
													{"Runs from September 1st, 2024 04:00:00 UTC to November 30th, 2024 at 23:00:00 UTC."}
												</p>
												<p>
													{"Accounts with the most Birder Points at the end of Onchain Fall will receive:"}
												</p>
												<ul style={{ listStyle: 'disc' }}>
													<li>
														<strong>{"Top 10 -> "}</strong>
														{"1 airdrop from each of the remaining 7 flocks in the Songbirdz collection, i.e. 7 birds each!"}
													</li>
													<li>
														<strong>{"Top 5 -> "}</strong>
														{"$10 worth of "}
														<a
															href="https://x.com/basedpeplo"
															target="_blank"
															rel="noopener noreferrer nofollow">
															{"PEPLO"}
														</a>
													</li>
												</ul>
												<p>
													{"In addition to these, there could always be additional prizes in the future but this competition is mostly just for fun. Not financial advice. DYOR :)"}
												</p>
											</Col>
										</Row>
										<Row className="mb-3">
											<Col>
												<h2 className="d-flex align-items-center">
													<span className="me-auto">
														{"How do I earn Birder Points?"}
													</span>
												</h2>
											</Col>
										</Row>
										<Row className="mb-3">
											<Col>
												<p>
													{"In birder lingo, a "}
													<a
														href="https://en.wikipedia.org/wiki/Big_year"
														target="_blank"
														rel="noopener noreferrer">
														{"Big Year"}
													</a>
													{" is a competition among birders to identify as many species of birds as possible by sight/sound, within a single calendar year and specific geographic area. The North American Big Year record is 840 species, set by John Weigel in 2019!"}
												</p>
												<p>
													{"Now, we all know onchain has no geographic limits, so we'll recreate this competition using the 350 different species of birds in the Songbirdz collection that are out in the wild right now on Base."}
												</p>
												<h3>
													{"1. Onchain Bird Watching"}
												</h3>
												<p>
													{"For each "}<strong>{"unique species"}</strong>{" of bird that you add to your "}
													<a
														href="https://en.wikipedia.org/wiki/Life_list"
														target="_blank"
														rel="noopener noreferrer">
														{"Life List"}
													</a>
													{", you will earn a corresponding amount of Birder Points:"}
												</p>
												<ul style={{ listStyle: 'disc' }}>
													<li>
														<b>{"10 points:"}</b>
														{" Identify a new species in the wild (i.e. minting for 0.0015 ETH)"}
													</li>
													<li>
														<b>{"3 points:"}</b>
														{" Purchase a new species for sale on "}
														<a
															href="https://opensea.io/collection/songbirdz"
															target="_blank"
															rel="noopener noreferrer">
															{"OpenSea"}
														</a>
														{" above the minting price of 0.0015 ETH"}
													</li>
													<li>
														<b>{"1 point:"}</b>
														{" Receive a new species via an "}
														<a
															href="https://erc721.org/"
															target="_blank"
															rel="noopener noreferrer">
															{"ERC-721"}
														</a>
														{" transfer for any other reason or action (i.e. an airdrop, purchase on OpenSea < 0.0015 ETH, gift from a friend, etc.)"}
													</li>
												</ul>
												<p>
													{"For each "}<strong>{"unique species"}</strong>{" in your Life List you will earn points from the action which is worth the most amount of points."}
												</p>
												<p>
													{"Example #1: if you receive a Bald Eagle as an airdrop, go out and identify a second Bald Eagle in the wild, and then purchase a third Bald Eagle on OpenSea... you would only earn 10 Birder Points... not 14."}
												</p>
												<p>
													{"Example #2: if you identify (i.e. mint) 3 birds of the same species (i.e. 3 Bald Eagles)... you would only earn 10 Birder Points... not 30."}
												</p>
												<h3>
													{"2. Other Ways to Earn Birder Points"}
												</h3>
												<p>
													{"In addition to the game above, you can also earn points and help support the project by:"}
												</p>
												<ul style={{ listStyle: 'disc' }}>
													<li>
														<b>{"25 points (X Campaign):"}</b>
														{" Share a bird that you own on X and tell us, in your own words, why you think the Songbirdz project is interesting!"}
														<ul style={{ listStyle: 'disc' }}>
															<li>{"You must follow & tag "}
																<a
																	href="https://x.com/dry_tortuga"
																	target="_blank"
																	rel="noopener noreferrer">
																	{"@dry_tortuga"}
																</a>
															</li>
															<li>{"You must follow & tag "}
																<a
																	href="https://x.com/songbirdz_cc"
																	target="_blank"
																	rel="noopener noreferrer">
																	{"@songbirdz_cc"}
																</a>
															</li>
															<li>
																{"Include the image/link for the bird on OpenSea, Magic Eden, etc"}
															</li>
															<li>
																{"Include a link to https://songbirdz.cc"}
															</li>
															<li>
																<a
																	href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Love the @songbirdz_cc collection on @base!\n\nYOUR OWN WORDS HERE\n\nTry onchain bird watching today at https://songbirdz.cc/collection?hide_already_identified=true\n\n`)}`}
																	className="twitter-share-button"
																	data-show-count="false"
																	data-size="large"
																	data-hashtags="basedbirds"
																	data-via="songbirdz"
																	data-url={'https://songbirdz.cc/collection?hide_already_identified=true'}>
																	{"Share on X"}
																</a>
															</li>
														</ul>
													</li>
													<li>
														<b>{"10 points (Join Telegram):"}</b>
														<a
															href="https://t.me/songbirdz_cc"
															target="_blank"
															rel="noopener noreferrer nofollow">
															{"https://t.me/songbirdz_cc"}
														</a>
													</li>
													<li>
														<b>{"10 points (Join Discord):"}</b>
														<a
															href="https://discord.gg/UKGgRsJXzr"
															target="_blank"
															rel="noopener noreferrer nofollow">
															{"https://discord.gg/UKGgRsJXzr"}
														</a>
													</li>
												</ul>
											</Col>
										</Row>
									</>
								}
							</>
						}
					</Tab>
					<Tab
						eventKey={TAB_DAILY_STREAK_ACTIVE}
						title="Daily Streak (Active)">
						{activeTab === TAB_DAILY_STREAK_ACTIVE &&
							<Row className="mb-4">
								<Col>
									<DailyStreakActiveResults />
								</Col>
							</Row>
						}
					</Tab>
				</Tabs>
				{data?.users &&
					<LifeListModal
						key={lifeListModalAddress}
						address={lifeListModalAddress}
						isOpen={Boolean(lifeListModalAddress)}
						onToggle={() => setLifeListModalAddress(null)} />
				}
			</Container>
		</div>
	);

};

export default Leaderboard;
