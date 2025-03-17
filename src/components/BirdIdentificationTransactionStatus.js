import React, { useState } from "react";
import { Toast } from "react-bootstrap";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import { useWalletContext } from "../contexts/wallet";
import warpcastLogo from "../images/warpcast-logo.png";

import "./BirdIdentificationTransactionStatus.css";

dayjs.extend(relativeTime);

const BirdIdentificationTransactionStatus = (props) => {

    const {
        tx,
        onClose,
        onSendGift,
    } = props;

    const { contractAddress } = useWalletContext();

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

            // Check if it is one of the "1 of 1" species
            if (
                birdId === parseInt(process.env.REACT_APP_FLOCK_RARE_BIRD_1, 10) ||
                birdId === parseInt(process.env.REACT_APP_FLOCK_RARE_BIRD_2, 10) ||
                birdId === parseInt(process.env.REACT_APP_FLOCK_RARE_BIRD_3, 10) ||
                birdId === parseInt(process.env.REACT_APP_FLOCK_RARE_BIRD_4, 10)
            ) {
                message = `You correctly identified Songbird #${birdId} as a ${speciesNameGuess}. This is a "1 of 1", so it is the only ${speciesNameGuess} in the entire Songbirdz collection. You are now the proud owner!`;
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
                    src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIUAAACFCAMAAABCBMsOAAAAe1BMVEX///8AUf5+mPoAS/4ASf4ATv4ARf4AP/4APf4AQ/4AO/7O2PsATP0AN/z2+f0AQf4oWv0ANP6tvfzk6f3t8vzV3vxWffuMo/vByvxCaP1xiP2xwftzj/pnhPxtivvd4/w1XvtFbPuktft5lPtYev6erfzEzvvH0/sVVPwgJMTvAAADWUlEQVR4nO2ba5ejIAyGtYp3vGtt7U07dvv/f+G2485ZdxYQBNvMOTzfpS8hJAFSw9BoNBqNRqPRaBiURRWGYVWUb/r5qtnWaRRZ9hMritJ621QvFVO2+x3yHAuZf0GW40W7ffsiIXF+9Dx7KmAixfZw3cera6iuDxsQFXzxsMkhXFdDjRymhBHH+lhPR7HHbDNMDIKP51U0xFdsc2oYdRxWcNTbxRfQ8MRPG9UiDgl5V7BA7kmphvOFxyn/x0krdSIak9crv2OZrSoR7YLV+AK5uRoRQ7ZYw5Nsq0LE1pUSYZruRl7EICviIUPaGq3ccoxkkr7RJApEPKwhtVPO5vLdMQWZMnHjsjROfMdKl4u4LouYJJzFwfymxilG3IWpLb5EClWgdFmi38ymcmQnOMMBzgKXUohO8A9LRBR4RkKCulMeFmVZFmF+6sy5bIOXVF8nZmUV+eZQTYvtuOrvPnMJraO4iCpg2SHoSM7WdAHLHli8JK4ZpnBSWkjOU8bmtj5ERVQM4/p1Qf2uqBk+bYkaY0Of00ym3tCTsCO6TehD+f3Mpz19Ap7Y4TGnjuTOiXjIoE7BEUvxR1oa83kKJ2q8s2oREaVHmwzfMDXNlFgkjDcUFSil744pRUqJG55IuUOLmwHvuuaUmGfv+UXEO/JUoo57iI4cb9COf0nO5ImYPr89G4qDRvyl343sFsjkHsEw7mRzevzFzkCeSDIIqOjJhZrDfzY5kp0TiRTSFdkWAhHjQhwBdSLxN+7Ig/AX42T/tsXK6JNrE3B83u9LcvhO5jPIlNt1Q4TXoAVZRfBLSIUsZ7JzZnzRWxUVRcVrL/4pKoTy4WoqXmwLGH4BY4/AiBdqYudeMnaqySPkSkkgj8DIqSrqi0G6vlBRa1FuBwVqLQV1Zytfd8KowWGcR4CczWCcU2Gc2Ve7vxBLRTDucoDca8G444Nx3wnk7nf2Hvze/3MPbqxyDy74JnDoTHeNNwGu9xF3fB/Bq72PAHkrgvFuBuQNEch7KpC3ZRjv7EB6DoD0XwDpRQHSlyPZo+Qp6lEC0q8FpHfNgNHHZwDpaQTS32nA6HV9AqHv91MHgB7oJ3F+DN7dD/7J2Bvvv7M3/o+Q9/9PYCLmvf+Z0Gg0Go1Go9H8FH4DTzdB0FKEuY4AAAAASUVORK5CYII="
                    className="rounded me-2"
                    style={{ width: "20px", height: "20px" }}
                    alt="" />
                <strong>{"Base"}</strong>
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
                                    href={`https://warpcast.com/~/compose?text=${encodeURIComponent(`I just identified this ${tx.bird.species} in the Songbirdz collection on @base!\n\nhttps://songbirdz.cc/collection/${tx.bird.id}\n\nThink you have what it takes to identify a new bird onchain?`)}&channelKey=songbirdz&embeds[]=${encodeURIComponent(tx.bird.imageLg)}&embeds[]=${encodeURIComponent(`https://songbirdz.cc/collection/${tx.bird.id}`)})}`}
                                    className="farcaster-share-button"
                                    target="_blank"
                                    rel="noopener noreferrer">
                                    <img
                                        src={warpcastLogo}
                                        alt="Warpcast"
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
                                <a
                                    href={`/collection/${tx.bird.id}`}
                                    target="_blank"
                                    rel="noopener noreferrer nofollow">
                                    <i
                                        className="fa-solid fa-arrow-up-right-from-square"
                                        style={{ fontSize: "18px" }} />
                                </a>
                            </span>
                        </div>
                    </>
                )}
            </Toast.Body>
        </Toast>
    );
};

export default BirdIdentificationTransactionStatus;
