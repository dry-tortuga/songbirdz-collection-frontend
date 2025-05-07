import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";

import { useFarcasterContext } from "../contexts/farcaster";

const About = () => {

	const { fOpenLinkToOwner } = useFarcasterContext();

    return (
        <div className="about-page">
            <Container className="mt-4">
                <Row className="mb-3">
                    <Col>
                        <h1>{"What is the Songbirdz project?"}</h1>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <p>
                            {"The Songbirdz project is bringing bird watching onchain to Base. Each species is hidden until successfully identified based on its image and song."}
                        </p>
                        <p>
                            {"This project was one of "}
                            <a
                                href="https://onchain-summer.devfolio.co/projects?prizes=0ef9ac5fb88e4ed689def5674c73d2d0&show_winners=false"
                                target="_blank"
                                rel="noopener noreferrer nofollow">
                                <b>{"11 winners"}</b>
                            </a>
                            {" chosen in the \"GAMING with thirdweb: Gaming\" category at the Onchain Summer Buildathon in June 2024."}
                        </p>
                        <p>
                            {"There will be a total of 10 flocks, each consisting of 1,000 birds, which each flock rolled out one-at-a-time and with a distinct set of species, song audio, and images. Starting with the first flock of 1,000 (i.e. the Picasso Genesis flock), and ending once we've reached 10,000 total birds in the wild. The next flock of 1,000 birds won't be released until all birds in the previous flock have been successfully identified. Future flocks will introduce new species of birds, with input from the community."}
                        </p>
                        <p>
                            {"Curated by a life-long birder, using images from "}
                            <a
                                href="https://openai.com/dall-e-3"
                                target="_blank"
                                rel="noopener noreferrer nofollow">
                                <b>{"DALL·E 3"}</b>
                            </a>
                            {" and audio from "}
                            <a
                                href="https://www.macaulaylibrary.org/guide-to-bird-sounds"
                                target="_blank"
                                rel="noopener noreferrer nofollow">
                                <b>
                                    {"The Cornell Guide to Bird Sounds: United States and Canada (v2021)"}
                                </b>
                            </a>
                            {"."}
                        </p>
                        <p>
                            {"The contract uses merkle trees to store onchain hashes of the species names, images, and song audio for each flock in the collection. Once all 10,000 in the wild have been identified this data will be uploaded to ipfs. The back-end web server will be shut down in favor of a 2nd smart contract to manage the points system and life list. The long-term goal for this project is to be a community-driven ecosystem for bird enthusiasts, fostering a deeper connection with nature and promoting conservation efforts, while also providing a platform for users to engage with and learn about birds (and web3) in a fun and interactive way."}
                        </p>
                        <p>
                            {"The smart contract governing the NFTs, the back-end code for the web server, and the front-end code for the web application are all open-source (MIT License). The images (and species metadata) associated with each NFT in the collection is released under the Creative Commons Zero (CC0) license, granting users freedom to use, remix, and share the artworks without any restrictions. "}
                            <b>{"NOTE:"}</b>
                            {" If you wish to use the audio mp3 files in your own project, you must purchase them for $20.00 from \"The Cornell Guide to Bird Sounds: United States and Canada (v2021)\". See link above."}
                        </p>
                        <p>
                            {"As a new onchain developer and an avid appreciator of birds, I hope you find this project interesting, useful, and enjoyable. I invite you to join the community and contribute to the project. Thank you!"}
                        </p>
                        <h2>{"Flocks in the Wild"}</h2>
                        <ul style={{ listStyle: "disc" }}>
                            <li>
                                <a
                                    href="https://songbirdz.cc/collection?number=0"
                                    target="_blank"
                                    rel="noopener noreferrer nofollow">
                                    <b>{"Picasso Genesis:"}</b>
                                </a>
                                <span className="ms-1">
                                    {"SOLD OUT: The 1st flock of 1,000 birds in the Songbirdz collection (0-999). Features 200 new species, with exactly 5 birds of each species."}
                                </span>
                            </li>
                            <li>
                                <a
                                    href="https://songbirdz.cc/collection?number=1"
                                    target="_blank"
                                    rel="noopener noreferrer nofollow">
                                    <b>{"Deep Blue:"}</b>
                                </a>
                                <span className="ms-1">
                                    {"SOLD OUT:  The 2nd flock of 1,000 birds in the Songbirdz collection (1000-1999). Features 50 new species, with various amounts of birds per species of either 1, 5, 10, 20, 30 or 50. Includes 5 \"1 of 1\" birds that are the only one of their species! This flock of birds live and breath all things water day in and day out, they make their home on the rivers, streams, ponds, lakes, and oceans near you."}
                                </span>
                            </li>
                            <li>
                                <a
                                    href="https://songbirdz.cc/collection?number=2&hide_already_identified=true"
                                    target="_blank"
                                    rel="noopener noreferrer nofollow">
                                    <b>{"Small & Mighty:"}</b>
                                </a>
                                <span className="ms-1">
                                    {"NOW MINTING:  The 3rd flock of 1,000 birds in the Songbirdz collection (2000-2999). Features 50 new species, with various amounts of birds per species of either 1, 5, 10, 20, 30 or 50. Includes 5 \"1 of 1\" birds that are the only one of their species! This flock of birds are some of the tiniest in the avian world, with most having wing spans < 30cm, but they sing the most quintessential songs you'll hear in the wild."}
                                </span>
                            </li>
                            <li>
                                <a
                                    href="https://songbirdz.cc/collection?number=3&hide_already_identified=true"
                                    target="_blank"
                                    rel="noopener noreferrer nofollow">
                                    <b>{"Night & Day:"}</b>
                                </a>
                                <span className="ms-1">
                                    {"NOW MINTING:  The 4th flock of 1,000 birds in the Songbirdz collection (3000-3999). Features 50 new species, with various amounts of birds per species of either 1, 5, 10, 20, 30 or 50. Includes 4 \"1 of 1\" birds that are the only one of their species! This flock features some of our most mysterious and intriguing birds. Discover the birds that rule the night and those who break the silence at dawn. As the seasons change and the nights grow longer, there’s still plenty of them out there waiting to be seen."}
                                </span>
                            </li>
                            <li>
                                <a
                                    href="https://songbirdz.cc/collection?number=4&hide_already_identified=true"
                                    target="_blank"
                                    rel="noopener noreferrer nofollow">
                                    <b>{"Fire & Ice:"}</b>
                                </a>
                                <span className="ms-1">
                                    {"NOW MINTING:  The 5th flock of 1,000 birds in the Songbirdz collection (4000-4999). Features 50 new species, with various amounts of birds per species of either 1, 5, 10, 20, 30 or 50. Includes 4 \"1 of 1\" birds that are the only one of their species! This flock features birds that don’t just survive brutal conditions — they thrive in them, even without air conditioning, parkas, or winter hats. In the coldest nights of winter and the harshest heat of summer, no matter the conditions, they adapt to their environment."}
                                </span>
                            </li>
                            <li>
                                <a
                                    href="https://songbirdz.cc/collection?number=5&hide_already_identified=true"
                                    target="_blank"
                                    rel="noopener noreferrer nofollow">
                                    <b>{"Predator & Prey:"}</b>
                                </a>
                                <span className="ms-1">
                                    {"NOW MINTING:  The 6th flock of 1,000 birds in the Songbirdz collection (5000-5999). Features 50 new species, with various amounts of birds per species of either 1, 5, 10, 20, 25, 30, etc. Includes 4 \"1 of 1\" birds that are the only one of their species! This flock features birds at the top of the food chain and also those in the bottom. It's about the eternal dance of survival and the constant fight to stay alive for both predator and prey. The hunter and the hunted."}
                                </span>
                            </li>
                            <li>
                                <a
                                    href="https://songbirdz.cc/collection?number=6&hide_already_identified=true"
                                    target="_blank"
                                    rel="noopener noreferrer nofollow">
                                    <b>{"Lovebirds:"}</b>
                                </a>
                                <span className="ms-1">
                                    {"NOW MINTING:  The 7th flock of 1,000 birds in the Songbirdz collection (6000-6999). Features 50 new species, with various amounts of birds per species of either 1, 5, 10, 20, 30, 50 etc. Includes 4 \"1 of 1\" birds that are the only one of their species! This flock is in tribute to your partner in crime, bff, ride or die, main squeeze, better-half, whatever you want to call it... life is just better surrounded by the people you love."}
                                </span>
                            </li>
                            <li>
                                <a
                                    href="https://songbirdz.cc/collection?number=7&hide_already_identified=true"
                                    target="_blank"
                                    rel="noopener noreferrer nofollow">
                                    <b>{"Hatchlings:"}</b>
                                </a>
                                <span className="ms-1">
                                    {"NOW MINTING:  The 8th flock of 1,000 birds in the Songbirdz collection (7000-7999). Features 50 new species, with various amounts of birds per species of either 1, 5, 10, 20, 30, 50 etc. Includes 4 \"1 of 1\" birds that are the only one of their species! This flock celebrates birds that symbolize rebirth, new beginnings, and the beauty of eggs. From those with striking egg-like plumage to famous nest-builders, it highlights the wonders of avian reproduction and the spirit of springtime."}
                                </span>
                            </li>
                        </ul>
                        <h2>{"Royalties: 1%"}</h2>
                        <ul style={{ listStyle: "disc" }}>
                            <li>
                                <span className="ms-1">
                                    {"While the 10k collection is still minting, 100% of the royalties will be donated to charities via "}
                                </span>
                                <a
                                    href="https://endaoment.org/"
                                    target="_blank"
                                    rel="noopener noreferrer nofollow">
                                    <b>{"Endaoment"}</b>
                                </a>
                                {"."}
                            </li>
                            <li>
                                <span className="ms-1">
                                    {"Once the 10k collection is fully minted, 50% of the royalties will be donated to charities via "}
                                </span>
                                <a
                                    href="https://endaoment.org/"
                                    target="_blank"
                                    rel="noopener noreferrer nofollow">
                                    <b>{"Endaoment"}</b>
                                </a>
                                {" and 50% will go to the project creators."}
                            </li>
                        </ul>
                        <h2>{"Resources"}</h2>
                        <ul style={{ listStyle: "disc" }}>
                            <li>
                                <a
                                    href="https://twitter.com/songbirdz_cc"
                                    target="_blank"
                                    rel="noopener noreferrer nofollow">
                                    <b>{"Twitter"}</b>
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://t.me/songbirdz_cc"
                                    target="_blank"
                                    rel="noopener noreferrer nofollow">
                                    <b>{"Telegram"}</b>
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://x.com/BitHomepage/status/1844090067876548734"
                                    target="_blank"
                                    rel="noopener noreferrer nofollow">
                                    <b>{"AMA #1 (10/09/2024)"}</b>
                                </a>
                            </li>
                            <li>
                                <Link  to="/sounds-of-summer-2024">
                                    <b>{"Sounds of Summer (Free Mint)"}</b>
                                </Link>
                            </li>
                            <li>
                                <a
                                    href="https://basescan.org/address/0x7C3B795e2174C5E0C4F7d563A2FB34F024C8390B"
                                    target="_blank"
                                    rel="noopener noreferrer nofollow"
                                    style={{
                                        wordBreak: "break-word",
                                        wordWrap: "break-word",
                                    }}>
                                    <b>{"Deployed Contract on Base - 0x7C3B795e2174C5E0C4F7d563A2FB34F024C8390B"}</b>
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://github.com/dry-tortuga/songbirdz-collection-backend/blob/main/contracts/SongBirdz.sol"
                                    target="_blank"
                                    rel="noopener noreferrer nofollow">
                                    <b>{"Solidity Contract"}</b>
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://github.com/dry-tortuga/songbirdz-collection-backend"
                                    target="_blank"
                                    rel="noopener noreferrer nofollow">
                                    <b>{"Back-End Server"}</b>
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://github.com/dry-tortuga/songbirdz-collection-frontend"
                                    target="_blank"
                                    rel="noopener noreferrer nofollow">
                                    <b>{"Front-End Application"}</b>
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://github.com/dry-tortuga/songbirdz-collection-media"
                                    target="_blank"
                                    rel="noopener noreferrer nofollow">
                                    <b>{"Media & Metadata"}</b>
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://www.redbubble.com/people/drytortuga/shop"
                                    target="_blank"
                                    rel="noopener noreferrer nofollow">
                                    <b>{"Songbirdz Merch"}</b>
                                </a>
                            </li>
                        </ul>
                        <h1 className="mb-3">{"The Aviary"}</h1>
                        <div
	                        style={{
	                            display: "flex",
	                            flexDirection: "row",
	                            gap: "2rem",
								flexWrap: "wrap",
	                        }}>
                            <div
	                            style={{
		                            display: "flex",
		                            flexDirection: "column",
		                            alignItems: "center",
		                            marginBottom: "1.5rem"
	                            }}>
                                <img
                                    src="https://songbirdz.cc/images/2-lg.jpg"
                                    className="rounded mb-2"
                                    title="Red-winged Blackbird"
                                    style={{ width: "150px", height: "150px", objectFit: "cover" }} />
                                <h3 style={{ margin: "0.25rem 0" }}>
                                    {"Dry Tortuga"}
                                </h3>
                                <p style={{ margin: "0 0 0.5rem 0", fontStyle: "italic" }}>
                                    {"Chief Bird Officer"}
                                </p>
                                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                    <a
                                        href="https://x.com/dry_tortuga"
                                        target="_blank"
                                        rel="noopener noreferrer nofollow">
                                        <b>{"X"}</b>
                                    </a>
                                    <span>|</span>
									<a
										href="https://warpcast.com/dry-tortuga"
										target="_blank"
										rel="noopener noreferrer nofollow"
										onClick={fOpenLinkToOwner}>
										<b>{"Farcaster"}</b>
									</a>
                                </div>
                            </div>
                            <div
                            	style={{
                             		display: "flex",
                               		flexDirection: "column",
									alignItems: "center",
									marginBottom: "1.5rem"
                             	}}>
                                <img
                                    src="https://songbirdz.cc/images/1077-lg.jpg"
                                    className="rounded mb-2"
                                    title="King Eider (1 of 1)"
                                    style={{ width: "150px", height: "150px", objectFit: "cover" }} />
                                <h3 style={{ margin: "0.25rem 0" }}>
                                	{"Paesan"}
                                </h3>
                                <p style={{ margin: "0 0 0.5rem 0", fontStyle: "italic" }}>
                                	{"Community Spotter"}
                                </p>
                                <div style={{ display: "flex", alignItems: "center" }}>
                                    <a
                                        href="https://x.com/paesan5"
                                        target="_blank"
                                        rel="noopener noreferrer nofollow">
                                        <b>{"X"}</b>
                                    </a>
                                </div>
                            </div>
                            <div
                            	style={{
                             		display: "flex",
                               		flexDirection: "column",
									alignItems: "center",
									marginBottom: "1.5rem"
                             	}}>
                                <img
                                    src="https://songbirdz.cc/images/5660-lg.jpg"
                                    className="rounded mb-2"
                                    title="Violet-crowned Hummingbird (1 of 1)"
                                    style={{ width: "150px", height: "150px", objectFit: "cover" }} />
                                <h3 style={{ margin: "0.25rem 0" }}>
                                	{"Arcturus"}
                                </h3>
                                <p style={{ margin: "0 0 0.5rem 0", fontStyle: "italic" }}>
                                	{"Community Spotter"}
                                </p>
                                <div style={{ display: "flex", alignItems: "center" }}>
                                    <a
                                        href="https://x.com/Arcturus_TA"
                                        target="_blank"
                                        rel="noopener noreferrer nofollow">
                                        <b>{"X"}</b>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );

};

export default About;
