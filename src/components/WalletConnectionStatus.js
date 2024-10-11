import React, { useState } from "react";
import { Toast } from "react-bootstrap";

import { useWalletContext } from "../contexts/wallet";

const WalletConnectionStatus = ({ onClose }) => {

	const context = useWalletContext();

	let message;

	if (!context.account) {

		message = "Please connect your wallet to get started identifying birds...";

	} else if (!context.isOnCorrectChain) {

		message = "Double check to make sure you're on the Base network...";

	} else {

		return null;

	}

	return (
		<Toast
			className="fs-6 mt-5"
			bg="info"
			delay={5000}
			autohide
			show
			onClose={onClose}>
			<Toast.Body className="text-white">
				<span>{message}</span>
			</Toast.Body>
		</Toast>
	);

};

export default WalletConnectionStatus;
