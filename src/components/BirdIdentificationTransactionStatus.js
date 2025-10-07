import React, { useState } from "react";
import PropTypes from "prop-types";
import { Button, Toast } from "react-bootstrap";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import { useFarcasterContext } from "../contexts/farcaster";

import baseLogo from "../images/base-logo-blue.svg";
import farcasterLogo from "../images/farcaster-logo.png";

import "./BirdIdentificationTransactionStatus.css";

dayjs.extend(relativeTime);

const BirdIdentificationTransactionStatus = (props) => {

	const {
		tx,
		onClose,
		// onSendGift,
	} = props;

	const {
		isBaseApp,
		isFarcasterApp,
		fComposeCast,
		fOpenExternalURL,
	} = useFarcasterContext();

	const [isOpen, setIsOpen] = useState(true);

	const handleClose = () => {
		setIsOpen(false);
		onClose();
	};

	let variant;
	let message;

	if (!tx) { return null; }

	if (tx.success) {

		const birdId = parseInt(tx.idEvent?.args?.birdId, 10);
		const speciesNameGuess = tx.idEvent?.args?.speciesName;

		// Check if the bird species was successfully identified
		if (tx.transferEvent) {

			variant = "info-subtle";
			message = `You correctly identified Songbird #${birdId} as a ${speciesNameGuess}. You are now the proud owner!`;

			// Check if it is the "paradox nft" winning species
			if (birdId === parseInt(process.env.REACT_APP_FLOCK_PARADOX_NFT_WINNER, 10)) {
				message = `You correctly identified Songbird #${birdId} as a ${speciesNameGuess}. You are now the proud owner, and you've also found the "Paradox (Javpixel)" hidden bonus prize, so you will be sent Paradox NFT #1251 (reach out to @dry_tortuga on X to confirm your prize)!`;
			}

			// Check if it is the "ok-boomer nft" winning species
			if (birdId === parseInt(process.env.REACT_APP_FLOCK_OKBOOMER_NFT_WINNER, 10)) {
				message = `You correctly identified Songbird #${birdId} as a ${speciesNameGuess}. You are now the proud owner, and you've also found the "OK Boomer" hidden bonus prize, so you will be sent OK Boomer NFT #579 (reach out to @dry_tortuga on X to confirm your prize)!`;
			}

			// Check if it is the "chilibangs nft" winning species
			if (birdId === parseInt(process.env.REACT_APP_FLOCK_CHILIBANGS_NFT_WINNER, 10)) {
				message = `You correctly identified Songbird #${birdId} as a ${speciesNameGuess}. You are now the proud owner, and you've also found the "Chilibangs" hidden bonus prize, so you will be sent Chilibangs NFT #9693 (reach out to @dry_tortuga on X to confirm your prize)!`;
			}

			// Check if it is the first "base-bulls nft" winning species
			if (birdId === parseInt(process.env.REACT_APP_FLOCK_BASEBULLS_1_NFT_WINNER, 10)) {
				message = `You correctly identified Songbird #${birdId} as a ${speciesNameGuess}. You are now the proud owner, and you've also found a "Base Bulls" hidden bonus prize, so you will be sent Base Bulls NFT #8312 (reach out to @dry_tortuga on X to confirm your prize)!`;
			}

			// Check if it is the first "base-bulls nft" winning species
			if (birdId === parseInt(process.env.REACT_APP_FLOCK_BASEBULLS_2_NFT_WINNER, 10)) {
				message = `You correctly identified Songbird #${birdId} as a ${speciesNameGuess}. You are now the proud owner, and you've also found a "Base Bulls" hidden bonus prize, so you will be sent Base Bulls NFT #8486 (reach out to @dry_tortuga on X to confirm your prize)!`;
			}

			// Check if it is the first "base-bulls nft" winning species
			if (birdId === parseInt(process.env.REACT_APP_FLOCK_BASEBULLS_3_NFT_WINNER, 10)) {
				message = `You correctly identified Songbird #${birdId} as a ${speciesNameGuess}. You are now the proud owner, and you've also found a "Base Bulls" hidden bonus prize, so you will be sent Base Bulls NFT #8687 (reach out to @dry_tortuga on X to confirm your prize)!`;
			}

		// Otherwise, the bird species was not identified correctly
		} else {

			variant = "danger-subtle";
			message = `You incorrectly identified Songbird #${birdId} as a ${speciesNameGuess}. Please try again!`;

		}

	} else if (tx.error && tx.errorMsg) {

		variant = "danger-subtle";
		message = `${tx.errorMsg.name}: ${tx.errorMsg.details}`;

	} else if (tx.pending) {

		variant = "info-subtle";

		if (tx.transaction) {
			message = "Hang tight, we're trying to verify your submission!";
		} else {
			message = "Please confirm the submission in your wallet. After submitting, it may take a few seconds to verify your guess!";
		}

	}

	if (!message || !variant) { return null; }

	return (
		<Toast
			className="fs-6"
			bg={variant}
			show={isOpen}
			onClose={handleClose}>
			<Toast.Header
				className="position-relative"
				style={{ borderRadius: 0 }}
				closeButton>
				<img
					src={baseLogo}
					className="me-2"
					style={{ width: "20px", height: "20px" }}
					alt="" />
				<strong>
					{"Base"}
				</strong>
				{tx.transactionHash &&
					<span className="ms-1 me-auto">
						{" - "}
						<a
							href={`${process.env.REACT_APP_BASESCAN_URL}/tx/${tx.transactionHash}`}
							target="_blank"
							rel="noopener noreferrer nofollow"
							onClick={fOpenExternalURL}>
							{tx.transactionHash.slice(0, 8)}
						</a>
					</span>
				}
				{tx.timestamp &&
					<small>{dayjs(tx.timestamp).fromNow()}</small>
				}
			</Toast.Header>
			<Toast.Body>
				<div className="mb-1 text-center fw-bold">
					{message}
				</div>
				{tx.bird && tx.transferEvent && (
					<>
						<img
							src={tx.bird.image}
							className="mb-2"
							style={{
								width: "60%",
								height: "auto",
								marginLeft: "20%",
								marginRight: '20%',
								borderRadius: 8,
							}}
							alt="" />
						<div className="d-grid gap-2">
							<Button
								href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`I just identified this ${tx.bird.species} in the @songbirdz_cc collection on @base!\n\nhttps://songbirdz.cc/collection/${tx.bird.id}\n\nThink you have what it takes to identify a new bird?`)}&url=${encodeURIComponent(tx.bird.imageLg)}`}
								variant="outline-primary"
								as="a"
								target="_blank"
								rel="noopener noreferrer"
								data-show-count="false"
								data-hashtags="birds,birding,nfts,based"
								onClick={fOpenExternalURL}>
								<div className="d-flex align-items-center justify-content-center">
									<i
										className="fa-brands fa-x-twitter me-2"
										style={{
											fontSize: "20px",
											marginTop: "-1px",
										}} />
									{'Share on X'}
								</div>
							</Button>
							{(isBaseApp || isFarcasterApp) &&
								<Button
									href={`https://farcaster.xyz/~/compose?text=${encodeURIComponent(`I just identified this ${tx.bird.species} in the Songbirdz collection!\n\nhttps://songbirdz.cc/collection/${tx.bird.id}\n\nThink you have what it takes to identify a new bird?`)}&channelKey=songbirdz&embeds[]=${encodeURIComponent(tx.bird.imageLg)}&embeds[]=${encodeURIComponent(`https://songbirdz.cc/collection/${tx.bird.id}`)}`}
									variant="outline-primary"
									className="farcaster-share-button"
									as="a"
									target="_blank"
									rel="noopener noreferrer"
									onClick={(event) => fComposeCast(event, {
										text: `I just identified this ${tx.bird.species} in the Songbirdz collection!\n\nhttps://songbirdz.cc/collection/${tx.bird.id}\n\nThink you have what it takes to identify a new bird?`,
										embeds: [
											tx.bird.imageLg,
											`https://songbirdz.cc/collection/${tx.bird.id}`,
										],
										channelKey: 'songbirdz',
									})}>
									<div className="d-flex align-items-center justify-content-center">
										{isBaseApp &&
											<>
												<img
													className="me-2"
													src={baseLogo}
													alt=""
													style={{ width: "20px", height: "20px" }} />
												<span>
													{'Share on Base App'}
												</span>
											</>
										}
										{isFarcasterApp &&
											<>
												<img
													className="me-2"
													src={farcasterLogo}
													alt=""
													style={{ width: "20px", height: "20px" }} />
												<span>
													{'Share on Farcaster'}
												</span>
											</>
										}
									</div>
								</Button>
							}
						</div>
					</>
				)}
			</Toast.Body>
		</Toast>
	);

};

BirdIdentificationTransactionStatus.propTypes = {
	tx: PropTypes.shape({
		success: PropTypes.bool,
		error: PropTypes.bool,
		pending: PropTypes.bool,
		transaction: PropTypes.any,
		transactionHash: PropTypes.string,
		timestamp: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.instanceOf(Date)]),
		idEvent: PropTypes.shape({
			args: PropTypes.shape({
				birdId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
				speciesName: PropTypes.string,
			}),
		}),
		transferEvent: PropTypes.any,
		errorMsg: PropTypes.shape({
			name: PropTypes.string,
			details: PropTypes.string,
		}),
		bird: PropTypes.shape({
			id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
			image: PropTypes.string,
			imageLg: PropTypes.string,
			species: PropTypes.string,
		}),
	}),
	onClose: PropTypes.func.isRequired,
	onSendGift: PropTypes.func,
};

export default BirdIdentificationTransactionStatus;
