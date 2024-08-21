import React, { useState } from "react";
import { Toast, ToastContainer } from "react-bootstrap";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import "./BirdIdentificationTransactionStatus.css";

dayjs.extend(relativeTime)

const BirdIdentificationTransactionStatus = (props) => {

	const { tx, onClose } = props;

	const [isOpen, setIsOpen] = useState(true);

	const handleClose = () => {

		setIsOpen(false);

		onClose();

	};

	let variant;
	let message;

	if (!tx) {
		return null;
	}

	console.debug(tx);

	if (tx.success) {

		const birdId = parseInt(tx.idEvent?.args?.birdId, 10);
		const speciesNameGuess = tx.idEvent?.args?.speciesName;

		// Check if the bird species was successfully identified
		if (tx.transferEvent) {

			variant = "success";
			message = `You correctly identified Songbird #${birdId} as a ${speciesNameGuess}. You are now the proud owner!`;

			// Check if it is one of the "1 of 1" species...
			if (birdId === 2844 || birdId === 2603 || birdId === 2673 || birdId === 2574 || birdId === 2202) {
				message = `You correctly identified Songbird #${birdId} as a ${speciesNameGuess}. This is a "1 of 1", so it is the only ${speciesNameGuess} in the entire Songbirdz collection. You are now the proud owner!`;
			}

		// Otherwise, the bird species was not identified correctly
		} else {

			variant = "danger";
			message = `You incorrectly identified Songbird #${birdId} as a ${speciesNameGuess}. Please try again!`;

		}

	} else if (tx.error) {

		variant = "danger";
		message = `${tx.errorMsg.name}: ${tx.errorMsg.details}`;

	}

	return (
		<ToastContainer
			className="p-3"
			style={{ zIndex: 5 }}
			position="top-end">
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
					<strong>
						{"Base"}
					</strong>
					<span className="ms-1 me-auto">
						{" - "}
						<a
							href={`${process.env.REACT_APP_BASESCAN_URL}/tx/${tx.transactionHash}`}
							target="_blank"
							rel="noopener noreferrer nofollow">
							{tx.transactionHash.slice(0, 8)}
						</a>
					</span>
					<small>
						{dayjs(tx.timestamp).fromNow()}
					</small>
				</Toast.Header>
				<Toast.Body className="text-white">
					<span>{message}</span>
				</Toast.Body>
			</Toast>
		</ToastContainer>
	);

};

export default BirdIdentificationTransactionStatus;
