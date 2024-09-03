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

import LeaderboardTable from "../components/LeaderboardTable";
import LifeListModal from "../components/LifeListModal";

import useLeaderboard from "../hooks/useLeaderboard";

const Leaderboard = () => {

	const context = useWalletContext();

	const [season, setSeason] = useState(1);

	// Get the list of users in the top 50
	const { data, setData } = useLeaderboard({ season });

	const [lifeListModalAddress, setLifeListModalAddress] = useState(null);

	const handleChangeSeason = (newValue) => {

		setSeason(newValue);
		setData(null);

	};

	console.debug("-------------- Leaderboard -----------");
	console.debug(data);
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
					id="leaderboard-season-tabs"
					className="mb-3"
					activeKey={season}
					onSelect={handleChangeSeason}>
					<Tab
						eventKey={1}
						title="Season 1">
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
											{"Now, we all know onchain has no geographic limits, so we'll recreate this competition using the 300 different species of birds in the Songbirdz collection that are out in the wild right now on Base."}
										</p>
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
									</Col>
								</Row>
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
											{"The 10 accounts with the most Birder Points at the end of Onchain Summer received 1 free airdrop from each of the 9 remaining flocks in the Songbirdz collection, i.e. 9 birds each!"}
										</p>
										<p>
											{"In addition to the airdrops, there could always be additional prizes in the future but this competition is mostly just for fun. Not financial advice. DYOR :)"}
										</p>
									</Col>
								</Row>
							</>
						}
					</Tab>
					<Tab
						eventKey={2}
						title="Season 2 - Live">
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
											{"Now, we all know onchain has no geographic limits, so we'll recreate this competition using the 300 different species of birds in the Songbirdz collection that are out in the wild right now on Base."}
										</p>
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
									</Col>
								</Row>
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
											{"The 10 accounts with the most Birder Points at the end of Onchain Fall will receive 1 free airdrop from each of the remaining 7 flocks in the Songbirdz collection, i.e. 7 birds each!"}
										</p>
										<p>
											{"In addition to the airdrops, there could always be additional prizes in the future but this competition is mostly just for fun. Not financial advice. DYOR :)"}
										</p>
									</Col>
								</Row>
							</>
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
