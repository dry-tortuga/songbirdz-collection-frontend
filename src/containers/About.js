import React from "react";
import {
	Col,
	Container,
	Row,
} from "react-bootstrap";

const About = () => {

	return (
		<div className="about-page">
			<Container className="mt-4">
				<Row className="mb-3">
					<Col>
						<h1>
							{"What is the Songbirdz Collection?"}
						</h1>
					</Col>
				</Row>
				<Row>
					<Col>
						<p>
							{"The Songbirdz collection is bringing bird watching onchain to Base. Each species is hidden until successfully identified based on its image and song."}
						</p>
						<p>
							{"There will be a total of 10 flocks, each consisting of 1,000 birds, which each flock rolled out one-at-a-time and with a distinct set of species, song audio, and images. Starting with the first flock of 1,000 (i.e. the Picasso Genesis flock), and ending once we've reached 10,000 total birds in the wild. The next flock of 1,000 birds won't be released until all birds in the previous flock have been successfully identified. The styling of future flocks could draw inspiration from Jackson Pollock, Cubism, Popart, Art Deco, etc., and may feature different species of birds, with input from the community."}
						</p>
						<p>
							{"Curated by a life-long birder, using images from "}
							<a
								href="https://openai.com/dall-e-3"
								target="_blank"
								rel="noopener noreferrer nofollower">
								<b>
									{"DALL·E 3"}
								</b>
							</a>
							{" and audio from "}
							<a
								href="https://www.macaulaylibrary.org/guide-to-bird-sounds"
								target="_blank"
								rel="noopener noreferrer nofollower">
								<b>
									{"The Cornell Guide to Bird Sounds: United States and Canada (v2021)"}
								</b>
							</a>
							{"."}
						</p>
						<p>
							{"The contract uses merkle trees to store onchain hashes of the species names, images, and song audio for each flock in the collection. Once all 10,000 in the wild have been identified this data will be uploaded to a decentralized storage provider such as nft.storage. The contract will then be updated to permanently freeze this metadata, the back-end web server will be shut down, and there will be no more changes to this project."}
						</p>
						<p>
							{"The smart contract governing the NFTs, the back-end code for the web server, and the front-end code for the web application are all open-source (MIT License). Every NFT in the collection is released under the Creative Commons Zero (CC0) license, granting users freedom to use, remix, and share the artworks without any restrictions."}
						</p>
						<p>
							{"As a new onchain developer and an avid appreciator of birds, I hope you find this collection interesting, useful, and enjoyable. Thank you!"}
						</p>
						<h2>
							{"Resources"}
						</h2>
						<ul style={{ listStyle: 'disc' }}>
							<li>
								<a
									href="https://twitter.com/songbirdz_cc"
									target="_blank"
									rel="noopener noreferrer nofollower">
									{"Twitter"}
								</a>
							</li>
							<li>
								<a
									href="https://discord.gg/UKGgRsJXzr"
									target="_blank"
									rel="noopener noreferrer nofollower">
									{"Discord"}
								</a>
							</li>
							<li>
								<a
									href="https://basescan.org/address/0x7C3B795e2174C5E0C4F7d563A2FB34F024C8390B"
									target="_blank"
									rel="noopener noreferrer nofollower"
									style={{
										wordBreak: 'break-word',
										wordWrap: 'break-word',
									}}>
									{"Deployed Contract on Base - 0x7C3B795e2174C5E0C4F7d563A2FB34F024C8390B"}
								</a>
							</li>
							<li>
								<a
									href="https://github.com/dry-tortuga/songbirdz-collection-backend/blob/main/contracts/SongBirdz.sol"
									target="_blank"
									rel="noopener noreferrer nofollower">
									{"Solidity Contract"}
								</a>
							</li>
							<li>
								<a
									href="https://github.com/dry-tortuga/songbirdz-collection-backend"
									target="_blank"
									rel="noopener noreferrer nofollower">
									{"Back-End Server"}
								</a>
							</li>
							<li>
								<a
									href="https://github.com/dry-tortuga/songbirdz-collection-frontend"
									target="_blank"
									rel="noopener noreferrer nofollower">
									{"Front-End Application"}
								</a>
							</li>
						</ul>
						<h2>
							{"Flocks in the Wild"}
						</h2>
						<ul style={{ listStyle: 'disc' }}>
							<li>
								<a
									href="https://songbirdz.cc/collection?number=0"
									target="_blank"
									rel="noopener noreferrer nofollower">
									<b>{"Picasso Genesis:"}</b>
								</a>
								<span className="ms-1">
									{"SOLD OUT: The first flock of 1,000 birds in the Songbirdz collection (0-999). Features 200 different species, with exactly 5 birds of each species."}
								</span>
							</li>
							<li>
								<a
									href="https://songbirdz.cc/collection?number=1"
									target="_blank"
									rel="noopener noreferrer nofollower">
									<b>{"Deep Blue:"}</b>
								</a>
								<span className="ms-1">
									{"SOLD OUT:  The second flock of 1,000 birds in the Songbirdz collection (1000-1999). Features 50 different species, with various amounts of birds per species of either 1, 5, 10, 20, 30 or 50. Includes 5 \"1 of 1\" birds that are the only one of their species! This flock of birds live and breath all things water day in and day out, they make their home on the rivers, streams, ponds, lakes, and oceans near you."}
								</span>
							</li>
							<li>
								<a
									href="https://songbirdz.cc/collection?number=2"
									target="_blank"
									rel="noopener noreferrer nofollower">
									<b>{"Small & Mighty:"}</b>
								</a>
								<span className="ms-1">
									{"NOW MINTING:  The third flock of 1,000 birds in the Songbirdz collection (2000-2999). Features 50 different species, with various amounts of birds per species of either 1, 5, 10, 20, 30 or 50. Includes 5 \"1 of 1\" birds that are the only one of their species! This flock of birds are some of the tiniest in the avian world, with most having wing spans < 30cm, but they sing the most quintessential songs you'll hear in the wild."}
								</span>
							</li>
						</ul>
					</Col>
				</Row>
			</Container>
		</div>
	);

};

export default About;
