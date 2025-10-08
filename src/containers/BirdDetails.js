import React, { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
    Button,
    Card,
    Col,
    Container,
    ListGroup,
    Row,
} from "react-bootstrap";

import AccountOwner from "../components/AccountOwner";
import BirdAudioFile from "../components/BirdAudioFile";
import BirdTransferModal from "../components/BirdTransferModal";

import { COLLECTIONS, NUM_BIRDS_TOTAL } from "../constants";

import { useFarcasterContext } from "../contexts/farcaster";
import { useGiftContext } from "../contexts/gift";
import { useIdentificationContext } from "../contexts/identification";
import { useWalletContext } from "../contexts/wallet";

import useBird from "../hooks/useBird";

import baseLogo from "../images/base-logo-blue.svg";
import etherscanLogo from "../images/etherscan-logo-circle.svg";
import openseaLogo from "../images/opensea-logomark-blue.svg";
import farcasterLogo from "../images/farcaster-logo.png";

import "./BirdDetails.css";

const BirdDetails = () => {

	const params = useParams();

	const context = useWalletContext();

	const {
		isBaseApp,
		isFarcasterApp,
		fComposeCast,
		fOpenExternalURL,
		fPopulateUsers,
	} = useFarcasterContext();

	const { setBirdToGift } = useGiftContext();

	const {
		isIdentifyingBird,
		txMint,
		setIsIdentifyingBird,
		setBirdToID,
	} = useIdentificationContext();

	const { account } = context;

	// Get the bird details
	const [bird] = useBird({
		context,
		id: parseInt(params.id, 10),
		cached: true,
	});

	const [birdOwner, setBirdOwner] = useState(null);

	// Keep track of the state of the transfer modal
	const [showTransferModal, setShowTransferModal] = useState(false);

	const isOwner = (account && bird) ? bird?.owner?.toLowerCase() === account?.toLowerCase() : false;
	const isAdmin = isOwner && account?.toLowerCase() === "0x2d437771f6fbedf3d83633cbd3a31b6c6bdba2b1";

	const renderLeftArrowBtn = useCallback((rBird, btnClassName) => {

		if (rBird.id === 0) { return null; }

		return (
			<Link
				className={`btn btn-outline-primary ${btnClassName}`}
				to={`/collection/${rBird.id - 1}`}>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="16"
					height="16"
					fill="currentColor"
					className="bi bi-arrow-left"
					viewBox="0 0 16 16">
					<path
						fillRule="evenodd"
						d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8" />
				</svg>
			</Link>
		);

    }, []);

	const renderRightArrowBtn = useCallback((rBird, btnClassName) => {

		if (rBird.id === (NUM_BIRDS_TOTAL - 1)) { return null; }

		return (
			<Link
				className={`btn btn-outline-primary ${btnClassName}`}
				to={`/collection/${rBird.id + 1}`}>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="16"
					height="16"
					fill="currentColor"
					className="bi bi-arrow-right"
					viewBox="0 0 16 16">
					<path
						fillRule="evenodd"
						d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8" />
				</svg>
			</Link>
		);

	}, []);

	const renderSocialButtons = useCallback((rBird) => {

		return (
			<>
				<a
					href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out this ${rBird.species} in the @songbirdz_cc collection on @base!\n\n`)}`}
					className="twitter-share-button"
					data-show-count="false"
					data-size="large"
					data-hashtags="birds,birdwatching,nfts">
					{"X"}
				</a>
				{(isBaseApp || isFarcasterApp) &&
					<a
						className="farcaster-share-button ms-4"
						href={`https://farcaster.xyz/~/compose?text=${encodeURIComponent(`Check out this ${rBird.species} in the Songbirdz collection!\n\nhttps://songbirdz.cc/collection/${rBird.id}\n\n`)}&channelKey=songbirdz&embeds[]=${encodeURIComponent(rBird.imageLg)}&embeds[]=${encodeURIComponent(`https://songbirdz.cc/collection/${rBird.id}`)})}`}
						target="_blank"
						rel="noopener noreferrer"
						onClick={(event) => fComposeCast(event, {
							text: `Check out this ${rBird.species} in the Songbirdz collection!\n\nhttps://songbirdz.cc/collection/${rBird.id}\n\n`,
							embeds: [
								rBird.imageLg,
								`https://songbirdz.cc/collection/${rBird.id}`,
							],
							channelKey: 'songbirdz',
						})}>
						<div className="d-flex align-items-center justify-content-center">
							{isBaseApp &&
								<img
									className="me-2"
									src={baseLogo}
									alt=""
									style={{ width: "30px", height: "30px" }} />
							}
							{isFarcasterApp &&
								<img
									className="farcaster-logo me-2"
									src={farcasterLogo}
									alt=""
									style={{ width: "30px", height: "30px" }} />
							}
						</div>
					</a>
				}
				{isOwner &&
					<button
						className="gift-button ms-3"
						title={`Send ${rBird.name} as a gift`}
						onClick={() => setBirdToGift(rBird)}>
						<i
							className="fa-solid fa-gift"
							style={{ fontSize: "25px", verticalAlign: "middle" }} />
					</button>
				}
				<a
					className="btn btn-clear ms-3"
					href={`https://opensea.io/assets/base/${context.contractAddress}/${rBird.id}`}
					rel="noopener noreferrer nofollow"
					target="_blank"
					title={`View ${rBird.name} on OpenSea`}
					onClick={fOpenExternalURL}>
					<img
						alt=""
						src={openseaLogo}
						style={{
							width: "30px",
							height: "auto",
						}} />
				</a>
				<a
					className="btn btn-clear"
					href={`https://basescan.org/token/${context.contractAddress}?a=${rBird.id}`}
					rel="noopener noreferrer nofollow"
					target="_blank"
					title={`View ${rBird.name} on BaseScan`}
					onClick={fOpenExternalURL}>
					<img
						alt=""
						src={etherscanLogo}
						style={{
							width: "30px",
							height: "auto",
						}} />
				</a>
				{isAdmin && (
					<>
						<Button onClick={() => setShowTransferModal(true)}>
							{"Send"}
						</Button>
						{showTransferModal && (
							<BirdTransferModal
								context={context}
								bird={rBird}
								isOpen
								onToggle={() => setShowTransferModal(false)} />
						)}
					</>
				)}
			</>
		);

	}, [
		context,
		isBaseApp,
		isFarcasterApp,
		isAdmin,
		isOwner,
		showTransferModal,
		fComposeCast,
		setBirdToGift,
		setShowTransferModal,
	]);

    // Re-load the twitter share button if the bird ID or species changes
    useEffect(() => {

        if (bird && window.twttr?.widgets) {
            window.twttr.widgets.load(document.getElementById("details-page"));
        }

    }, [bird?.id, bird?.species]);

    // Add farcaster user data for the bird's current owner
	useEffect(() => {

		const populate = async () => {

			if (!bird?.owner) {
				setBirdOwner(null);
				return;
			}

			const result = await fPopulateUsers([{ address: bird.owner }]);

			setBirdOwner(result[0]);

		}

		populate();

	}, [bird?.owner, fPopulateUsers]);

	const collection = bird ? COLLECTIONS[bird.collection] : null;

	if (
		bird &&
		(bird.id < 0 || bird.id >= NUM_BIRDS_TOTAL)
	) {
		return null;
	}

    return (
        <div
			id="details-page"
			className="details-page">
            <Container className="my-4">
                {!bird && (
                    <i className="fa-solid fa-spinner fa-spin fa-xl me-2" />
                )}
                {bird && (
                    <>
                        <Row className="mb-3">
	                        <Col>
								{/* Mobile devices */}
								{bird.owner &&
									<div className="d-flex d-sm-none justify-content-center align-items-center mb-3">
										{renderSocialButtons(bird)}
									</div>
								}
								{/* Mobile devices */}
								<div className="d-flex d-sm-none justify-content-between">
									{bird.id > 0 ? renderLeftArrowBtn(bird, "") : <div />}
									{bird.id < (NUM_BIRDS_TOTAL - 1) ? renderRightArrowBtn(bird, "") : <div />}
								</div>
								{/* Non-mobile devices */}
								<div className="d-none d-sm-flex align-items-center flex-wrap">
									{renderLeftArrowBtn(bird, "me-auto")}
									{bird.owner &&
										<div
											className="flex align-items-center ms-auto me-auto"
											key={bird.id}>
											{renderSocialButtons(bird)}
										</div>
									}
									{renderRightArrowBtn(bird, "ms-auto")}
								</div>
	                        </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Card>
                                    <Row>
                                        <img
                                            key={bird.imageLg}
                                            alt=""
                                            className="col-12 col-sm-6 col-md-4"
                                            src={bird.imageLg}
                                            srcSet={`${bird.image} 256w, ${bird.imageLg} 768w`}
                                            sizes="(max-width: 576px) 256px, 768px" />
                                        <Card.Body className="col-12 col-sm-6 col-md-8 d-flex flex-column">
                                            <Card.Title
                                                as="h2"
                                                className="ms-3 ms-md-0">
                                                {bird.name}
                                            </Card.Title>
                                            {collection && (
                                                <Card.Text className="ms-3 ms-md-0">
                                                    <span>{`One of ${collection.count} in the `}</span>
                                                    <Link
                                                        className="text-success"
                                                        to={`/collection?number=${bird.collection}`}>
                                                        {collection.name}
                                                    </Link>
                                                    <span>{" flock."}</span>
                                                </Card.Text>
                                            )}
                                            <ListGroup
                                                className="mb-3"
                                                variant="flush">
                                                <ListGroup.Item className="list-group-item-owner">
                                                    <span className="w-50 fw-bold">
                                                        {"Owner"}
                                                    </span>
                                                    {bird.owner ? (
                                                    	<>
							                                {birdOwner ? (
																<AccountOwner
																	className="w-50 justify-center"
																	user={birdOwner}
																	showLinkToProfile />
															) : (
																<span><i className="fa-solid fa-spinner fa-spin" /></span>
															)}
                                                     	</>
                                                    ) : (
                                                        <span className="w-50 text-center">
                                                            {"None"}
                                                        </span>
                                                    )}
                                                </ListGroup.Item>
                                                <ListGroup.Item className="list-group-item-species">
                                                    <span className="w-50 fw-bold">
                                                        {"Species"}
                                                    </span>
                                                    <span className="w-50 text-center">
                                                        {bird.species ||
                                                            "ERROR"}
                                                    </span>
                                                </ListGroup.Item>
                                                <ListGroup.Item className="list-group-item-song-audio">
                                                    <span className="w-50 fw-bold">
                                                        {"Song Audio"}
                                                    </span>
                                                    <BirdAudioFile
                                                        className="w-50 text-center py-1"
                                                        bird={bird} />
                                                </ListGroup.Item>
                                            </ListGroup>
                                            {!bird.owner && (
                                                <div className="d-grid gap-2">
                                                    <Button
                                                        disabled={isIdentifyingBird || txMint?.pending}
                                                        size="lg"
                                                        variant="info"
                                                        onClick={() => {
                                                            setIsIdentifyingBird(true);
                                                            setBirdToID(bird);
                                                        }}>
                                                        {"Identify"}
                                                    </Button>
                                                </div>
                                            )}
                                        </Card.Body>
                                    </Row>
                                </Card>
                            </Col>
                        </Row>
                    </>
                )}
            </Container>
        </div>
    );
};

export default BirdDetails;
