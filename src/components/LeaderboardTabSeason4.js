import React, { useEffect } from "react";
import { Col, Row } from "react-bootstrap";

import { useFarcasterContext } from "../contexts/farcaster";
import { useWalletContext } from "../contexts/wallet";

import usePointsLeaderboard from "../hooks/usePointsLeaderboard";

import LeaderboardTable from "./LeaderboardTable";

const LeaderboardTabSeason4 = ({ onUserClick }) => {

    const { account } = useWalletContext();

    const { fComposeCast, fOpenLinkToOwner } = useFarcasterContext();

    // Get the list of users in the top 50
    const { data } = usePointsLeaderboard({ account, season: 4 });

    // Re-load the twitter share button
	useEffect(() => {

		if (window.twttr?.widgets && data?.users) {

			window.twttr.widgets.load(
				document.getElementById("season-4-share-on-x-btn")
			);

		}

	}, [data]);

    return (
        <>
            <Row className="mb-4">
                <Col>
                    {!data && (
                        <i className="fa-solid fa-spinner fa-spin fa-xl me-2" />
                    )}
                    {data && (
                        <>
                            <LeaderboardTable
                                users={data}
                                onUserClick={onUserClick} />
                        </>
                    )}
                </Col>
            </Row>
            {data && (
                <>
                    <Row className="mb-3">
                        <Col>
                            <h2 className="d-flex align-items-center">
                                <span className="me-auto">
                                    {"Big Onchain Spring - Season 4"}
                                </span>
                            </h2>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
							<p>
								{"Runs from March 1st, 2025 to May 31st, 2025 (11PM UTC). Points will attempt to auto-update in real-time, but will also be manually confirmed on a bi-weekly basis. Last confirmed on May 5th, 2025 (7PM UTC)."}
							</p>
                            <p>
                                {"Accounts with the most Birder Points at the end of Season 4 will receive:"}
                            </p>
                            <ul style={{ listStyle: "disc" }}>
	                           	<li>
			                        <strong>{"Top 10 -> "}</strong>
			                        {"0.25 ETH split amongst the top 10 (% based on Birder Points)"}
			                    </li>
								<li>
		                            <strong>{"Top 10 -> "}</strong>
		                            {"1 "}
		                            <a
		                                href="https://x.com/base_colors"
		                                target="_blank"
		                                rel="noopener noreferrer nofollow">
		                                <b>{"Base Colors"}</b>
		                            </a>
		                            {" NFT each"}
		                        </li>
                           		<li>
	                                <strong>{"1st Place -> "}</strong>
	                                {"4 "}
	                                <a
	                                    href="https://www.coingecko.com/en/coins/bmx"
	                                    target="_blank"
	                                    rel="noopener noreferrer nofollow">
	                                    <b>{"BMX"}</b>
	                                </a>
	                            </li>
								<li>
	                                <strong>{"1st Place -> "}</strong>
	                                {"100,000 "}
	                                <a
	                                    href="https://dexscreener.com/base/0xf02c421e15abdf2008bb6577336b0f3d7aec98f0"
	                                    target="_blank"
	                                    rel="noopener noreferrer nofollow">
	                                    <b>{"QR"}</b>
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
                                {"Now, we all know onchain has no geographic limits, so we'll recreate this competition using the 500 different species of birds in the Songbirdz collection that are out in the wild right now on Base."}
                            </p>
                            <h3>{"1. Onchain Bird Watching"}</h3>
                            <p>
                                {"For each "}
                                <strong>{"unique species"}</strong>
                                {" of bird that you add to your "}
                                <a
                                    href="https://en.wikipedia.org/wiki/Life_list"
                                    target="_blank"
                                    rel="noopener noreferrer">
                                    {"Life List"}
                                </a>
                                {", you will earn a corresponding amount of Birder Points:"}
                            </p>
                            <ul style={{ listStyle: "disc" }}>
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
                                        rel="noopener noreferrer nofollow">
                                        <b>{"OpenSea"}</b>
                                    </a>
                                    {" or "}
                                    <a
                                        href="https://magiceden.io/collections/base/songbirdz"
                                        target="_blank"
                                        rel="noopener noreferrer nofollow">
                                        <b>{"Magic Eden"}</b>
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
                                {"For each "}
                                <strong>{"unique species"}</strong>
                                {" in your Life List you will earn points from the action which is worth the most amount of points."}
                            </p>
                            <p>
                                {"Example #1: if you receive a Bald Eagle as an airdrop, go out and identify a second Bald Eagle in the wild, and then purchase a third Bald Eagle on OpenSea... you would only earn 10 Birder Points... not 14."}
                            </p>
                            <p>
                                {"Example #2: if you identify (i.e. mint) 3 birds of the same species (i.e. 3 Bald Eagles)... you would only earn 10 Birder Points... not 30."}
                            </p>
                            <h3>{"2. Other Ways to Earn Birder Points"}</h3>
                            <p>
                                {"In addition to the game above, you can also earn points and help support the project by:"}
                            </p>
                            <ul style={{ listStyle: "disc" }}>
                                <li>
                                    <b>{"25 points (X Campaign):"}</b>
                                    {" Share a bird that you own on X and tell us, in your own words, why you think the Songbirdz project is interesting!"}
                                    <ul style={{ listStyle: "disc" }}>
                                        <li>
                                            {"You must follow "}
                                            <a
                                                href="https://x.com/dry_tortuga"
                                                target="_blank"
                                                rel="noopener noreferrer nofollow">
                                                {"@dry_tortuga"}
                                            </a>
                                        </li>
                                        <li>
                                            {"You must follow and tag "}
                                            <a
                                                href="https://x.com/songbirdz_cc"
                                                target="_blank"
                                                rel="noopener noreferrer nofollow">
                                                {"@songbirdz_cc"}
                                            </a>
                                        </li>
                                        <li>
                                            {"Please include the image for your bird and a link to https://songbirdz.cc :)"}
                                        </li>
                                        <li id="season-4-share-on-x-btn">
                                            <a
                                                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out the Songbirdz project on @base!\n\nYOUR OWN WORDS HERE\n\nJoin me and play the bird watching game at `)}`}
                                                className="twitter-share-button"
                                                data-show-count="false"
                                                data-size="large"
                                                data-hashtags="birds,birding,onchain,nfts,gaming,based"
                                                data-via="songbirdz_cc"
                                                data-url={
                                                    "https://songbirdz.cc/collection?number=6&hide_already_identified=true"
                                                }>
                                                {"Share on X"}
                                            </a>
                                        </li>
                                    </ul>
                                </li>
                                <li>
                                    <b>{"25 points (Farcaster Campaign):"}</b>
                                    {" Share a bird that you own on Farcaster and tell us, in your own words, why you think the Songbirdz project is interesting!"}
                                    <ul style={{ listStyle: "disc" }}>
                                        <li>
                                            {"You must follow and tag "}
                                            <a
                                                href="https://warpcast.com/dry-tortuga"
                                                target="_blank"
                                                rel="noopener noreferrer nofollow"
                                               	onClick={fOpenLinkToOwner}>
                                                {"@dry-tortuga"}
                                            </a>
                                        </li>
                                        <li>
                                        	{"Please include the image for your bird and a link to https://songbirdz.cc :)"}
                                        </li>
                                        <li>
                                            <a
                                                href={`https://warpcast.com/~/compose?text=${encodeURIComponent(`Check out the /songbirdz project from @dry-tortuga on @base!\n\nYOUR OWN WORDS HERE\n\n`)}&embeds[]=${encodeURIComponent('https://songbirdz.cc')}`}
                                                className="farcaster-share-button"
                                                target="_blank"
                                                rel="noopener noreferrer nofollow"
												onClick={(event) => fComposeCast(event, {
													text: `Check out the /songbirdz project from @dry-tortuga on @base!\n\nYOUR OWN WORDS HERE`,
													embeds: ['https://songbirdz.cc'],
												})}>
                                                {"Share on Farcaster :)"}
                                            </a>
                                        </li>
                                    </ul>
                                </li>
                                <li>
                                    <b>{"10 points (Join Telegram): "}</b>
                                    <a
                                        href="https://t.me/songbirdz_cc"
                                        target="_blank"
                                        rel="noopener noreferrer nofollow">
                                        {"https://t.me/songbirdz_cc"}
                                    </a>
                                </li>
                                <li>
                                    <b>{"10 points (Join Farcaster Channel): "}</b>
                                    <a
                                        href="https://warpcast.com/~/channel/songbirdz"
                                        target="_blank"
                                        rel="noopener noreferrer nofollow">
                                        {"https://warpcast.com/~/channel/songbirdz"}
                                    </a>
                                </li>
                            </ul>
                        </Col>
                    </Row>
                </>
            )}
        </>
    );
};

export default LeaderboardTabSeason4;
