import React, { useEffect } from "react";
import { Col, Row } from "react-bootstrap";

import { useWalletContext } from "../contexts/wallet";

import useLeaderboard from "../hooks/useLeaderboard";

import LeaderboardTable from "./LeaderboardTable";

const LeaderboardTabSeason3 = ({ onUserClick }) => {

    const { account } = useWalletContext();

    // Get the list of users in the top 50
    const { data } = useLeaderboard({ account, season: 3 });

    // Re-load the twitter share button
	useEffect(() => {

		if (window.twttr?.widgets && data?.users) {

			window.twttr.widgets.load(
				document.getElementById("season-3-share-on-x-btn")
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
                    {data?.users && (
                        <>
                            <LeaderboardTable
                                users={data.users}
                                onUserClick={onUserClick}
                            />
                            <div className="text-center">
                                {data.timestampMessage}
                            </div>
                        </>
                    )}
                </Col>
            </Row>
            {data?.users && (
                <>
                    <Row className="mb-3">
                        <Col>
                            <h2 className="d-flex align-items-center">
                                <span className="me-auto">
                                    {"Big Onchain Winter - Season 3"}
                                </span>
                            </h2>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <p>
                                {"Accounts with the most Birder Points at the end of Season 3 will receive:"}
                            </p>
                            <ul style={{ listStyle: "disc" }}>
                                <li>
                                    <strong>{"Top 10 -> "}</strong>
                                    {"1 "}
                                    <a
                                        href="https://x.com/ShibaPunkz"
                                        target="_blank"
                                        rel="noopener noreferrer nofollow"
                                    >
                                        {"Based ShibaPunkz"}
                                    </a>
                                    {" NFT each"}
                                </li>
                                <li>
                                    <strong>{"Top 10 -> "}</strong>
                                    {"1 "}
                                    <a
                                        href="https://x.com/BaseBullsNFT"
                                        target="_blank"
                                        rel="noopener noreferrer nofollow"
                                    >
                                        {"BaseBulls"}
                                    </a>
                                    {" NFT each"}
                                </li>
                                <li>
                                    <strong>{"Top 10 -> "}</strong>
                                    {"$3.50 worth of "}
                                    <a
                                        href="https://x.com/toastonbase"
                                        target="_blank"
                                        rel="noopener noreferrer nofollow">
                                        {"TOAST"}
                                    </a>
                                    {" each... enough to treat yourself to a nice loaf of bread"}
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
                                    rel="noopener noreferrer"
                                >
                                    {"Big Year"}
                                </a>
                                {
                                    " is a competition among birders to identify as many species of birds as possible by sight/sound, within a single calendar year and specific geographic area. The North American Big Year record is 840 species, set by John Weigel in 2019!"
                                }
                            </p>
                            <p>
                                {
                                    "Now, we all know onchain has no geographic limits, so we'll recreate this competition using the 350 different species of birds in the Songbirdz collection that are out in the wild right now on Base."
                                }
                            </p>
                            <h3>{"1. Onchain Bird Watching"}</h3>
                            <p>
                                {"For each "}
                                <strong>{"unique species"}</strong>
                                {" of bird that you add to your "}
                                <a
                                    href="https://en.wikipedia.org/wiki/Life_list"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {"Life List"}
                                </a>
                                {
                                    ", you will earn a corresponding amount of Birder Points:"
                                }
                            </p>
                            <ul style={{ listStyle: "disc" }}>
                                <li>
                                    <b>{"10 points:"}</b>
                                    {
                                        " Identify a new species in the wild (i.e. minting for 0.0015 ETH)"
                                    }
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
                                        rel="noopener noreferrer"
                                    >
                                        {"ERC-721"}
                                    </a>
                                    {
                                        " transfer for any other reason or action (i.e. an airdrop, purchase on OpenSea < 0.0015 ETH, gift from a friend, etc.)"
                                    }
                                </li>
                            </ul>
                            <p>
                                {"For each "}
                                <strong>{"unique species"}</strong>
                                {
                                    " in your Life List you will earn points from the action which is worth the most amount of points."
                                }
                            </p>
                            <p>
                                {
                                    "Example #1: if you receive a Bald Eagle as an airdrop, go out and identify a second Bald Eagle in the wild, and then purchase a third Bald Eagle on OpenSea... you would only earn 10 Birder Points... not 14."
                                }
                            </p>
                            <p>
                                {
                                    "Example #2: if you identify (i.e. mint) 3 birds of the same species (i.e. 3 Bald Eagles)... you would only earn 10 Birder Points... not 30."
                                }
                            </p>
                            <h3>{"2. Other Ways to Earn Birder Points"}</h3>
                            <p>
                                {
                                    "In addition to the game above, you can also earn points and help support the project by:"
                                }
                            </p>
                            <ul style={{ listStyle: "disc" }}>
                                <li>
                                    <b>{"25 points (X Campaign):"}</b>
                                    {
                                        " Share a bird that you own on X and tell us, in your own words, why you think the Songbirdz project is interesting!"
                                    }
                                    <ul style={{ listStyle: "disc" }}>
                                        <li>
                                            {"You must follow "}
                                            <a
                                                href="https://x.com/dry_tortuga"
                                                target="_blank"
                                                rel="noopener noreferrer nofollow"
                                            >
                                                {"@dry_tortuga"}
                                            </a>
                                        </li>
                                        <li>
                                            {"You must follow and tag "}
                                            <a
                                                href="https://x.com/songbirdz_cc"
                                                target="_blank"
                                                rel="noopener noreferrer nofollow"
                                            >
                                                {"@songbirdz_cc"}
                                            </a>
                                        </li>
                                        <li>
                                            {"Please include the image/audio for your bird :)"}
                                        </li>
                                        <li id="season-3-share-on-x-btn">
                                            <a
                                                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out the Songbirdz collection on @base!\n\nYOUR OWN WORDS HERE\n\nJoin me and play the bird watching game at `)}`}
                                                className="twitter-share-button"
                                                data-show-count="false"
                                                data-size="large"
                                                data-hashtags="songbirdz,birds,birding,onchain,nfts,gaming"
                                                data-via="songbirdz_cc"
                                                data-url={
                                                    "https://songbirdz.cc/collection?hide_already_identified=true"
                                                }>
                                                {"Share on X"}
                                            </a>
                                        </li>i
                                    </ul>
                                </li>
                                <li>
                                    <b>{"25 points (Farcaster Campaign):"}</b>
                                    {
                                        " Share a bird that you own on Farcaster and tell us, in your own words, why you think the Songbirdz project is interesting!"
                                    }
                                    <ul style={{ listStyle: "disc" }}>
                                        <li>
                                            {"You must follow and tag "}
                                            <a
                                                href="https://warpcast.com/dry-tortuga"
                                                target="_blank"
                                                rel="noopener noreferrer nofollow">
                                                {"@dry-tortuga"}
                                            </a>
                                        </li>
                                        <li>
                                            {"Please include the image/audio for your bird :)"}
                                        </li>
                                        <li>
                                            <a
                                                href={`https://warpcast.com/~/compose?text=${encodeURIComponent(`Check out the Songbirdz collection from @dry-tortuga on @base!\n\nYOUR OWN WORDS HERE\n\nJoin me and play the bird watching game at https://songbirdz.cc/collection?hide_already_identified=true\n\nhttps://songbirdz-collection-farcaster-mint-frame.vercel.app/api`)}`}
                                                className="farcaster-share-button"
                                                target="_blank"
                                                rel="noopener noreferrer nofollow">
                                                {"Share on Farcaster"}
                                            </a>
                                        </li>
                                    </ul>
                                </li>
                                <li>
                                    <b>{"10 points (Join Telegram): "}</b>
                                    <a
                                        href="https://t.me/songbirdz_cc"
                                        target="_blank"
                                        rel="noopener noreferrer nofollow"
                                    >
                                        {"https://t.me/songbirdz_cc"}
                                    </a>
                                </li>
                                <li>
                                    <b>{"10 points (Join Discord): "}</b>
                                    <a
                                        href="https://discord.gg/UKGgRsJXzr"
                                        target="_blank"
                                        rel="noopener noreferrer nofollow"
                                    >
                                        {"https://discord.gg/UKGgRsJXzr"}
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

export default LeaderboardTabSeason3;
