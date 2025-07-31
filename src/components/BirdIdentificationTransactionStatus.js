import React, { useState } from "react";
import { Toast } from "react-bootstrap";
import { Link } from "react-router-dom";
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
        onSendGift,
    } = props;

    const { fComposeCast } = useFarcasterContext();

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

            variant = "success";
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
            variant = "danger";
            message = `You incorrectly identified Songbird #${birdId} as a ${speciesNameGuess}. Please try again!`;
        }

    } else if (tx.error && tx.errorMsg) {

        variant = "danger";
        message = `${tx.errorMsg.name}: ${tx.errorMsg.details}`;

    } else if (tx.pending) {

        variant = "info";

        if (tx.transaction) {
            message = "Hang tight, we're trying to verify your submission!";
        } else {
            message =
                "Please confirm the submission in your wallet. After submitting, it may take a few seconds to verify your guess!";
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
                            rel="noopener noreferrer nofollow">
                            {tx.transactionHash.slice(0, 8)}
                        </a>
                    </span>
                }
                {tx.timestamp &&
                    <small>{dayjs(tx.timestamp).fromNow()}</small>
                }
            </Toast.Header>
            <Toast.Body className="text-white">
                <div className="mb-1 text-center">
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
                            alt=""
                        />
                        <div className="bg-white rounded text-black p-2 d-flex align-items-center">
                            <span className="me-2">{"Show it off:"}</span>
                            <span
                                id="bird-identification-tx-status-twitter-share-btn"
                                className="me-3">
                                <a
                                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`I just identified this ${tx.bird.species} in the @songbirdz_cc collection on @base!\n\nhttps://songbirdz.cc/collection/${tx.bird.id}\n\nThink you have what it takes to identify a new bird onchain?`)}`}
                                    className="twitter-share-button"
                                    data-show-count="false"
                                    data-hashtags="birds,birding,nfts,based">
                                    <i
                                        className="fa-brands fa-x-twitter"
                                        style={{
                                            fontSize: "20px",
                                            marginTop: "3px",
                                        }} />
                                </a>
                            </span>
                            <span className="me-3">
                                <a
                                    href={`https://farcaster.xyz/~/compose?text=${encodeURIComponent(`I just identified this ${tx.bird.species} in the Songbirdz collection!\n\nhttps://songbirdz.cc/collection/${tx.bird.id}\n\nThink you have what it takes to identify a new bird?`)}&channelKey=songbirdz&embeds[]=${encodeURIComponent(tx.bird.imageLg)}&embeds[]=${encodeURIComponent(`https://songbirdz.cc/collection/${tx.bird.id}`)}`}
                                    className="farcaster-share-button"
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
                                    <img
                                        src={farcasterLogo}
                                        alt="Farcaster"
                                        style={{ width: "20px", height: "20px" }} />
                                </a>
                            </span>
                            <span className="me-3">
                                <button
                                    className="gift-button"
                                    title={`Send ${tx.bird.name} as a gift`}
                                    onClick={() => onSendGift(tx.bird)}>
                                    <i
                                        className="fa-solid fa-gift"
                                        style={{ fontSize: "18px", marginTop: "3px" }} />
                                </button>
                            </span>
                            <span className="ms-auto">
                                <Link to={`/collection/${tx.bird.id}`}>
                                    <i
                                        className="fa-solid fa-arrow-up-right-from-square"
                                        style={{ fontSize: "18px" }} />
                                </Link>
                            </span>
                        </div>
                    </>
                )}
            </Toast.Body>
        </Toast>
    );
};

export default BirdIdentificationTransactionStatus;
